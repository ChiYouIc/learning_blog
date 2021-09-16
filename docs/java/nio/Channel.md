---
title: Channel 介绍
sidebar: auto
date: 2021-09-14
categories:
 - Java
tags:
 - NIO
---

## Channel 概述

Channel 是一个通道，可以通过它读取和写入数据，它就像水管一样，网络数据通过 Channel 读取和写入。通道与流的不同之处在于通道是双向的，流只是在一个方向上移动（一个流必须是 InputStream 或 OutputStream 的子类），而且通道可以用于读、写或者同时用于读写。因为 Channel 是全双工的，所以它可以比流更好地映射底层操作系统的 API。

NIO 中通过 Channel 封装了对数据源的操作，通过 Channel 我们可以操作数据源，但又不必关心数据源的具体物理结构。这个数据源可能是多种的。比如，可以是文件，也可以是网络 Socket。在大多数应用中，Channel 与文件描述符或 Socket 是一一对应的。Channel 用于在字节缓冲区和位于通道另一侧的实体（通常是一个文件或套接字）之间有效地传输数据。

``` java
public interface Channel extends Closeable {

    /**
     * 告知这个通道是开启还是关闭
     *
     * @return 当且仅当这个通道是开启的才返回 ture
     */
    public boolean isOpen();

    /**
     * 关闭这个通道
     *
     * <p> 关闭通道后，任何进一步尝试对其调用 I/O 操作都将导致抛出ClosedChannelException 。
     *
     * <p> 如果通道已经关闭，再调用改方法是无效的。
     *
     * <p> 可以随时调用此方法。 但是，如果某个其他线程已经调用了它，则另一个调用将阻塞，
     * 直到第一次调用完成，之后它将无效地返回。
     *
     * @throws  IOException  如果发生了 IO 错误
     */
    public void close() throws IOException;

}
```

与缓冲区不同，通道 API 主要由接口指定。不同的操作系统上通道实现（Channel Implementation）会有根本性的差异，所以通道 API 仅仅描述了可以做什么。因此很自然地，通道实现经常使用操作系统的本地代码。通道接口允许你以一种受控且可移植的方式来访问底层的 I/O 服务。

Channel 是一种对象，可以通过它读取和写入数据。拿 NIO 与原来的 I/O 做个比较，通道就像是流。所有数据都通过 Buffer 对象来处理。你永远不会将字节直接写入通道中，相反，是将数据写入到一个包含多个字节的缓冲区。同样的，你也不会直接从通道中读取字节，而是将数据从通道读取到缓冲区，再从缓冲区中获取字节数据。

Java NIO 的通道类似流，但又有不同：

- 我们既可以从通道读取数据，也可以向通道写入数据。但是流的读写是单向的。
- 通道可以异步读写。
- 无论是读取还是写入，通道需要依赖 Buffer 作为数据载荷，不能直接在通道中读写字节数据。

<img :src="$withBase('/img/java/nio/Channel_Buffer.png')" alt="Channel_Buffer.png">



## Channel 实现

下面是 Java NIO 中最重要的 Channel 的实现：

- FileChannel：从文件中读写数据。
- DatagramChannel：能通过 UDP 读写网络中的数据。
- SocketChannel：能通过 TCP 读写网络数据。
- ServerSocketChannel：可以监听新进来的 TCP 连接，像 Web 服务器那样。对每一个新进来的连接都会创建一个 SocketChannel。







