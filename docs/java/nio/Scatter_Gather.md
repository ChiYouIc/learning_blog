---
title: Scatter 和 Gather
sidebar: auto
date: 2021-09-27
categories:
 - Java
tags:
 - NIO
---

## Scatter & Gather

Java NIO 开始支持 Scatter、Gather，Scatter、Gather 用于描述从 Channel 中读取或者写入到 Channel 的操作。

**分散（Scatter）** 从 Channel 中读取是指在读操作时将读取得数据写入多个 buffer 中。因此，Channel 将从 Channel 中读取得数据“分散（Scatter）”到多个 Buffer 中。

**聚集（Gather）** 写入 Channel 是指在写操作时将多个 buffer 的数据写入同一个 Channel，因此，Channel 将多个 Buffer 中的数据“聚集（Gather）”后发送到 Channel。

Scatter-Gather 经常用于需要将传输的数据分开处理的场合，例如传输一个由消息头和消息体组成的消息，你可能会将消息体和消息头分散到不同的 buffer 中，这样你可以方便的处理消息头和消息体。



## Scattering Reads

Scattering Reads 是指数据从一个 Channel 读取到多个 Buffer 中。如下图：

<img :src="$withBase('/img/java/nio/Scatter.png')" alt="Scatter">

``` java
ByteBuffer header = ByteBuffer.allocate(128);
ByteBuffer body = ByteBuffer.allocate(1024);

ByteBuffer[] bufferArray = { header, body };

channel.read(buffereArray);
```

注意 Buffer 首先被插入到数组，然后再将数组作为 channel.read() 的输入参数。read() 方法按照 Buffer 在数组中的顺序将从 Channel 中读取的数据写入到 Buffer，当一个 Buffer 被写满后，channel 紧接着向另一个 buffer 中写入。

Scattering Reads 在移动下一个 Buffer 前，必须填满当前的 Buffer，这也意味着它不适用于动态消息（消息大小不固定）。换句话说，如果 BufferArray 中包含消息头和消息体，那么会优先将消息头 Buffer 填充满，再填充消息体 Buffer。



## Gathering Writes

Gathering Writes 是指数据从多个 Buffer 写入到同一个 Channel。如下图描述：

<img :src="$withBase('/img/java/nio/Gather.png')" alt="Gather">

```java
ByteBuffer header = ByteBuffer().allocate(128);
ByteBuffer body = ByteBuffer.allocate(1024);

ByteBuffer[] bufferArray = { header, body };

channel.write(bufferArray);
```

buffers 数组是 write() 方法的入参，write() 方法会按照 buffer 在数组中的顺序，将数据写入到 channel，注意只有 position 和 limit 之间的数据才会被写入。因此，如果一个 buffer 的容量会 128 byte，但是仅仅包含 58 byte 数据，那么着 58 byte 的数据将被写入到 channel 中。因此与 Scattering Reads 相反，Gathering Writes 能较好的处理动态消息。

