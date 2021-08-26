---
title: Synchronized 同步锁
sidebar: auto
date: 2021-05-25
categories:
 - 多线程
 - Java
tags:
 - Thread
---

synchronized 可以把任意一个非 null 对象当作锁，`它属于独占式的悲观锁，同时也属于可重入锁`。

::: tip
synchronized 同步块是可重入的，这意味着如果一个 Java 线程进入了代码中的 synchronized 同步块，并因此获得了该同步块使用的同步对象对应的`管程`上的锁，那么这个线程可以进入由同一个管程对象所同步的另一个 Java 代码块；

当一个线程已经拥有了一个管程对象上的锁，那么它就有权访问被这个管程对象同步的所有代码块，这就是可重入。
:::

## Synchronized 作用范围

1. 作用于方法时，锁住的是一个对象实例（this），所以当两个线程访问同一对象的两个同步方法时，是会产生互斥的，原因是`同一对象内，同步方法（同步块）可以有多个，但对象锁始终只有一个`。

2. 当作用于静态方法时，锁住的是`类实例`，俗称“类锁”；又因为类的相关数据存储在永久代 PermGen（jdk1.8 则是 metaspace），永久代是全局共享的，因此静态方法锁相当于类的一个全局锁，锁住的是类对象，所以当两个线程调用同一类的非静态方法或静态方法都是会产生互斥的。

3. synchronized 作用于一个对象实例时，锁住的是所有以该对象为锁的代码块。它有多个队列，当多个线程一起访问某个对象监视器的时候，对象监视器会将这些线程存储在不同的容器中。


### 代码演示

``` java
/**
 * 当两个线程访问同一对象里的不同同步方法时，互斥
 * 当两个线程访问同一类中的不同静态同步方法时，互斥
 * 当两个线程访问同一类下的静态同步方法和非静态同步方法时，不互斥（静态同步块属于类对象，非静态同步块属于类的实例对象）
 */
public class SynchronizedDemo01 {
	public static void main(String[] args) {
		ThreadPoolExecutor executor = new ThreadPoolExecutor(10, 10, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>(), Executors.defaultThreadFactory());
		executor.execute(new Thread(new Thread01()));
		executor.execute(new Thread(new Thread02()));
		executor.shutdown();

	}
}

class Thread01 implements Runnable {
	@Override
	public void run() {
//		Demo.a();
		Demo.b();
//		Demo.demo.d();
//		Demo.demo.c();
	}
}

class Thread02 implements Runnable {
	@Override
	public void run() {
//		Demo.a();
//		Demo.b();
		Demo.demo.d();
//		Demo.demo.c();
	}
}

class Demo {

	public static Demo demo = new Demo();

	public synchronized static void a() {
		for (int i = 0; i < 10; i++) {
			System.out.println(Thread.currentThread().getName() + "执行 a() ...");
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	public synchronized static void b() {
		for (int i = 0; i < 10; i++) {
			System.out.println(Thread.currentThread().getName() + "执行 b() ...");
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	public void c() {
		for (int i = 0; i < 10; i++) {
			System.out.println(Thread.currentThread().getName() + "执行 c() ...");
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	public synchronized void d() {
		for (int i = 0; i < 10; i++) {
			System.out.println(Thread.currentThread().getName() + "执行 d() ...");
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
}
```

## Synchronized 核心组件

1. Wait Set：哪些调用 wait 方法被阻塞的线程被放置在这里；

2. Contention List：`竞争队列`，所有请求锁的线程首先被放在这个竞争队列中；

3. Entry List：Contention List 中那些`有资格成为候选资源的线程被移动到 Entry List 中`；

4. OnDeck：任意时刻，`最多只有一个线程正在竞争锁资源，该线程被称为 OnDeck`；

5. Owner：当前已经获取到锁资源的线程被称为 Owner；

6. !Owner：当前释放锁的线程。

## Synchronized 实现

<img :src="$withBase('/img/java/thread/Synchronized实现.png')" alt="Synchronized实现">

1. JVM 每次从队列的尾部去除一个数据用于锁竞争候选者（OnDeck），但是并发情况下，ContentionList 会被大量的并发线程进行 CAS 访问，为了降低对尾部元素的竞争，JVM 会将一部分线程移动到 EntryList 中作为候选竞争线程。

2. Owner 线程会在 unlock 时，将 ContentionList 中的部分线程迁移到 EntryList 中，并指定 EntryList 中的某个线程为 OnDeck 线程（一般时最先进去的那个线程）。

3. Owner 线程并不会直接把锁传递给 OnDeck 线程，而是把锁竞争的权力交给 OnDeck，OnDeck 需要重新竞争锁。这样虽然牺牲了一些公平性，但是能极大的提升系统的吞吐量，在 JVM 中，也把这种选择行为称之为“竞争切换”。

4. OnDeck 线程获取到锁资源后会变为 Owner 线程，而没有得到锁资源的仍然停留在 EntryList 中。如果 Owner 线程被 wait 方法阻塞，则转移到 WaitSet 队列中，知道某个时刻通过 notify 或者 notifyAll 唤醒，会重新进入到 EntryList 中。

5. 处于 ContentionList、EntryList、WaitSet 中的线程都处于阻塞状态，该阻塞是由操作系统来完成的。

6. Synchronized 是非公平锁。Synchronized 在线程进入 ContentionList 时，`等待的线程会先尝试自旋获取锁，如果获取不到就进入 ContentionList`，这明显对已经进入队列的线程是不公平的；还有一个不公平的地方，`自旋获取锁的线程还可能直接抢占 OnDeck 线程的资源`。

7. 每个对象都有个 monitor 对象（监视器对象），`加锁就是在竞争 monitor 对象`，代码块加锁是在前后分别加上 monitor enter 和 monitor exit 指令来实现的，方法加锁是通过一个标记位来判断的。

8. synchronized 是一个重量级操作，需要调用操作系统相关接口，性能是低效的，有可能导致，`线程加锁消耗的时间比同步块执行消耗的时间更多`。

9. JDK 1.6，synchronized 进行了很多的优化，比如添加了`适应性自旋、锁消除、锁粗化、轻量级锁以及偏向锁等`，效率有了本质上的提高。在之后推出的 JDK 1.7 于 1.8 中，均对该关键字的实现机理做了优化。引入了`偏向锁和轻量级锁`。都是在对象头中加入标记位，不需要经过操作系统加锁。

10. `锁可以从偏向锁升级到轻量级锁，再升级到重量级锁`。这种过程叫做`锁膨胀`。

11. JDK 1.6 中默认是开启偏向锁和轻量级锁的，可以通过 `-XX:-UseBiasedLocking` 来禁用偏向锁。
