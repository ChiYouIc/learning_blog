---
title: RabbitMQ 其它
sidebar: auto
date: 2022-08-12
categories:
 - 消息中间件
tags:
 - RabbitMQ
---

## 幂等性
### 概念
用户对于同一操作发起的一次请求或者多次请求的结果是一致的，不会因为多次点击而产生了副作用。 举个最简单的例子，那就是支付，用户购买商品后支付，支付扣款成功，但是返回结果的时候网络异常， 此时钱已经扣了，用户再次点击按钮，此时会进行第二次扣款，返回结果成功，用户查询余额发现多扣钱 了，流水记录也变成了两条。在以前的单应用系统中，我们只需要把数据操作放入事务中即可，发生错误 立即回滚，但是再响应客户端的时候也有可能出现网络中断或者异常等等。

### 消息重复消费
消费者在消费 MQ 中的消息时，MQ 已把消息发送给消费者，消费者在给MQ 返回 ack 时网络中断， 故 MQ 未收到确认信息，该条消息会重新发给其他的消费者，或者在网络重连后再次发送给该消费者，但 实际上该消费者已成功消费了该条消息，造成消费者消费了重复的消息。

### 解决思路
MQ 消费者的幂等性的解决一般使用全局 ID 或者写个唯一标识比如时间戳 或者 UUID 或者订单消费 者消费 MQ 中的消息也可利用 MQ 的该 id 来判断，或者可按自己的规则生成一个全局唯一 id，每次消费消 息时用该 id 先判断该消息是否已消费过。

### 消费端的幂等性保障
在海量订单生成的业务高峰期，生产端有可能就会重复发生了消息，这时候消费端就要实现幂等性， 这就意味着我们的消息永远不会被消费多次，即使我们收到了一样的消息。业界主流的幂等性有两种操作：

a. 唯一 ID + 指纹码机制，利用数据库主键去重

b. 利用 redis 的原子性去实现。

#### 唯一ID+指纹码机制
我们的一些规则或者时间戳加别的服务给到的唯一信息码，它并不一定是我们系统生成的，基本都是由我们的业务规则拼接而来，但是一定要保证唯一性，然后就利用查询语句进行判断这个 id 是否存在数据库中。

优势：就是实现简单就一个拼接，然后查询判断是否重复；

劣势：就是在高并发时，如果是单个数据库就会有写入性能瓶颈当然也可以采用分库分表提升性能，但也不是我们最推荐的方式。

#### Redis 原子性
利用 Redis 执行 setnx 命令，天然具有幂等性，从而实现不重复消费。

## 优先级队列
### 使用场景
在我们系统中有一个`订单催付`的场景，我们的客户在天猫下的订单，淘宝会及时将订单推送给我们，如果在用户设定的时间内未付款那么就会给用户推送一条短信提醒，很简单的一个功能对吧，但是，tmall 商家对我们来说，肯定是要分大客户和小客户的对吧，比如像苹果，小米这样大商家一年起码能给我们创造很大的利润，所以理应当然，他们的订单必须得到优先处理，而曾经我们的后端系统是使用 redis 来存 放的定时轮询，大家都知道 redis 只能用 List 做一个简简单单的消息队列，并不能实现一个优先级的场景，所以订单量大了后采用 RabbitMQ 进行改造和优化，如果发现是大客户的订单给一个相对比较高的优先级，否则就是默认优先级。

### 代码演示
#### 生产者
```java
public class Producer {

    private static final String QUEUE_NAME = "hello";

    public static void main(String[] args) {
        try (Channel channel = RabbitMqUtils.getChannel()) {
            AMQP.BasicProperties priorityProperties = new AMQP.BasicProperties().builder().priority(5).build();

            for (int i = 0; i < 10; i++) {
                String message = "info" + i;
                if (i == 5) {
                    channel.basicPublish("", QUEUE_NAME, priorityProperties, message.getBytes());
                } else {
                    channel.basicPublish("", QUEUE_NAME, null, message.getBytes());
                }
                System.out.println("消息发送完毕：" + message);
            }

        } catch (IOException | TimeoutException e) {
            throw new RuntimeException(e);
        }
    }

}
```
#### 消费者
```java
public class Consumer {

    private static final String QUEUE_NAME = "hello";

    public static void main(String[] args) throws IOException, TimeoutException {
        Channel channel = RabbitMqUtils.getChannel();
        // 设置队列的最大优先级，最大可以设置到 255，官网推荐 1 - 10，设置太卡对内存和CPU要求较高
        Map<String, Object> params = new HashMap<>();
        params.put("x-max-priority", 10);
        channel.queueDeclare(QUEUE_NAME, true, false, false, params);

        System.out.println("消费者启动等待消费.....");
        DeliverCallback deliverCallback = (consumerTag, message) -> {
            String msg = new String(message.getBody());
            System.out.println("接收到消息：" + msg);
        };

        channel.basicConsume(QUEUE_NAME, true, deliverCallback, (consumerTag) -> System.out.println("消费者无法消费消息时调用，如队列被删除"));

    }
}
```
启动生产者：

![image](./images/8Hfktzqg6kDKPWpIniF4Rl2AArmjLjN7IDfwGhP0o-M.png)

控制台：

![image](./images/5VrzIGrrUunFj1BccUn604_zMo1FhDzkGn-HCCYRHro.png)

启动消费者，控制台：

![image](./images/_wqEtcRM9jwx9O0vLh9Xl5JJxqPYQ517s-PP43fGFlg.png)

## 惰性队列
### 使用场景
RabbitMQ 从 3.6.0 版本开始引入了惰性队列的概念。惰性队列会尽可能的将消息存入磁盘中，而在消费者消费到相应的消息时才会被加载到内存中，它的一个重要的设计目标是能够支持更长的队列，即支持更多的消息存储。当消费者由于各种各样的原因(比如消费者下线、宕机亦或者是由于维护而关闭等)而致使长时间内不能消费消息造成堆积时，惰性队列就很有必要了。

默认情况下，当生产者将消息发送到 RabbitMQ 的时候，队列中的消息会尽可能的存储在内存之中， 这样可以更加快速的将消息发送给消费者。即使是持久化的消息，在被写入磁盘的同时也会在内存中驻留一份备份。当 RabbitMQ 需要释放内存的时候，会将内存中的消息换页至磁盘中，这个操作会耗费较长的时间，也会阻塞队列的操作，进而无法接收新的消息。虽然 RabbitMQ 的开发者们一直在升级相关的算法，但是效果始终不太理想，尤其是在消息量特别大的时候。

### 两者模式
队列具备两种模式：`default` 和 `lazy`。默认的为 default 模式，在 3.6.0 之前的版本无需做任何变更。lazy 模式即为惰性队列的模式，可以通过调用 `channel.queueDeclare` 方法的时候在参数中设置，也可以通过 Policy 的方式设置，如果一个队列同时使用这两种方式设置的话，那么 Policy 的方式具备更高的优先级。 如果要通过声明的方式改变已有队列的模式的话，那么只能先删除队列，然后再重新声明一个新的。

在队列声明的时候可以通过 `x-queue-mode`参数来设置队列的模式，取值为 `default` 和 `lazy` 。下面示例中演示了一个惰性队列的声明细节：

```java
Map<String, Object> args = new HashMap();
args.put("x-queue-mode", "lazy");
channel.queueDeclare("myqueue", false, false, false, args);
```
### 内存开销对比
![image](./images/4jrQBZXLalxUiWWqiKyX5n4We3i0xFizHd_wVZaG5xQ.png)

在发送 1 百万条消息，每条消息大概占 1KB 的情况下，普通队列占用内存是 1.2GB，而惰性队列仅仅占用 1.5MB。
