---
title: NIO 其它
sidebar: auto
date: 2021-11-08
categories:
 - Java
tags:
 - NIO
---

## Path

### Path 介绍

Java Path 接口是 Java NIO 更新的一部分，同 Java NIO 一起已经包括在 Java 6 和 Java 7 中。Java Path 接口是在 Java 7 中添加到 Java NIO 的。

Java Path 实例表示文件系统中的路径。一个路径可以指向一个文件或一个目录。路径可以是绝对路径，也可以是相对路径。绝对路径包含从文件系统的根目录到它指向的文件或目录的完整路径。相对路径包含相对于其它路径的文件或目录的路径。

在许多方面，java.nio.file.Path 接口类似于 java.io.File 类，但是有一些差别。不过，在许多情况下，可以使用 Path 接口来替换 File 类的使用。



### 创建 Path 实例

使用 java.nio.file.Path 实例必须创建一个 Path 实例。可以使用 Paths(java.nio.file.Paths) 类中的静态方法 Paths.get(String first, String... more) 来创建路径实例。

``` java
Path path = Paths.get("E:\\1.txt");
```

Paths.get(String first, String... more) 方法是 Path 实例的工厂方法。



### 创建绝对路径

- 创建绝对路径，通过调用 paths.get(String first, String... more) 方法，给定绝对路径文件作为参数来完成。

  实例代码：

  ``` java
  Path path = Paths.get("E:\\1.txt");
  ```

  上述代码中，绝对路径是 E://1.txt。在 Java 字符串中， `\` 是一个转义字符，需要编写 \\\\，告诉 Java 编译器在字符串中写入一个 `\` 字符。
  
- 如果在 Linux、MacOS 等操作系统上，上述的绝对路径可能如下：

  ``` java
  Path path = Paths.get("/home/admin/1.txt");
  ```

- 如果在 windows 机器上使用了从 `/` 开始的路径，那么路径将被解释为相对于当前驱动器。



### 创建相对路径

Java NIO Path 类也可以用于处理相对路径，同样还是使用 paths.get(String first, String... more) 方法创建一个相对路径。

实例代码：

``` java
Path path = Path.get("E:\\myFile", "test");
```

创建了一个 Path 实例，指向路径（目录）：E:\\\\myFile\\\\test。

```java
Path path = Path.get("E:\\myFile","test\\1.txt");
```

创建了一个 Path 实例，指向路径（文件）:E:\\\\myFile\\\\test\\\\1.txt。



### Path.normalize()

Path 接口的 normalize() 方法可以使用路径标准化。标准化意味着它将移除所有在路径字符串的中间的 `.` 和 `..` 代码，并解析路径字符串所引用的路径。

实例代码：

``` java
public class PathDemo {
	public static void main(String[] args) {
		String path = "E:\\Java-Learning\\src\\..\\nio\\channel\\1.txt";

		Path path1 = Paths.get(path);
		System.out.println("path1 = " + path1);

		Path normalize = path1.normalize();
		System.out.println("normalize = " + normalize);

	}
}
```

输出：

``` bash
path1 = E:\Java-Learning\src\..\nio\channel\1.txt
normalize = E:\Java-Learning\nio\channel\1.txt
```

标准化的路径不包含 `src\..` 部分。



## Files

Java NIO Files 类（java.nio.file.Files）提供了几种操作文件系统中的文件的方法。Java NIO Files 与 Java NIO Path 实例一起工作，所以在学习 Files 之前需要先学习 Path。接下来将介绍 Java NIO Files 最常用的一些方法。



### Files.createDirectory()

File.createDirectory() 方法，用于根据 Path 实例创建一个新目录。

实例代码：

``` java
public class FilesCreateDirectories {
	public static void main(String[] args) {
		Path path = Paths.get("E:\\test\\ddd");

		try {
			Path directories = Files.createDirectories(path);
		}
		catch (FileAlreadyExistsException e) {
			// 文件已存在
		}
		catch (IOException e) {
			// 其它 IO 异常，如果所创建的目录的父路径不存在时，也会报 IOException
			e.printStackTrace();
		}

	}
}
```



### Files.copy()

**File.copy() 方法从一个路径拷贝一个文件到另外一个目录。**

实例代码：

``` java
public class FilesCopy {
	public static void main(String[] args) {

		Path fromPath = Paths.get("E:\\test\\ddd\\1.txt");
		Path toPath = Paths.get("E:\\test\\ccc\\2.txt");

		try {
			// StandardCopyOption.REPLACE_EXISTING 如果文件已存在，覆盖
			Files.copy(fromPath, toPath, StandardCopyOption.REPLACE_EXISTING);
		} catch (DirectoryNotEmptyException e) {
			// 由于目录不为空而导致文件系统操作失败时抛出的检查异常
		} catch (FileAlreadyExistsException e) {
			// 文件已存在
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```



### Files.move()

Files.move() 用于将文件从一个路径移动到另一个路径。移动文件与重命名相同，但是移动文件既可以移动到不同的目录，也可以在相同的操作中更改它的名称。

实例代码：

``` java
public class FilesMove {
	public static void main(String[] args) {
		Path fromPath = Paths.get("E:\\test\\ddd\\1.txt");
		Path toPath = Paths.get("E:\\test\\ccc\\3.txt");

		try {
			Files.move(fromPath, toPath, StandardCopyOption.REPLACE_EXISTING);
		} catch (DirectoryNotEmptyException e) {
			// 由于目录不为空而导致文件系统操作失败时抛出的检查异常
		} catch (FileAlreadyExistsException e) {
			// 文件已存在
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```



### Files.delete()

Files.delete() 方法可以删除一个文件或目录。

实例代码：

``` java
public class FilesDelete {
	public static void main(String[] args) {
		Path filePath = Paths.get("E:\\test\\ccc\\3.txt");

		try {
			Files.delete(filePath);
		} catch (NoSuchFileException e) {
			// 文件不存在
		} catch (DirectoryNotEmptyException e) {
			// 文件目录为空
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```



### Files.walkFileTree()

- Files.walkFileTree() 方法包含递归遍历目录树功能，将 Path 实例和 FileVisitor 作为参数。Path 实例指向要遍历的目录，FileVisitor 在遍历期间被调用。

- FileVisitor 是一个接口，必须自己实现 FileVisitor 接口，并将实现的实例传递给 walkFileTree() 方法。在目录遍历过程中，你的 FileVisitor 实现的每个方法都将被调用。如果不需要实现所有这些方法，那么可以扩展 SimpleFileVisitor 类，它包含 FileVisitor 接口中所有的方法的默认实现。

- FileVisitor 接口的方法中，每个都返回一个 FileVisitResult 枚举实例。FileVisitResult 枚举包含以下四个选项：

  - CONTINUE 继续
  - TERMINATE 终止
  - SKIP_SIBLING 跳过同级
  - SKIP_SUBTREE 跳过子级

  实例代码：

  ``` java
  public class FilesWalkFileTree {
  	public static void main(String[] args) {
  		Path path = Paths.get("E:\\test");
  		String fileToFind = File.separator + "1.txt";
  
  		try {
  
  			Path fileTree = Files.walkFileTree(path, new SimpleFileVisitor<Path>() {
  				@Override
  				public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
  					String fileString = file.toAbsolutePath().toString();
  					System.out.println("pathString = " + fileString);
  					if (fileString.endsWith(fileToFind)) {
  						System.out.println("file found at path: " + file.toAbsolutePath());
  						return FileVisitResult.TERMINATE;
  					}
  					return FileVisitResult.CONTINUE;
  				}
  			});
  		} catch (IOException e) {
  			e.printStackTrace();
  		}
  	}
  }
  ```

  输出：

  ``` bash
  pathString = E:\test\ccc\2.txt
  pathString = E:\test\ccc\3.txt
  pathString = E:\test\ddd\1.txt
  file found at path: E:\test\ddd\1.txt
  ```

  

## AsynchronousFileChannel

在 Java 7 中，Java NIO 中添加了 AsynchronousFileChannel，也就是异步将数据写入文件。

### 创建 AsynchronousFileChannel

通过静态方法 open() 创建。

``` java
public class AsynchronousFileChannelOpen {
	public static void main(String[] args) {
		Path filePath = Paths.get("E:\\test\\ddd\\1.txt");
		try {
			// 参数一：指向目标文件 path
			// 参数二：是一个可变长参数，表示文件操作选项，告诉 AsynchronousFileChannel 可以在文件上执行那些操作
			AsynchronousFileChannel.open(filePath, StandardOpenOption.READ);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
```



### 通过 Future 读取数据

AsynchronousFileChannel 读取数据有两种方式。第一种方式是调用 Future 的 read() 方法。

实例代码：

``` java
public class FutureReadData {
	public static void main(String[] args) {
		Path filePath = Paths.get("E:\\test\\ddd\\1.txt");
		AsynchronousFileChannel fileChannel = null;

		try {
			// 创建 AsynchronousFileChannel 对象
			fileChannel = AsynchronousFileChannel.open(filePath, StandardOpenOption.READ);
		} catch (IOException e) {
			e.printStackTrace();
		}

		// 准备缓冲区
		ByteBuffer buffer = ByteBuffer.allocate(1024);

		// 参数一：要传输字节的缓冲区
		// 参数二：开始传输的文件位置； 必须是非负数
		Future<Integer> operation = fileChannel.read(buffer, 0);

		// 等待读取数据（因为是异步，所以此时需要等待，当一次读取操作完毕时，isDown() 返回 true ）
		while (!operation.isDone()) {

		}

		buffer.flip();
		byte[] datas = new byte[buffer.limit()];

		// 将 Buffer 内的数据读取到字节数组 datas 中
		buffer.get(datas);

		// 打印数据
		System.out.println(new String(datas));
		buffer.clear();
	}
}
```



### 通过 CompletionHandler 读取数据

AsynchronousFileChannel 读取数据的第二种方法是调用 read() 方法，并传入一个 CompletionHandler 实例作为参数。

实例代码：

``` java
public class CompletionHandlerReadData {
	public static void main(String[] args) throws InterruptedException {
		Path filePath = Paths.get("E:\\test\\ddd\\1.txt");
		AsynchronousFileChannel fileChannel = null;

		try {
			// 创建 AsynchronousFileChannel 对象
			fileChannel = AsynchronousFileChannel.open(filePath, StandardOpenOption.READ);
		} catch (IOException e) {
			e.printStackTrace();
		}

		// 准备缓冲区
		ByteBuffer buffer = ByteBuffer.allocate(1024);

		// 参数一：要传输字节的缓冲区
		// 参数二：开始传输的文件位置； 必须是非负数
		// 参数三：附加到 I/O 操作的对象； 可以为 null
		// 参数四：使用结果的处理程序
		fileChannel.read(buffer, 0, 1, new CompletionHandler<Integer, Integer>() {
			/**
			 * 在操作完成时调用
			 * @param result 字节数
			 * @param attachment  附件
			 */
			@Override
			public void completed(Integer result, Integer attachment) {
				System.out.println("result = " + result);

				// 这里可以将外层 buffer 作为附件传入，在改方法内可以直接读取到数据
//				attachment.flip();
//				byte[] datas = new byte[attachment.limit()];
//				attachment.get(datas);

//				System.out.println("attachment = " + new String(datas));
//				attachment.clear();

				System.out.println("attachment = " + attachment);

			}

			/**
			 * 数据读取失败
			 * @param exc 异常
			 * @param attachment 附件
			 */
			@Override
			public void failed(Throwable exc, Integer attachment) {
				System.out.println("read failed!");
			}
		});

		// read() 方法是异步操作，所以这里需要等待一下
		// 使用 completionHandler 方法不好的地方就是无法判断什么时候数据读取完毕
		Thread.sleep(2000);

        // 读取数据
		buffer.flip();
		byte[] datas = new byte[buffer.limit()];
		buffer.get(datas);
		System.out.println("datas = " + new String(datas));
	}
}

```



### 通过 Future 写数据

和读取一样，可以通过两种方式将数据写入一个 AsynchronousFileChannel。

实例代码：

``` java
public class FutureWriteData {
	public static void main(String[] args) {
		Path filePath = Paths.get("E:\\test\\ddd\\1.txt");
		AsynchronousFileChannel channel = null;

		try {
			// 获取 AsynchronousFileChannel
			channel = AsynchronousFileChannel.open(filePath, StandardOpenOption.WRITE);
		} catch (IOException e) {
			e.printStackTrace();
		}

		// 创建缓冲区
		ByteBuffer buffer = ByteBuffer.allocate(1024);

		// 将待写入数据存入缓冲区
		buffer.put("Hello Word!".getBytes(StandardCharsets.UTF_8));

		// 准备写入
		buffer.flip();

		Future<Integer> future = channel.write(buffer, 0);
		while (!future.isDone()) {

		}

		System.out.println("Write Over!");
	}
}
```



### 通过 CompletionHandler 写数据

实例代码：

``` java
public class CompletionHandlerWrite {
	public static void main(String[] args) {
		Path filePath = Paths.get("E:\\test\\ddd\\1.txt");
		AsynchronousFileChannel fileChannel = null;

		try {
			// 创建 AsynchronousFileChannel 对象
			fileChannel = AsynchronousFileChannel.open(filePath, StandardOpenOption.WRITE);
		} catch (IOException e) {
			e.printStackTrace();
		}

		// 创建缓冲区
		ByteBuffer buffer = ByteBuffer.allocate(1024);

		// 将待写入数据存入缓冲区
		buffer.put("Hello Word!".getBytes(StandardCharsets.UTF_8));

		// 准备写入
		buffer.flip();

		fileChannel.write(buffer, 0, buffer, new CompletionHandler<Integer, ByteBuffer>() {
			@Override
			public void completed(Integer result, ByteBuffer attachment) {
				System.out.println("Bytes written: " + result);
			}

			@Override
			public void failed(Throwable exc, ByteBuffer attachment) {
				System.out.println("Write failed!");
				exc.printStackTrace();
			}
		});
	}
}
```



## 字符集

Java 使用 Charset 来表示字符集编码对象。

**Charset 常用静态方法**

``` java
public static Charset forName(String charsetName); //通过编码类型获得 Charset 对象
public static SortedMap<String,Charset> availableCharsets(); //获得系统支持的所有编码方式
public static Charset defaultCharset(); //获得虚拟机默认的编码方
public static boolean isSupported(String charsetName); //判断是否支持该编码类型
```

**Charset 常用普通方法**

``` java
public final String name(); //获得 Charset 对象的编码类型(String)
public abstract CharsetEncoder newEncoder(); //获得编码器对象
public abstract CharsetDecoder newDecoder(); //获得解码器对象
```

实例代码：

``` java
public class CharsetEncoderAndDecoder {
	public static void main(String[] args) throws CharacterCodingException {
		Charset charset = Charset.forName("UTF-8");

		// 获取编码器
		CharsetEncoder encoder = charset.newEncoder();

		// 获取解码器
		CharsetDecoder decoder = charset.newDecoder();

		// 获取需要节码编码的数据
		CharBuffer buffer = CharBuffer.allocate(1024);
		buffer.put("字符集编码解码");
		buffer.flip();

		// 编码
		ByteBuffer encode = encoder.encode(buffer);
		System.out.println("编码后：" + new String(encode.array()));

		// 解码
		CharBuffer decode = decoder.decode(encode);
		System.out.println("解码后：" + decode);
	}
}
```



