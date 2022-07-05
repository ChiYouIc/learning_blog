---
title: 发布确认
sidebar: auto
date: 2022-07-05
categories:
 - 消息中间件
tags:
 - RabbitMQ
---

生产者将信道设置成 confirm 模式后，`所有在信道上面发布的消息都将会被指派一个唯一的 ID（从 1 开始）` ，一旦消息被投递到所有匹配的队列之后，broker 就会发送一个确认消息给生产者（包含该消息的唯一 ID），这就使得生产者知道消息已经正确到达目的列队了。如果消息和队列是可持久化的，那么确认消息会在将消息写入磁盘之后发出，broker 回传给生产者的确认消息中 `delivery-tag` 参数包含了确认消息的序列号，此外 broker 也可以设置 basic.ack 的 multiple 参数，表示这个序列号之前的所有消息都已经得到了处理。

confirm 模式最大的好处在于它是异步的，一旦发布了一条消息，生产者就可以在等待信道返回确认的同时继续发送下一条消息，当消息最终得到确认之后，生产者便可以通过回调方法来处理该确认消息，如果 RabbitMQ 因为自身内部错误导致消息丢失，就会发送一条 `nack` 消息，生产者同样可以在回调方法中处理该 nack 消息。

## 发布确认模式
发布确认模式默认是没有开启的，开启该模式，需要调用方法 `confirmSelect` 。

```java
Channel channel = RabbitMqUtils.getChannel();
            // 开启发布确认模式
            channel.confirmSelect();
```
### 单个确认发布
这是一种简单的确认方式，是一种 `同步确认发布` 的方式，也就是发布一个消息之后只有它被确认之后消息才能继续发布。`waitForConfirmOrDie(long)` 这个方法只有在消息被确认的时候才会返回，如果在指定的时间内这个消息没有得到确认就会抛出异常。

单个确认发布有一个缺点：`发布速度特别慢` 。原因在于要想发布下一个消息，必须先确认上一个已发布的消息，所以它是阻塞的，这就导致了在这种方式下所以提供的吞吐量每秒不会超过百条消息。但这种吞吐量对于某些应用已经足够了。

```java
public class Product {
    private final static String QUEUE_NAME = "public_confirm";

    public static void main(String[] args) {
        try (Channel channel = RabbitMqUtils.getChannel()) {
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);

            // 开启发布确认模式
            channel.confirmSelect();

            long begin = System.currentTimeMillis();
            for (int i = 0; i < 10; i++) {
                channel.basicPublish("", QUEUE_NAME, null, ("消息: " + i).getBytes(StandardCharsets.UTF_8));
                // 等待确认
                boolean b = channel.waitForConfirms();
                if (b) {
                    System.out.println("消息发送成功");
                }
            }

            long end = System.currentTimeMillis();
            System.out.println("发布 10 个单独确认消息，耗时：" + (end - begin) + "ms");

        } catch (TimeoutException | IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```
### 批量确认发布
批量确认发布与单个发布确认的区别就是，先发布一批消息，然后在一起确认这一批消息，这就可以极大的提高吞吐量，当然这种方式的缺点就是：当发生故障导致发布出现问题时，不知道是哪个消息出现了问题；所以我们必须要将整个批处理保存在内存中，已记录重要的信息而后重新发布消息。当然这种方案仍然是同步的，一样会阻塞消息发布。

```java
public class Product {

    private final static String QUEUE_NAME = "public_confirm";

    public static void main(String[] args) {
        try (Channel channel = RabbitMqUtils.getChannel()) {
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);

            // 开启发布确认模式
            channel.confirmSelect();

            // 批量确认消息大小
            int batchSize = 100;

            // 未确认消息个数
            int outstandingMessageCount = 0;

            long begin = System.currentTimeMillis();
            for (int i = 0; i < 1000; i++) {
                channel.basicPublish("", QUEUE_NAME, null, ("消息: " + i).getBytes(StandardCharsets.UTF_8));
                outstandingMessageCount++;

                if (outstandingMessageCount == batchSize) {
                    // 消息确认
                    channel.waitForConfirms();
                    outstandingMessageCount = 0;
                }
            }

            // 为了防止还有剩余消息没有被确认，再次确认一下
            if (outstandingMessageCount > 0) {
                channel.waitForConfirms();
            }

            long end = System.currentTimeMillis();
            System.out.println("发布 10 个单独确认消息，耗时：" + (end - begin) + "ms");

        } catch (TimeoutException | IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
```
### 异步确认发布
异步确认虽然在代码编写上比前两者复杂，但是性价比最高，无论是可靠性还是效率都没得说，它是利用回调函数来达到消息可靠性传递的，这个中间件也是通过函数回调来保证是否投递成功。

```java
public class Product {

    private final static String QUEUE_NAME = "public_confirm";

    public static void main(String[] args) {
        try (Channel channel = RabbitMqUtils.getChannel()) {
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);

            // 开启发布确认模式
            channel.confirmSelect();

            // 记录发送的消息，方便处理已确认消息和未确认消息
            ConcurrentSkipListMap<Long, String> outsideMsgList = new ConcurrentSkipListMap<>();

            // 消息确认成功回调
            /*
             * deliveryTag  消息的序号
             * multiple     true    表示批量确认
             *              false   表示单个确认
             */
            ConfirmCallback ackCallback = (deliveryTag, multiple) -> {
                // 返回的是小于等于当前序列号的未确认消息 是一个 map
                ConcurrentNavigableMap<Long, String> map = outsideMsgList.headMap(deliveryTag, true);

                if (multiple) {
                    // 批量确认则删除查询出来的所有
                    map.clear();
                } else {
                    // 非批量确认删除当前 deliveryTag 对应的消息
                    map.remove(deliveryTag);
                }

                System.out.println("消息确认成功tag：" + deliveryTag);
            };

            // 消息确认失败回调
            ConfirmCallback nackCallback = (deliveryTag, multiple) -> {
                String s = outsideMsgList.get(deliveryTag);
                System.out.println("消息确认失败msg：" + s + "，tag：" + deliveryTag);
            };

            // 添加消息确认监听器
            channel.addConfirmListener(ackCallback, nackCallback);

            long begin = System.currentTimeMillis();
            for (int i = 0; i < 1000; i++) {
                String msg = "消息: " + i;

                // 将消息添加到队列中
                outsideMsgList.put(channel.getNextPublishSeqNo(), msg);

                // 发送消息
                channel.basicPublish("", QUEUE_NAME, null, msg.getBytes(StandardCharsets.UTF_8));
            }

            long end = System.currentTimeMillis();
            System.out.println("发布 1000 个单独确认消息，耗时：" + (end - begin) + "ms");

        } catch (TimeoutException | IOException e) {
            e.printStackTrace();
        }
    }

}
```
为了解决异步未确认消息，我们引入了 `ConcurrentSkipListMap` 这个基于线程安全的 map，这个 map 的作用是缓存所发消息，而为什么要线程安全，是因为该 map 是发布线程与异步确认线程的一个临界资源。

## 三种发布确认对比
* 单个确认发布：同步等待确认，简单；但吞吐量非常有限；
* 批量确认发布：批量、同步等待确认，简单，吞吐量一般；但由于是批量确认，导致很难找出是那一条消息除了问题；
* 异步确认发布：异步等待确认，从编码角度来说比前两者要复杂很多，但是它在性能和多能达到的吞吐量是最佳的，通过实现回调方法，可以很方便的控制失败和成功确认消息的场景。
