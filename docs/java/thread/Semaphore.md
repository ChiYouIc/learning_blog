---
title: Semaphore 信号量
sidebar: auto
date: 2021-06-03
categories:
 - 多线程
 - Java
tags:
 - Thread
---

Semaphore
是一种基于计数的信号量。它可以设定一个阈值，基于此，多个线程竞争获取许可信号，结束后将其归还，超过阈值后，线程申请许可信号将会被阻塞。Semaphore
可以用来构建一些对象池，资源池之类的，比如数据库连接池。

Semaphore
管理着一组`许可(permit)`，许可的初始化数量可以通过构造函数设定，操作时首先要获取到许可，才能进行操作，操作完成后需要释放许可。如果没有获取许可，则阻塞。如果初始化了一个许可为
`1` 的 Semaphore，那么就相当于一个`不可重入的互斥锁(Mutex)`。

## 实例场景-业务办理

到银行办理业务的场景相比大家都经历过，不论是取款、存款还是其他业务，都需要先取票，然后等待前台呼叫（排除
VIP）。假设银行只有 10 个前台，那么同时办理的人数也只能是 10
个，只有当某个前台办理完毕之后，后面的人才能去办理。这里面就有 Semaphore
的应用场景，`争夺有限的资源`。

<img :src="$withBase('/img/java/thread/Semaphore演示-1.png')" alt="Semaphore演示-1">

### 代码演示

```java
public class Bank {

	public static void main(String[] args) {
		Random random = new Random(2000);
		for (int i = 0; i < 10; i++) {
			System.out.println(random.nextInt(20000));
		}
		
		// 模拟 30 个人
		int threadCount = 30;
		// 线程池
		ExecutorService threadPool = Executors.newFixedThreadPool(threadCount);
		// 信号量，模拟 10 个前台
		Semaphore semaphore = new Semaphore(10);

		for (int i = 0; i < threadCount; i++) {
			threadPool.execute(new Person(String.valueOf(i), semaphore));
		}

		threadPool.shutdown();
	}
}

class Person implements Runnable {

	private final String id;

	private final Semaphore semaphore;

	// 随机数，模拟办理等待时间
	private static final Random RAND = new Random(2000);

	public Person(String id, Semaphore semaphore) {
		this.id = id;
		this.semaphore = semaphore;
	}

	@Override
	public void run() {
		try {
			// 获取一个许可，如果未获取到，则阻塞
			semaphore.acquire();
			System.out.println(id + "号正在办理...");
			Thread.sleep(RAND.nextInt(30000));
			System.out.println(id + "号办理结束");
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			// 释放许可
			semaphore.release();
		}
	}
}
```

这里定义了 30 个人要办理业务，但是银行只有 10
个前台，每个人办理时间都是随机的。

::: tip  
当创建计数为 1 的
Semaphore，将其作为一种类似`互斥锁的机制`，这也叫二元信号量，表示两种互斥状态。
:::


## Semaphore 与 ReentrantLock

semaphore 基本能完成 ReentrantLock 的所有工作，使用方法也与之类似，通过
acquire() 与 release()
方法来获得和释放临界资源。经实测，Semaphore.acquire()
方法默认为可响应中断锁，与 ReentrantLock.lockInterruptibly()
作用效果一致，也就是说在等待临界资源的过程可以被 Thread.interrupt()
方法中断。

此外，Semaphore 也实现了`可轮询的锁请求与定时锁的功能`，除了方法命
tryAcquire 与 tryLock 不同， 其实用方法与 ReentrantLock
几乎一致。Semaphore
也提供了公平与非公平锁的机制，也在构造函数中进行设定。

Semaphore 的锁释放操作也由手动进行，因此与 ReentrantLock
一样，为避免线程因抛出异常而无法正常释放锁的情况，释放锁的操作也必须在
finally 代码块中完成。
