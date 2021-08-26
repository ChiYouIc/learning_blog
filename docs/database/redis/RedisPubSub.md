---
title: Redis 发布订阅
sidebar: auto
date: 2021-03-09
categories:
 - 数据库
tags:
 - Redis
---

Redis 发布订阅（pub/sub）是一种消息通信模式：发送者（pub）发送消息，订阅者（sub）接收消息。

Redis 客户端可以订阅任意数量的频道。

下图展示了频道 channel 1，以及订阅这个频道的三个客户端`client 1`、`channel 2`、`channel 3`之间的关系：

<img :src="$withBase('/img/database/redis/订阅频道.png')" alt="订阅频道">

当有新消息通过 `publish` 命令发送给这个频道 channel 1 时，这个消息就会被发给订阅它的三个客户端：

<img :src="$withBase('/img/database/redis/获取频道消息.png')" alt="获取频道消息">

## 演示实例

下面将用实例演示发布订阅是如何工作的，这里开启了四个 redis-cli 客户端，一个用于发送订阅消息，另外三个接收订阅消息，如下：

<img :src="$withBase('/img/database/redis/发布订阅模拟.png')" alt="发布订阅模拟">


## Redis 发布订阅命令

1. 订阅一个或多个符合给定模式的频道。

**格式**：psubscribe pattern [pattern ...]

``` shell script
127.0.0.1:6379> psubscribe channel*
Reading messages... (press Ctrl-C to quit)
1) "punsubscribe"
2) "channel*"
3) (integer) 0
1) "punsubscribe"
2) "channel*"
3) (integer) 0
1) "psubscribe"
2) "channel*"
3) (integer) 1
1) "pmessage"
2) "channel*"
3) "channel1" # channel1 频道的消息
4) "send an message"
1) "pmessage"
2) "channel*"
3) "channel2" # channel2 频道的消息
4) "send an message"  
```

2. 查看订阅与发布系统状态。

**格式**： pubsub subcommand [argument [argument ...]]

``` shell script
127.0.0.1:6379> pubsub channels
1) "channel1"
```

3. 将信息发送到指定的频道。

**格式**：publish channel message

``` shell script
127.0.0.1:6379> publish channel1 "Hello World!"
(integer) 3
127.0.0.1:6379> publish channel1 "How are you?"
(integer) 3
127.0.0.1:6379> publish channel1 "send an message"
(integer) 4  # 返回的是当前 channel1 频道的订阅数量
```

4. 退订所有给定模式的频道。

**格式**：punsubscribe [pattern [pattern ...]]

``` shell script
127.0.0.1:6379> punsubscribe channel1
1) "punsubscribe"
2) "channel1"
3) (integer) 1  # 0 表示没有退订（原因可能是没有订阅该频道），1 表示退订成功
127.0.0.1:6379> punsubscribe channel*
1) "unsubscribe"
2) "channel2"
3) (integer) 0
127.0.0.1:6379> punsubscribe channel*
1) "unsubscribe"
2) "channel3"
3) (integer) 0
127.0.0.1:6379> punsubscribe channel*
1) "punsubscribe"
2) "channel*"
3) (integer) 0
```

5. 订阅给定的一个或多个频道的信息（注意与 `psubscribe` 区分）。

**格式**：subscribe channel [channel ...]

``` shell script
127.0.0.1:6379> subscribe channe1 channel2
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "channe1"
3) (integer) 1
1) "subscribe"
2) "channel2"
3) (integer) 2
```

6. 退订给定的频道（注意与 `punsubscribe` 区分）。

**格式**：unsubscribe [channel [channel ...]]

``` shell script
127.0.0.1:6379> unsubscribe channel1 channel2 channel3
1) "unsubscribe"
2) "channel1"
3) (integer) 2  # 0 表示没有退订（原因可能是没有订阅该频道），1 表示退订成功 
```
