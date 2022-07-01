---
title: 消息应答
sidebar: auto
date: 2022-07-01
categories:
 - 消息中间件
tags:
 - RabbitMQ
---

在消息消费过程中，消费者在消费处理一个消息时都有一个执行过渡时间，特别是在复杂的业务场景和计算场景中。那么如果消费者从消息队列中读取了消息之后，在执行过程中突然报错或离线了，这种情况下会发生什么了呢？在 RabbitMQ 中默认情况下，一旦消息队列中的消息被消费者拿走之后，便会立即将该消息标记为删除。回到刚才的问题中，消费者报错或离线，那么这条消息就极有可能没有被成功的处理，这种情况下，消息就丢失了。当然消息丢失的场景不局限于消费者没有成功消费，网络环境异常也会导致消息丢失。

为了确保消息在发送和消费过程中不丢失，RabbitMQ 引入了消息应答机制，消息应答就是：`消费者在接受到消息并且处理该消息之后，主动告诉 RabbitMQ 它已经处理了，RabbitMQ 就可以将该消息标记为删除` 。

## 自动应答
RabbitMQ 的 `自动应答机制` 会在消息发送后会立即确认消息已经被传送成功，这种模式需要在 `高吞吐量和数据传输安全性方面做权衡` ，在这种模式下，如果消息在接受到之前，消费者出现连接或者 channel 关闭的情况，那么消息就会丢失；另一方面消息队列 `没有对传递的消息数量进行限制` ，这样有可能使得消费者这边由于接受太多来不及处理的消息，导致消息堆积，内存耗尽，最终这些消费者线程都会被操作系统杀死，`所以这种模式仅适用在消费者可以高效并以某种速率能够处理这些消息的情况下使用` 。

## 消息应答的方法
```java
/**
 * 确认一条或多条收到的消息。从AMQP.Basic.GetOk或AMQP.Basic.Deliver方法提供 deliveryTag，其中包含正在确认的接收消息。
 *
 * deliveryTag – 收到的AMQP.Basic.GetOk或AMQP.Basic.Deliver的标签
 * multiple    – true 以确认所有消息，包括提供的交付标签；
 *               false 仅确认提供的交付标签。
 */
void basicAck(long deliveryTag, boolean multiple) throws IOException;
```
```java
/**
 * 拒绝一条或多条收到的消息。从包含要拒绝的消息的AMQP.Basic.GetOk或AMQP.Basic.GetOk方法deliveryTag。
 *
 * deliveryTag – 收到的AMQP.Basic.GetOk或AMQP.Basic.Deliver的标签
 * multiple – true 拒绝所有消息，包括提供的传递标签；
 *            false 仅拒绝提供的交货标签。
 * requeue – 如果被拒绝的消息应该重新排队而不是丢弃/死信，则为 true
 */
void basicNack(long deliveryTag, boolean multiple, boolean requeue) throws IOException;
```
```java
/**
 * 拒绝消息。从AMQP.Basic.GetOk或AMQP.Basic.Deliver方法中提供 deliveryTag，其中包含被拒绝的接收消息。
 *
 * deliveryTag – 收到的AMQP.Basic.GetOk或AMQP.Basic.Deliver的标签
 * requeue – 如果被拒绝的消息应该重新排队而不是丢弃/死信，则为 true
 */
void basicReject(long deliveryTag, boolean requeue) throws IOException;
```


## 消息自动重新入队
如果消费者由于某些原因失去连接（其通道已关闭，连接已关闭或 TCP 连接丢失），导致消息未发送 ACK 确认，RabbitMQ 将感知到消息未完全处理，并将该消息重新加载到队列。如果此时存在其它消费者可以处理，它将很快的将它分发给其它消费者。这样，即使某个消费者异常或离线，也可以保证消息不会丢失。



## 手动应答演示
### 生产者
```java
public class Product {

    private static final String QUEUE_NAME = "hello";

    public static void main(String[] args) throws Exception {
        Channel channel = RabbitMqUtils.getChannel();
        channel.queueDeclare(QUEUE_NAME, false, false, false, null);
        for (int i = 0; i < 10; i++) {
            String message = "消息" + i;
            System.out.println("发送消息：" + message);
            channel.basicPublish("", QUEUE_NAME, null, message.getBytes(StandardCharsets.UTF_8));
            Thread.sleep(500);
        }
        System.out.println("消息发送完毕");
        channel.close();
    }
}
```
### 消费者
```java
public class Work01 {

    private static final String QUEUE_NAME = "hello";

    public static void main(String[] args) throws IOException, TimeoutException {
        Channel channel = RabbitMqUtils.getChannel();

        DeliverCallback deliverCallback = (s, delivery) -> {
            ThreadUtils.sleep(2);
            String receivedMessage = new String(delivery.getBody());
            System.out.println("接收到消息：" + receivedMessage);
            /*
             * deliveryTag  – 收到的AMQP.Basic.GetOk或AMQP.Basic.Deliver的标签
             * multiple     – true 以确认所有消息，包括提供的交付标签；
             *                false 仅确认提供的交付标签。
             */
            channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
        };

        CancelCallback cancelCallback = s -> {
            System.out.println(s + "消费者取消消费接口回调逻辑");
        };
        System.out.println("C1 消费者启动等待消费....");

        boolean autoAck = false;
        channel.basicConsume(QUEUE_NAME, autoAck, deliverCallback, cancelCallback);
    }
}
```
```java
public class Work02 {

    private static final String QUEUE_NAME = "hello";

    public static void main(String[] args) throws IOException, TimeoutException {
        Channel channel = RabbitMqUtils.getChannel();
        DeliverCallback deliverCallback = (s, delivery) -> {
            ThreadUtils.sleep(10);
            String receivedMessage = new String(delivery.getBody());
            System.out.println("接收到消息：" + receivedMessage);

            /*
             * deliveryTag  – 收到的AMQP.Basic.GetOk或AMQP.Basic.Deliver的标签
             * multiple     – true 以确认所有消息，包括提供的交付标签；
             *                false 仅确认提供的交付标签。
             */
            channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
        };

        CancelCallback cancelCallback = s -> {
            System.out.println(s + "消费者取消消费接口回调逻辑");
        };
        System.out.println("C2 消费者启动等待消费....");

        boolean autoAck = false;
        channel.basicConsume(QUEUE_NAME, autoAck, deliverCallback, cancelCallback);
    }
}
```
消费者 Work01 模拟的处理时间间隔为 2s，Work02 处理时间间隔为 10s；先启动消费者，然后在启动生产者，可以从控制台中看到两个消费可以正常消费消息，其中 Work01 先进入阻塞（因为队列中一共只有 10 条消息，采用轮询分发机制，所以每个消费者得到的消息都是一样多的），Work02 缓慢执行，这时停止 Work02 会发现 Work01 又开始收到消息，并且收到的第一条消息是 Work02 收到但未处理完应答的消息。
