---
title: Work Queues 模式
sidebar: auto
date: 2022-06-21
categories:
 - 消息中间件
tags:
 - RabbitMQ
---

工作队列常用于资源密集型任务的执行，因为这类任务的执行会占用大量系统资源，并且执行时间较长。在处理这类任务时，可以将任务封装为消息并将其发送到消息队列中。系统中的工作线程将对队列中的任务逐一执行，当然在系统资源条件允许的情况下，也可以使用多个工作线程一起执行任务队列中的任务。

## 轮询分发消息
下面将演示 Work Queues 工作模式，创建一个生产者生产消息，将消息发送到指定的消息队列中；创建两个消费消费队列中的消息。

![image](./images/XhKPdPDPf2ToBhysyhOPAh6MEW017ArqAx7tFb4k.png)

## RabbitMQ 连接工具
为了简化代码，将 RabbitMQ 的连接抽取成一个工具类。

```java
public class RabbitMqUtils {

    public static Channel getChannel() throws IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory();
        // 地址
        factory.setHost("xxx.xxx.xxx.xxx");
        factory.setPort(5672);
        // 用户名 密码
        factory.setUsername("test");
        factory.setPassword("test");

        // 虚拟机
        factory.setVirtualHost("my_vhost");

        Connection connection = factory.newConnection();
        return connection.createChannel();
    }
}

```
## 生产者
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
## 消费者
这里创建两个消费者消费共一个消息队列。

```java
public class Client01 {

    private static final String QUEUE_NAME = "hello";

    public static void main(String[] args) throws IOException, TimeoutException {
        Channel channel = RabbitMqUtils.getChannel();
        DeliverCallback deliverCallback = (s, delivery) -> {
            String receivedMessage = new String(delivery.getBody());
            System.out.println("接收到消息：" + receivedMessage);
        };

        CancelCallback cancelCallback = s -> {
            System.out.println(s + "消费者取消消费接口");
        };
        System.out.println("C1 消费者启动等待消费....");
        channel.basicConsume(QUEUE_NAME, true, deliverCallback, cancelCallback);
    }
}
```
```java
public class Client02 {

    private static final String QUEUE_NAME = "hello";

    public static void main(String[] args) throws IOException, TimeoutException {
        Channel channel = RabbitMqUtils.getChannel();
        DeliverCallback deliverCallback = (s, delivery) -> {
            String receivedMessage = new String(delivery.getBody());
            System.out.println("接收到消息：" + receivedMessage);
        };

        CancelCallback cancelCallback = s -> {
            System.out.println(s + "消费者取消消费接口");
        };
        System.out.println("C2 消费者启动等待消费....");
        channel.basicConsume(QUEUE_NAME, true, deliverCallback, cancelCallback);
    }
}
```
当这里，所有的代码都已经写完了，为了方便查看输出，需要先启动两个消费者程序，然后再启动生产者。

### 输出
#### 生产者
```bash
发送消息：消息0
发送消息：消息1
发送消息：消息2
发送消息：消息3
发送消息：消息4
发送消息：消息5
发送消息：消息6
发送消息：消息7
发送消息：消息8
发送消息：消息9
消息发送完毕
```
#### Client01
```bash
C1 消费者启动等待消费....
接收到消息：消息0
接收到消息：消息2
接收到消息：消息4
接收到消息：消息6
接收到消息：消息8
```
#### Client02
```bash
C2 消费者启动等待消费....
接收到消息：消息1
接收到消息：消息3
接收到消息：消息5
接收到消息：消息7
接收到消息：消息9
```
从输出结果中看，生产者一共向消息队列中发送了 10 条消息，消费者 Client01 和 Client02 逐一对队列中的消息进行了消费处理。
