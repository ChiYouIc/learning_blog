---
title: Socket 通道
sidebar: auto
date: 2021-09-17
categories:
 - Java
tags:
 - NIO
---

新的 socket 通道类可以运行非阻塞模式并且是可选择的，可以激活大程序（如网络服务器和中间件组件），巨大的可伸缩性和灵活性。在学习了 NIO 后你会发现，再也没有为每个 socket 连接创建一个线程的必要了，也避免了管理大量线程所需的上下文交换开销。借助新的 NIO 类，一个或几个线程就可以管理成百上千活动的 socket 连接了，并且只有很少甚至可能没有性能损耗。所有的 socket 通道类（DatagramChannel、SocektChannel 和 ServerSocketChannel）都继承了位于 java.nio.channel.spi 包中的 AbstractSelectableChannel。这意味着我们可以用一个 Selector 对象来执行 socket 通道的就绪选择（readiness selection）。

请注意 DatagramChannel 和 SocketChannel 实现定义读写功能的接口，而 ServerSocketChannel 并没有去实现。ServerSocketChannel 负责监听传入的连续和创建新的 SocketChannel 对象，它本身是不传输数据的。

在我们具体讨论每一种 socket 通道前，你应该了解 `socket 和 socket 通道之间的关系`。通道是一个连接 I/O 服务的导管，并提供与该服务交互的方法。就某个 socket 而言，它不会再次实现与之对应的 socket 通道类中的 socket 协议 API，而 java.net 中已经存在的 socket 通道都可以被大多数协议操作且重复使用。

全部 socket 通道类（DatagramChannel、SocketChannel 和 ServerSocketChannel）在被实例化时都会创建一个对等 socket 对象。这些是我们所熟悉的来自 java.net 的类（Socket、ServerSocket 和 DatagramSocket），它们已经可以识别通道。对等 socket 可以通过调用 socket()  方法从一个通道上获取。此外，这三个 java.net 类现在都有 getChannel() 方法。

要把一个 socket 通道置于非阻塞模式，我们要依靠所有 socket 通道类的共有超级类：`SelectableChannel`。就绪选择（readiness selection）是一种可以用来查询通道的机制，该查询可以判断通道是否准备好执行一个目标操作，如读或写。非阻塞 I/O 和可选择性是紧密相连的，那也正是管理阻塞模式的 API 代码要在 SelectableChannel 超级类中定义的原因。

设置或重新设置一个通道的阻塞模式是很简单的，只要调用 configureBlocking() 方法即可，传递参数值为 true 则设为阻塞模式，参数值为 false 值设为非阻塞模式。可以通过调用 isBlocking() 方法来判断某个 socket 通道当前处于哪种模式。

**AbStractSelectableChannel.java 中实现的 configureBlocking() 方法如下：**

``` java
/**
 * 调整此通道的阻塞模式。
 * 如果给定的阻塞模式与当前的阻塞模式不同，则此方法调用implConfigureBlocking方法，同时持有适当的锁，以更改模式
 */
public final SelectableChannel configureBlocking(boolean block) throws IOException {
    synchronized (regLock) {
        if (!isOpen())
            throw new ClosedChannelException();
        if (blocking == block)
            return this;
        if (block && haveValidKeys())
            throw new IllegalBlockingModeException();
        implConfigureBlocking(block);
        blocking = block;
    }
    return this;
}
```

非阻塞 socket 通道被认为是服务端使用的，因为它们的存在使得同时管理很多 socket 通道变得更容易。但是，在客户端使用一个或几个非阻塞模式的 socket 通道也是有益处的，例如，借助非阻塞 socket 通道，GUI 程序可以专注于用户请求并且同时维护与一个或多个服务器的会话。在很多程序上，非阻塞模式都是很有用的。

偶尔的，我们也会需要防止 socket 通道的阻塞模式被更改。API 中有一个 blockingLock() 方法，改方法会返回一个非透明的对象引用。返回的对象是通道实现修改阻塞模式时内部使用的。只有拥有此对象的锁的线程才能更改通道的阻塞模式。

## ServerSocketChannel

ServerSocketChannel 是一个基于通道的 socket 监听器。它同我们所熟悉的 java.net.ServerSocket 执行相同的任务，不过它增加了通道语义，因此能够在非阻塞模式下运行。

由于 ServerSocketChannel 没有 bind() 方法，因此有必要取出对等的 socket 并使用它来绑定到一个端口以开始监听连接。我们也是使用对等 ServerSocket 的 API 来根据需要设置其它的 socket 选项。

同 java.net.ServerSocket 一样，ServerSocketChannel 也有 accept() 方法。一旦创建了一个 ServerSocketChannel 并用对等 socket 绑定了它，然后您就可以在其中一个上调用 accept()。如果你选择在 ServerSocket 上调用 accept() 方法，那么它会同任何其它的 ServerSocket 表现出一样的行为：总是阻塞并返回一个 java.net.Socket 对象，如果你选择在 ServerSocketChannel 上调用 accept() 方法则会返回 SocketChannel 类型的对象，返回的对象能够在非阻塞模式下运行。

换句话说，ServerSocketChannel 的 accept() 方法会返回 SocketChannel 类型对象，SocketChannel 可以在非阻塞模式下运行。

其它 Socket 的 accept() 方法会阻塞返回一个 Socket 对象。如果 ServerSocketChannel 以非阻塞模式被调用，当没有传入连接在等待时，ServerSocketChannel.accept() 会立即返回 null。正是这种检查连接而不阻塞的能力实现了可伸缩性并降低了复杂度。可选择性也因此得到实现。我们可以使用一个选择器实例来注册 ServerSocketChannel 对象以实现新连接到达时自动通知的功能。

**以下代码将演示如何使用一个非阻塞的 accept() 方法：**

``` java
public class SocketChannelAccept {

	public static final String GREETING = "Hello java nio.\r\n";

	public static void main(String[] args) throws Exception {

		ByteBuffer buffer = ByteBuffer.wrap(GREETING.getBytes());
		// 打开 ServerSocketChannel 通道
		ServerSocketChannel ssc = ServerSocketChannel.open();

		ssc.socket().bind(new InetSocketAddress(1234));

		// 调整此通道的阻塞模式，true 阻塞模式，false 非阻塞模式
		ssc.configureBlocking(false);

		// 循环监听新的连接
		while (true) {
			System.out.println("正在等待连接...");
			SocketChannel sc = ssc.accept();
			// 没有连接接入，ServerSocketChannel 为非阻塞模式时，accept() 方法调用后就立即返回了，故 sc 有可能为空
			if (sc == null) {
				System.out.println("null");
				Thread.sleep(2000);
			}
			// 有接入
			else {
				System.out.println("连接来自:" + sc.socket().getRemoteSocketAddress());

				// 写入返回数据
				buffer.rewind();
				sc.write(buffer);
				sc.close();

				// 关闭通道
				ssc.close();
			}
		}
	}
}

```



## SocketChannel

### SocketChannel 介绍

Java NIO 中的 SocketChannel 是一个连接到 TCP 网络套接字的通道。SocketChannel 是一种面向流连接 sockets 套接字的可选择通道。从这里可以看出：

* SocketChannel 是用来连接 Socket 套接字
* SocketChannel 主要用途用来处理网络 I/O 的通道
* SocketChannel 是基于 TCP 连接传输
* SocketChannel 实现了可选择通道，可以被多路复用的



### SocketChannel 特征

- 对于已经存在的 socket 不能创建 SocketChannel；

- SocketChannel 中提供的 open 接口创建的 Channel 并没有进行网络级联，需要使用 connect 接口连接到指定地址；

- 未进行连接的 SocketChannel 执行 I/O 时，会抛出 NotYetConnectedException；

- SocketChannel 支持两种 I/O 模式：阻塞式和非阻塞式；

- SocketChannel 支持异步关闭。如果 SocketChannel 在一个线程上 read 阻塞，另一个线程对该 SocketChannel 调用 shutdownInput()，则读阻塞的线程将返回 -1 表示没有读取任何数据；如果 SocketChannel 在一个线程上 write 阻塞，另一个线程对该 SocketChannel 调用 shutdownWrite，则写阻塞的线程将抛出 AsynchronousCloseException；

- SocketChannel 支持设定参数

  | 枚举         | 说明                                                   |
  | ------------ | ------------------------------------------------------ |
  | SO_SNDBUF    | 套接字发送缓冲区大小                                   |
  | SO_RCVBUF    | 套接字接收缓冲区大小                                   |
  | SO_KEEPALIVE | 保持连接                                               |
  | O_REUSEADDR  | 复用地址                                               |
  | SO_LINGER    | 有数据传输时延缓关闭 Channel（只有在非阻塞模式下有用） |
  | TCP_NODELAY  | 禁用 Nagle 算法                                        |



### SocketChannel 的使用

- **创建 SocketChannel**

  方式一：

  ``` java
  SocketChannel channel = SocketChannel.open(new InetSocketAddress("localhost", 8080));
  ```

  方式二：

  ``` java
  SocketChannel channel = SocketChannel.open();
  channel.connect(new InetSocketAddress("localhost", 8080));
  ```

  直接使用有参 open() 或者无参 open()，但是在无参 open() 只是创建了一个 SocketChannel 对象，并没有进行实质的 tcp 连接。

- **连接校验**

  ``` java
  // 测试 SocketChannel 是否为 open 状态
  channel.isOpen();
  //测试 SocketChannel 是否已经被连接
  channel.isConnected();
  //测试 SocketChannel 是否正在进行 连接
  channel.isConnectionPending();
  //校验正在进行套接字连接的 SocketChannel 是否已经完成连接
  channel.finishConnect();
  ```

- **读写模式**

  SocketChannel 支持阻塞和非阻塞两种模式，通过 configureBlocking(boolean) 来进行配置，传入 false 为非阻塞，true 为阻塞模式；默认为阻塞模式。

  ``` java
  channel.configureBlocking(false);
  ```

- **读写**

  ``` java
  SocketChannel channel = SocketChannel.open(new InetSocketAddress("localhost", 8080));
  ByteBuffer byteBuffer = ByteBuffer.allocate(64);
  channel.read(byteBuffer);
  channel.close();
  System.out.println("读结束...");
  ```

  这是一个阻塞式读，当程序执行到 read() 时，线程将阻塞在这里。

  ``` java
  SocketChannel channel = SocketChannel.open(new InetSocketAddress("localhost", 8080));
  // 非阻塞模式配置
  channel.configureBlocking(false);
  ByteBuffer byteBuffer = ByteBuffer.allocate(64);
  channel.read(byteBuffer);
  channel.close();
  System.out.println("读结束...");
  ```

  这是一个非阻塞式读，程序运行后不会被阻塞，会迅速打印 `读结束...`，然后终止程序。

  SocketChannel 的读写都是面向缓冲区的，这个读写方式与 FileChannel 的读写方式一样。

- **设置和获取参数**

  ``` java
  // 通过 setOptions 方法可以设置 socket 套接字的相关参数
  channel.setOption(StandardSocketOptions.SO_KEEPALIVE, Boolean.TRUE)
      .setOption(StandardSocketOptions.TCP_NODELAY, Boolean.TRUE);

  // 可以通过 getOption 获取相关参数的值。如默认的接收缓冲区大小是 8192byte。
  channel.getOption(StandardSocketOptions.SO_KEEPALIVE);
  channel.getOption(StandardSocketOptions.SO_RCVBUF);
  ```



## DatagramChannel

### DatagramChannel 介绍

SocketChannel 对应 Socket，ServerSocketChannel 对应 ServerSocket，每一个 DatagramChannel 对象也有一个关联的 DatagramSocket 对象。正如 SocketChannel 模拟连接导向的流协议（如 TCP/IP）。DatagramChannel 是无连接的，每个数据报（datagram）都是一个自包含的实体，拥有它自己的目的地址及不依赖其它数据报的数据负载。与面向流连接的 socket 不同，DatagramChannel 可以发送单独的数据报给不同的目的地址。同样，DatagramChannel 对象也可以接收来自任意地址的数据包。每个到达的数据报都含有关于它来自何处的信息（源地址）。

### DatagramChannel 的使用

- **打开 DatagramChannel**

  ``` java
  DatagramChannel server = DatagramChannel.open();
  server.socket().bind(new InetSocketAddress(10086));
  ```

  打开 10086 端口接收 UDP 数据包。

- **接收数据**

  ``` java
  ByteBuffer receiveBuffer = ByteBuffer.allocate(64);
  receiveBuffer.clear();
  SocketAddress receive = server.receive(receiveBuffer);
  ```

  通过 receive() 接收 UDP 数据包，SocketAddress 可以获得发送包的 ip、端口等信息，可以使用 toString 查看。

- **发送数据**

  ``` java
  DatagramChannel server = DatagramChannel.open();
  ByteBuffer sendBuffer = ByteBuffer.wrap("客户端：".getBytes());
  server.send(sendBuffer, new InetSocketAddress("127.0.0.1",10086));
  ```

  通过 send() 发送 UDP 包。

- **连接**

  UDP 不存在真正意义的连接，这里的连接是向特定服务地址用 read 和 write 接收发送数据包。

  ``` java
  client.connect(new InetSocketAddress("127.0.0.1",10086));
  int readSize= client.read(sendBuffer);
  server.write(sendBuffer);
  ```

  read() 和 write() 只有在 connect() 之后才能使用，不然会抛 NotYetConnectedException 异常。用 read() 接收时，如果没有接收到包，会抛 PortUnreachableException 异常。

### DatagramChannel 使用的完整示例

#### 发送数据包

``` java
public class DatagramChannelSend {
	public static void main(String[] args) throws IOException, InterruptedException {
		DatagramChannel sendChannel = DatagramChannel.open();
		InetSocketAddress socketAddress = new InetSocketAddress("127.0.0.1", 9999);
		while (true) {
			sendChannel.send(ByteBuffer.wrap("发包".getBytes("UTF-8")), socketAddress);
			System.out.println("发送...");
			Thread.sleep(1000);
		}
	}
}
```

**输出**

``` bash
Connected to the target VM, address: '127.0.0.1:62624', transport: 'socket'
发送...
发送...
发送...
发送...
发送...
发送...
发送...
```

#### 接收数据包

``` java
public class DatagramChannelReceive {
	public static void main(String[] args) throws IOException {
		DatagramChannel receiveChannel = DatagramChannel.open();
		InetSocketAddress receiveAddress = new InetSocketAddress(9999);
		receiveChannel.bind(receiveAddress);
		ByteBuffer receiveBuffer = ByteBuffer.allocate(512);
		while (true) {
			receiveBuffer.clear();
			SocketAddress sendAddress = receiveChannel.receive(receiveBuffer);
			receiveBuffer.flip();
			System.out.println(sendAddress.toString());
			System.out.println(Charset.forName("UTF-8").decode(receiveBuffer));
		}
	}
}
```

**输出**

``` java
Connected to the target VM, address: '127.0.0.1:62624', transport: 'socket'
/127.0.0.1:60487
发包
/127.0.0.1:60487
发包
/127.0.0.1:60487
发包
/127.0.0.1:60487
发包
```



#### 接收应答

``` java
public class ReceiveAndSend {

	public static void main(String[] args) throws IOException, InterruptedException {
		DatagramChannel channel = DatagramChannel.open();
		// 绑定端口
		channel.bind(new InetSocketAddress(9001));
		channel.connect(new InetSocketAddress("127.0.0.1", 9002));
		// 非阻塞模式
		channel.configureBlocking(false);

		ByteBuffer read = ByteBuffer.allocate(512);
		String msg = "接受到了吗？";
		while (true) {
			// 接收数据
			read.clear();
			int readIndex = channel.read(read);

			// read 读取到了数据
			if (readIndex != -1) {
				read.flip();
				System.out.println("【*】收到消息：" + Charset.forName("UTF-8").decode(read));

				System.out.println("【*】发送消息：" + msg);
				// 发送数据
				channel.write(ByteBuffer.wrap(msg.getBytes("UTF-8")));
			}

			Thread.sleep(1000);
		}
	}
}
```



``` java
public class ReceiveAndSend1 {
	public static void main(String[] args) throws IOException, InterruptedException {
		DatagramChannel channel = DatagramChannel.open();
		// 绑定端口
		channel.bind(new InetSocketAddress(9002));
		channel.connect(new InetSocketAddress("127.0.0.1", 9001));
		ByteBuffer read = ByteBuffer.allocate(512);
		String msg = "收到了";
		while (true) {
			// 接收数据
			read.clear();
			int readIndex = channel.read(read);

			// read 读取到了数据
			if (readIndex != -1) {
				read.flip();
				System.out.println("【*】收到消息：" + Charset.forName("UTF-8").decode(read));

				System.out.println("【*】发送消息：" + msg);
				// 发送数据
				channel.write(ByteBuffer.wrap(msg.getBytes("UTF-8")));
			}

			Thread.sleep(1000);
		}
	}
}
```

