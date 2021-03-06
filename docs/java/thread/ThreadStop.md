---
title: 线程终止
sidebar: auto
date: 2021-06-22
categories:
 - 多线程
 - Java
tags:
 - Thread
---

## 程序执行结束

当线程执行 `run()` 方法结束后，线程就自动结束了。

### 代码演示

``` java
public class ThreadOverDemo {
	public static void main(String[] args) {
		Thread thread = new Thread(new Runnable() {
			@Override
			public void run() {
				// 线程执行内容
			}
		});

		thread.start();
	}
}
```

## 退出标志位

在正常情况下，只有当 `run()` 执行完毕，线程才结束。但在实际应用场景中，有些线程是伺服线程。它们需要长时间的运行，只有在满足某些外部条件下才能结束这些线程。最直接的方式就是设置一个 `boolean 类型的标志`，并通过修改该标志的值来控制 `while` 循环。

### 代码演示

``` java
public class ThreadStopDemo {
	public static void main(String[] args) throws InterruptedException {
		ThreadStopFlagDemo stopFlag = new ThreadStopFlagDemo();
		Thread thread = new Thread(stopFlag);
		thread.start();
		Thread.sleep(5000);
		stopFlag.exit();
	}
}

class ThreadStopFlagDemo implements Runnable {

	private volatile boolean exitFlag = false;

	@Override
	public void run() {
		while (!exitFlag) {
			System.out.println("执行中...");
		}
		System.out.println("退出线程...");
	}

	public void exit() {
		this.exitFlag = true;
	}
}
```

在上述代码中，通过设置 `exitFlag` 的值来控制 while 循环的退出，并且默认为 false；

**在定义 exitFlag 时，使用一个 Java 关键字 `volatile`，这个关键字的目的是使变量 exitFlag 同步，即：在同一时刻只能有一个线程修改 exitFlag 的值。**

## Interrupt() 方法

使用 `interrupt()` 方法中断线程有两种情况：

### 线程处于阻塞状态

如果在线程中使用了 `Thread.sleep()`，同步锁 `wait()`，Socket 中的 `receiver()`、`accept()` 等方法时，会使线程处于阻塞状态。当调用线程的 `InterruptException` 异常。阻塞中的那个方法抛出这个异常，通过代码捕获该异常，然后 `break` 跳出循环状态，从而让我们有机会结束这个线程。

::: warning
在执行 `interrupt()` 方法后，线程并不会结束(`run()` 方法还在执行)，必须要我们自己捕获 `InterruptException` 这个异常之后，再通过 `break` 主动结束循环，才能正常的结束 run() 方法，结束线程。
:::

#### 代码演示

``` java
public class ThreadStopDemo {
	public static void main(String[] args) throws InterruptedException {
		ThreadStopFlagDemo stopFlag = new ThreadStopFlagDemo();
		Thread thread = new Thread(stopFlag);
		thread.start();

		Thread.sleep(5000);
		thread.interrupt();
	}
}

class ThreadStopFlagDemo implements Runnable {

	private volatile boolean exitFlag = false;

	@Override
	public void run() {
		while (!exitFlag) {
			try {
				System.out.println("执行中...");
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
				System.out.println("线程异常退出...");
				break;
			}
		}
		System.out.println("退出线程...");
	}

	public void exit() {
		this.exitFlag = true;
	}
}
```

#### 输出

``` bash
执行中...
执行中...
执行中...
执行中...
执行中...
java.lang.InterruptedException: sleep interrupted
Disconnected from the target VM, address: '127.0.0.1:58540', transport: 'socket'
	at java.lang.Thread.sleep(Native Method)
	at com.ic.thread.ThreadStopFlagDemo.run(ThreadStopDemo.java:29)
	at java.lang.Thread.run(Thread.java:748)
线程异常退出...
退出线程...
```

从输出中可以得知，在使用 `interrupt()` 时，即时程序抛出 `InterruptException` 异常，但线程并不会立即终止掉，并且还能保持继续执行的状态；上述在捕获异常时，主动使用了 `break` 跳出循环终止线程。线程之所以在抛出 `InterruptException` 时不直接终止线程，是为了保护线程数据的一致性，这在下面 `stop() 方法`终止线程会说到。

### 线程未处于阻塞状态

使用 `isInterrupted()` 判断线程的中断标志来退出循环。当使用 `interrupt()` 方法时，`中断标志`就会置为 true，和使用自定义的标志来控制循环是一个道理。

#### 代码演示

``` java
public class ThreadStopDemo {
	public static void main(String[] args) throws InterruptedException {
		IsInterrupt interrupt = new IsInterrupt();
		interrupt.start();
		Thread.sleep(5000);
		interrupt.interrupt();
		System.out.println(interrupt.isInterrupted());
	}
}

class IsInterrupt extends Thread {

	@Override
	public void run() {
		while (!isInterrupted()) {
			try {
				System.out.println("执行中...");
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
				System.out.println("线程异常退出...");
				break;
			}
		}
		System.out.println("退出线程...");
	}
}
```
#### 输出

``` bash
执行中...
执行中...
执行中...
执行中...
执行中...
false
线程异常退出...
退出线程...
java.lang.InterruptedException: sleep interrupted
	at java.lang.Thread.sleep(Native Method)
	at com.ic.thread.IsInterrupt.run(ThreadStopDemo.java:32)
```

## Stop() 方法

程序中可以直接使用 `thread.stop()` 来强行终止线程，但是呢，`stop()` 方法是很危险的，就像突然关闭计算机电源，会导致程序产生不可预料的结果；不安全的主要原因是：thread.stop() 调用之后，创建子线程的线程会创建一个 `ThreadDeath` 的实例作为异常抛出，但是不会以任何方式通知应用程序（控制台不会有输出，无感知），并且会释放子线程所持有的锁；这是非常危险的操作，因为通常情况下，加锁代码块的目的是为了保证数据一致性，如果在调用 thread.stop() 后导致该线程所持有的锁突然完全释放，那么其它线程读取这些数据就有可能出现不一致的情况，那么此时就很有可能会出现一些莫名奇妙的程序错误。如果使用`try...catch...finally`去捕获该异常时，因此，并不推荐使用 stop() 方法来终结线程。

### 代码演示

``` java
public class ThreadStopDemo {
	public static void main(String[] args) throws InterruptedException {
		ThreadStop threadStop = new ThreadStop();
		Thread t1 = new Thread(threadStop);
		Thread t2 = new Thread(threadStop);
		t1.start();
		t2.start();
		Thread.sleep(11000);
		t1.stop();
	}
}

class ThreadStop implements Runnable {
	private int i = 0;
	private int j = 0;

	private volatile boolean exitFlag = false;

	@Override
	public synchronized void run() {
		while (!exitFlag) {
			try {
				System.out.println(Thread.currentThread().getName()+ " i :" + i++);
				Thread.sleep(1000);
				System.out.println(Thread.currentThread().getName()+ " j :" + j++);
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	public void exit() {
		this.exitFlag = true;
	}
}

```

### 输出
``` bash
Connected to the target VM, address: '127.0.0.1:56341', transport: 'socket'
Thread-0 i :0
Thread-0 j :0
Thread-0 i :1
Thread-0 j :1
Thread-0 i :2
Thread-0 j :2
Thread-0 i :3
Thread-0 j :3
Thread-0 i :4
Thread-0 j :4
Thread-0 i :5
# 当线程执行到 11 秒时；此时 Thread-0 线程调用 stop()；此时就导致 Thread-1 读取到的 i != j
Thread-1 i :6
Thread-1 j :5
Thread-1 i :7
Thread-1 j :6
Thread-1 i :8
Thread-1 j :7
Thread-1 i :9
Thread-1 j :8
Thread-1 i :10
Thread-1 j :9
Thread-1 i :11
Thread-1 j :10
Thread-1 i :12
Thread-1 j :11
Thread-1 i :13
Thread-1 j :12
Disconnected from the target VM, address: '127.0.0.1:56341', transport: 'socket'

Process finished with exit code 130

```
