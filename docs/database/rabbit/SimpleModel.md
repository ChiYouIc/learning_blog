---
title: Simple 模式
sidebar: auto
date: 2022-06-28
categories:
 - 消息中间件
tags:
 - RabbitMQ
---

## RabbitMQ 的 Simple 模式
下面将直接使用代码案例来演示 RabbitMQ 最简单的使用，即创建一个生产者生产消息，创建一个消费者消费消息。

![image](./images/BZ6aNCYKtGed1zK3PDuQpMtXhWDmUPIQ3S6awSM96E.png)

首先使用代码工具创建一个 maven 项目，并添加如下依赖：

```xml
<!-- https://mvnrepository.com/artifact/org.apache.poi/poi -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi</artifactId>
    <version>5.2.2</version>
</dependency>
<!-- https://mvnrepository.com/artifact/org.apache.poi/poi-ooxml -->
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.2</version>
</dependency>
```

### 生产者
```java
public class Product {

    private final static String QUEUE_NAME = "hello";

    public static void main(String[] args) {
        // 创建一个连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        // 地址
        factory.setHost("xxx.xxx.xxx.xxx");
        factory.setPort(5672);
        // 用户名 密码
        factory.setUsername("test");
        factory.setPassword("test");

        //虚拟机名称
        factory.setVirtualHost("my_vhost");
        try(Connection connection = factory.newConnection(); Channel channel = connection.createChannel()) {

          /*
           * 创建一个队列
           * queue        队列名称
           * durable      队列里面的消息是否持久化，默认消息存储在内存中
           * exclusive    该队列是否只供给一个消费者进行消费，是否进行共享， true 可以多个消费者一起消费
           * autoDelete   是否自动删除，组后一个消费者断开连接以后，该队列是否自动删除，true 自动删除
           * arguments    队列的其他属性（构造参数）
           */
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);
            String message = "Hello World2";

            /*
             * 发送一个消息
             * exchange     将消息发布到的交换
             * routingKey   路由键
             * props        消息的其他属性 - 路由标头等
             * body         消息正文
             */
            channel.basicPublish("", QUEUE_NAME, null, message.getBytes(StandardCharsets.UTF_8));
            System.out.println("消息发送完毕");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```
### 消费者
```java
public class Client {

    private final static String QUEUE_NAME = "hello";

    public static void main(String[] args) {
        // 创建一个连接工厂
        ConnectionFactory factory = new ConnectionFactory();
        // 地址
        factory.setHost("xxx.xxx.xxx.xxx");
        factory.setPort(5672);
        // 用户名 密码
        factory.setUsername("test");
        factory.setPassword("test");
        factory.setVirtualHost("my_vhost");

        try (Connection connection = factory.newConnection(); Channel channel = connection.createChannel()) {
            System.out.println("等待接受信息");

            // 消息传递时通知的回调接口
            DeliverCallback deliverCallback = (s, delivery) -> System.out.println(new String(delivery.getBody()));

            // 通知消费者取消的回调接口
            CancelCallback cancelCallback = s -> System.out.println("消息消费被终端");

            /*
             * 消费者消费消息
             * queue            队列名称
             * autoAck          消费者成功之后是否要自动应答，true 代表自动应答，false 代表手动应答
             * deliverCallback  消息传递时的回调
             * cancelCallback   消费者取消时的回调
             */
            channel.basicConsume(QUEUE_NAME, true, deliverCallback, cancelCallback);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
```
