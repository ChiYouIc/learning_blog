---
title: FileChannel 使用
sidebar: auto
date: 2021-09-16
categories:
 - Java
tags:
 - NIO
---



## FileChannel 介绍和示例

FileChannel 类可以实现常用的 read，write 以及 scatter/gather 操作，同时它也提供了很多专用于文件的新方法。在这些方法中有很多都是我们所熟悉的文件操作。

| 方法                          | 描述                                         |
| ----------------------------- | -------------------------------------------- |
| int read(ByteBuffer dst)      | 从 Channel 中读取数据到 ByteBuffer           |
| long read(BeteBuffer[] dsts)  | 将 Channel 中的数据 “分散” 到 ByteBuffer[]   |
| int write(ByteBuffer src)     | 将 ByteBuffer 中的数据写入到 Channel         |
| long write(ByteBuffer[] srcs) | 将 ByteBuffer[] 中的数据 “聚集” 到 Channel   |
| long position()               | 返回此通道的文件位置                         |
| FileChannel position(long p)  | 设置次通道的文件位置                         |
| long size()                   | 返回此通道的文件的当前大小                   |
| FileChannel truncate(long s)  | 将此通道的文件截取为给定大小                 |
| void force(boolean metaDate)  | 强制将所有对此通道的文件更新写入到存储设备中 |

```java
public class FileChannelReadInfo {
   public static void main(String[] args) throws IOException {
      try (RandomAccessFile file = new RandomAccessFile("E:\\1.txt", "rw")) {

         // 获取文件通道
         FileChannel channel = file.getChannel();

         // 定义一个缓冲区，大小为 48 字节
         ByteBuffer buf = ByteBuffer.allocate(48);

         // 使用 buffer 承载缓冲区的数据
         // channel.read(buf) 的返回值为 -1 时，表示没有可读数据，其余情况读取的字节数
         int read = channel.read(buf);

         while (read != -1) {
            System.out.println("读取：" + read);
            // 翻转这个缓冲区。 将限制(limit)设置为当前位置，然后将位置设置为零。准备进行读取
            buf.flip();

            // 告诉当前位置和限制(limit)之间是否有任何元素。
            while (buf.hasRemaining()) {
               // 缓冲区当前位置的字节
               System.out.printf("%c", (char) buf.get());
            }

            System.out.println("");

            // 清空缓冲区，准备下一次读取
            buf.clear();

            read = channel.read(buf);
         }
        
        // 关闭通道
		channel.close();
      } catch (IOException e) {
         e.printStackTrace();
      }
   }
}
```

::: tip Buffer 通常的操作



@flowstart
one=>operation: 将数据写入缓冲区

two=>operation: 调用 buffer.flip() 反转读写模式 

three=>operation: 从缓冲区读取数据 

four=>operation: 调用 buffer.clear() 或 buffere.compact() 清除缓冲区内容

one->two

two->three

three->four

@flowend

:::



## FileChannel 操作详解

### 打开 FileChannel

在使用 FileChannel 之前，必须先打开它。但是，我们无法直接打开一个 FileChannel，需要通过使用一个 InputStream、OutputStream 或 RandomAccessFile 来获取一个 FileChannel 实例。下面是通过 RandomAccessFile 打开 FileChannel 的示例：

``` java
RandomAccessFile file = new RandomAccessFile("E:\\1.txt", "rw");
FileChannel channel = file.getChannel();
```



### 从 FileChannel 读取数据

``` java
ByteBuffer buf = ByteBuffer.allocate(48);
int read = channel.read(buf);
```

使用 `ByteBuffer.allocate(capacity)` 分配一个大小为 capacity 的 Buffer。然后调用 `FileChannel.read(buf)` 方法将通道内的数据读取到 Buffer 中。read() 方法返回的 int 值表示有多少字节的数据被读到了 Buffer 中；如果返回 -1，表示读到了文件末尾。



### 向 FileChannel 写数据

``` java
public class FileChannelWriteInfo {
	public static void main(String[] args) {
		try (RandomAccessFile file = new RandomAccessFile("E:\\1.txt", "rw")) {
			FileChannel channel = file.getChannel();

            // 将通道的当前数据位置偏移到最后一位，实现数据的增加，直接写入，会从头写入覆盖原有的数据
			channel.position(channel.size());

			String newData = "new Data to write file at " + LocalDateTime.now();
			
            // 分配一个 buffer
			ByteBuffer buffer = ByteBuffer.allocate(64);

			// 清空缓冲区
			buffer.clear();

			// 将新数据转为字节数据，并设置到 buffer 中
			buffer.put(newData.getBytes(StandardCharsets.UTF_8));
            
			//翻转 buffer，准备读取 buffer 中的数据
			buffer.flip();
            
			while (buffer.hasRemaining()) {
				// 将 buffer 数据写入到 channel 中
				channel.write(buffer);
			}

			channel.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```

注意 FileChannel.write()是在 while 循环中调用的。因为无法保证 write()方法一次能向 FileChannel 写入多少字节，因此需要重复调用 write()方法，直到 Buffer 中已经没有尚未写入通道的字节。



### 关闭 FileChannel

用完 FileChannel 后必须将其关闭。如：

``` java
channel.close();
```



### FileChannel 的 position 方法

有时可能需要在 FileChannel 的某个特定位置进行数据的读/写操作。可以通过调用 `position()` 方法获取 FileChannel 的当前数据位置。也可以通过调用 `position(long pos)` 方法设置 FileChannel 的当前数据位置。

``` java
// 获取 channel 当前位置
long pos = channel.position();

// 设置 channel 当前位置
channel.position(pos + 100);
```

如果将位置设置载文件结束符之后，然后向通道中写入数据，文件将撑大到当前位置并写入数据。这可能导致“文件空洞”，磁盘上物理文件中写入的数据有空隙。



### FileChannel 的 size 方法

FileChannel 实例的 size() 方法将返回该实例所关联文件的大小。如：

``` java
long fileSize = channel.size();
```



### FileChannel 的 truncate 方法

可以使用 FileChannel.truncate() 方法截取一个文件。截取文件时，文件将截取部分之外的数据删除。如：

``` java
// 截取文件的前 1024 个字节
channel.truncate(1024);
```



### FileChannel 的 force 方法

FileChannel.force() 方法将通道里尚未写入磁盘的数据强制写到磁盘上。处于性能方面的考虑，操作系统会将数据缓存在内存中，所以无法保证写入到 FileChannel 里的数据一定会即时写到磁盘上。要保证这一点，需要调用 force() 方法。

force() 方法有一个 boolean 类型的参数，指明是否同时将文件元数据（权限信息等）写到磁盘上。



### FileChannel 的 transferTo 和 transferFrom 方法

#### 通道之间的数据传输

如果两个通道中有一个是 FileChannel，那你可以直接将数据从一个 Channel 传输到另外一个 Channel。

#### transferFrom() 方法

FileChannel 的 transferFrom() 方法可以将数据从源通道传输到 FileChannel 中（译者注：这个方法在 JDK 文档中的注释为将字节从给定的可读取字节通道传输到此通道的文件中）。

``` java
public class FileChannelTransferFrom {
	public static void main(String[] args) throws IOException {
		// 获取源文件 channel
		RandomAccessFile file1 = new RandomAccessFile("E:\\1.txt", "rw");
		FileChannel fromChannel = file1.getChannel();

		// 获取目标文件 channel
		RandomAccessFile file2 = new RandomAccessFile("E:\\2.txt", "rw");
		FileChannel toChannel = file2.getChannel();

		// 文件中传输开始的位置（从目标 position 的位置开始写入，当 position > 目标文件长度时，不会有任何数据写入）
		long position = toChannel.size();

		// 要传输的最大字节数（从源文件中传输的最大字节数）
		long count = fromChannel.size() - 20;
		
        // 目标 channel 从源 channel 中获取数据
		toChannel.transferFrom(fromChannel, position, count);

		file1.close();
		file2.close();
	}
}
```

transferFrom() 方法的输入参数 position 表示从 position 处开始向目标文件写入数据，count 表示最多传输的字节数。如果源通道的剩余空间小于 count 个字节，也就是所传输的字节数要小于请求的字节数，此时则按源通道剩余空间大小作为最多传输字节数。此外要注意，在 SocketChannel 的实现中，SocketChannel 只会传输此刻准备好的数据（可能不足 count 字节）。因此，SocketChannel 可能不会将请求的所有数据（count 个字节）全部传输到 FileChannel 中。

#### transferTo() 方法

transferTo() 方法将数据从 FileChannel 传输到其它的 channel 中。

``` java
public class FileChannelTransferTo {
	public static void main(String[] args) throws IOException {
		// 获取源文件 channel
		RandomAccessFile file1 = new RandomAccessFile("E:\\2.txt", "rw");
		FileChannel fromChannel = file1.getChannel();

		// 获取目标文件 channel
		RandomAccessFile file2 = new RandomAccessFile("E:\\3.txt", "rw");
		FileChannel toChannel = file2.getChannel();

		// 文件中传输开始的位置（从源 position 的位置开始获取，当 position > 目标文件长度时，不会有任何数据能获取到）
		long position = 0;

		// 要传输的最大字节数（从源文件中传输的最大字节数）
		long count = fromChannel.size();

		// 将源 channel 数据推送给目标 channel
		fromChannel.transferTo(position, count, toChannel);

		file1.close();
		file2.close();
	}
}
```

**transferFrom() 是目标 channel 获取源 channel 数据，transferTo() 是源 channel 数据主动推送给目标 channel，它们的目的都是数据传输，只是传输动作上有些许差异。**