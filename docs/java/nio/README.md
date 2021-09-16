---
title: Java NIO
sidebar: auto
date: 2021-09-14
categories:
 - Java
tags:
 - NIO
---

## Java NIO 概述

Java NIO（New IO 或 Non Blocking IO）是从 Java 1.4 版本开始引进的一个新的 IO API，可以代替标准的 Java IO API。NIO 支持面向缓冲区的、基于通道的 IO 操作。NIO 将以更加高效的方式进行文件的读写操作。

### 阻塞 IO

通常在进行同步 I/O 操作时，如果读取数据，代码会阻塞直至有可供读取的数据。同样，写入数据也会阻塞直至有数据可以写入。传统的 Server/Client 模式是基于 TPR（Thread Per Request），服务器会为每一个客户端请求建立一个线程，由该线程单独处理一个客户的请求。这种模式带来的一个问题就是线程数量的剧增，大量的线程会增大服务器的开销。为了避免这样类似的问题，大多数服务器采用了线程池模型，并通过设置线程池线程数量来控制并发量；但这又带来了另一个问题，如果线程池的最大线程数为 100，而某时刻系统刚好有 100 个用户在进行大文件下载，会导致第 101 个用户请求无法即时处理，即便第 101 个用户只想请求一个几 KB 大小的页面。传统的 Server/Client 模式如下如所示：

<img :src="$withBase('/img/java/nio/传统的Server_Client模式.png')" alt="传统的Server_Client模式">



### 非阻塞 IO（NIO）

NIO 中非阻塞 I/O 采用了基于 Reactor 模式的工作方式，I/O 调用不会被阻塞，相反是注册感兴趣的特定 I/O 事件，如可读数据到达，新的套接字连接等等，在发生特定事件时，系统再通知我们。NIO 中实现非阻塞 I/O 的核心对象就是 `Selector`，Selector 就是注册各种 I/O 事件地方，而且当我们感兴趣的事件发生时，就是这个对象告诉我们所发生的事件，如下图所示：

<img :src="$withBase('/img/java/nio/Selector注册事件.png')" alt="Selector注册事件">

从图中可以看出，当有读或写任何注册事件发生时，可以从 Selector 中获得相应的 SelectionKey，同时从 SelectionKey 中可以找到发生的事件和事件所发生的具体 Selectable Channel，以获得客户端发送过来的数据。

非阻塞指的是 IO 事件本身不会阻塞，但是获取 IO 事件的 Select() 方法是需要阻塞等待的。区别是阻塞的 IO 会阻塞在 IO 操作上，NIO 阻塞在事件获取上，没有事件就没有 IO，从高层次看 IO 就不阻塞了。也就是说只有 IO 已经发生那么我们才会评估 IO 是否阻塞，但是 select() 阻塞的时候 IO 还没有发生，何谈 IO 的阻塞呢？NIO 的本质就是延迟 IO 操作到真正发生 IO 的时候，而不是以前的只要 IO 流一打开就一直等待 IO 操作。

| IO                        | NIO                           |
| ------------------------- | ----------------------------- |
| 面向流（Stream Oriented） | 面向缓冲区（Buffer Oriented） |
| 阻塞 IO（Blocking IO）    | 非阻塞 IO（Non Blocking IO）  |
| （无）                    | 选择器（Selectors）           |



### NIO 概述

Java NIO 由以下几个核心部分组成：

- Channels
- Buffers
- Selectors

虽然 Java NIO 中除此之外还有很多类和组件，但 Channel，Buffer 和 Selector 构成了核心的 API。其它组件，如 Pipe 和 FileLock，只不过是与三个核心组件共同使用的工具类。



#### Channel

首先说一下 Channel，可以翻译成“通道”。Channel 和 IO 中的 Stream（流）是差不多一个等级的。只不过 Stream 是单向的，譬如：InputStream、OutputStream。而 Channel 是双向的，既可以用来进行去操作，也可以进行写操作。

NIO 中的 Channel 的主要实现有：FileChannel、DatagramChannel、SocketChannel 和 ServerSocketChannel，他们分别对应文件 IO、UDP 和 TCP（Server 和 Client）。



#### Buffer

NIO 中的关键 Buffer 实现有：ByteBuffer、CharBuffer、DoubleBuffer、FloatBuffer、IntBuffer、LongBuffer、ShortBuffer，分别对应基本数据类型：byte、char、double、float、int、long、short。



#### Selector

Selector 运行单线程处理多个 Channel，如果你的应用打开了多个通道，但每个连接的流量都很低，使用 Selector 就会很方便。例如在一个聊天服务器中。要使用 Selector，得向 Selector 注册 Channel，然后调用它的 select() 方法。这个方法会一直阻塞到某个注册的通道有事件就绪。一旦这个方法返回，线程就可以处理这些事件，如：新的连接进来、数据接收等。

