---
title: ReentrantLock
sidebar: auto
date: 2021-06-05
categories:
 - 多线程
 - Java
tags:
 - Thread
---

ReentantLock 继承接口 Lock 并实现了接口中定义的方法，它是一种可重入锁，除了能完成 synchronized 所能完成的所有工作外，还`提供了诸如可响应式中断锁、可轮询锁请求、定时锁等避免多线程死锁的方法`。

## Lock 接口的主要方法

### public void lock()

执行此方法时，`如果锁处于空闲状态，当前线程将获取到锁`。相反，如果锁已经被其它线程持有，将禁用当前线程，并处于休眠状态，直到当前获取到锁。

### public boolean tryLock()

`如果锁可重用，则获取锁，并立即返回 true，否则返回 false`。该方法和 lock() 的区别在于，tryLock() 只是”视图“获取锁，如果锁不可用，不会导致当前线程被禁用，当前线程仍然继续往下执行代码。而 lock() 方法则是一定要获取到锁，如果锁不可用，就一直等待，在未获得锁之前，当前线程并不继续向下执行。

### public void unlock()

执行此方法时，`当前线程将释放持有的锁`。锁只能由持有者释放，如果线程并不持有锁，却执行改方法，可能导致异常的发生。

### public Condition newCondition()

`条件对象，获取等待通知组件`。该组件和当前的锁绑定，当前线程只有获取了锁，才能调用该组件的 await() 方法，而调用后，当前线程将释放锁。

### public int getHoldCount()

查询当前线程保持此锁的次数，也就是执行此线程执行 lock() 方法的次数。

### public final int getQueueLength()

返回正在等待获取此锁的线程估计数，比如启动了 10 个线程，1 个线程获得锁，此时返回的是 9。

### public boolean hasWaiters(Condition condition)

查询是否有线程等待与此锁有关的给定条件（condition），对于指定 condition 对象，有多少线程执行了 condition.await() 方法。

### public final boolean hasQueuedThread(Thread thread)

查询给定线程是否等待获取此锁。

### public final boolean hasQueuedThreads()

是否有线程等待此锁。

### public final boolean isFair()

该锁是否公平锁。

### public boolean isHeldByCurrentThread()

当前线程是否保持锁锁定，线程的执行 lock() 方法的前后分别是 false 和 true。

### public boolean isLocked()

此锁是否有任意线程占用。

### public void lockInterruptibly()

如果当前线程未被中断，获取锁。

### public boolean tryLock(long timeout, TimeUnit unit)

如果锁在给定等待时间内没有被另一个线程保持，则获取该锁。



## 非公平锁

JVM 按随机、就近原则分配锁的机制则称为非公平锁，ReentrantLock 在构造函数中提供了是否公平锁的初始化方式，默认为非公平锁。非公平锁实际执行效率要远远超出公平锁，除非程序有特殊需要，否则最常用非公平锁的分配机制。



## 公平锁

公平锁指的是锁的分配机制是公平的，通常先对锁提出获取请求的线程会先被分配到锁，ReentrantLock 在构造函数中提供了是否公平的初始化方式来定义公平锁。



## ReentrantLock 与 synchronized

1. ReentrantLock 通过方法 lock() 与 unlock() 来进行加锁与解锁操作，与`synchronized 会被 JVM 自动解锁机制不同，ReentrantLock 加锁后需要手动进行解锁`。为了避免程序出现异常而无法正常解锁的情况，使用 ReentrantLock 必须在 finally 控制块中进行解锁操作。
2. ReentrantLock 相比 synchronized 的优势是`可中断、公平锁、多个锁`。



## 代码演示

### 等待/通知模型

``` java
public class MyService {
	private final Lock lock = new ReentrantLock();

	private final Condition conditionA = lock.newCondition();
	private final Condition conditionB = lock.newCondition();

	public void awaitA() {
		lock.lock();
		try {
			System.out.println(Thread.currentThread().getName() + " begin awaitA:" + System.currentTimeMillis());
			// 等待被通知
			conditionA.await();
			System.out.println(Thread.currentThread().getName() + " end awaitA:" + System.currentTimeMillis());
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}

	public void awaitB() {
		lock.lock();
		try {
			System.out.println(Thread.currentThread().getName() + " begin awaitB:" + System.currentTimeMillis());
			// 等待被通知
			conditionB.await();
			System.out.println(Thread.currentThread().getName() + " end awaitB:" + System.currentTimeMillis());
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}

	public void signalAllA() {
		lock.lock();
		try {
			System.out.println(Thread.currentThread().getName() + " signalAll_A: " + System.currentTimeMillis());
			// 唤醒所有绑定 conditionA 的线程，
			conditionA.signalAll();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}

	public void signalAllB() {
		lock.lock();
		try {
			System.out.println(Thread.currentThread().getName() + " signalAll_B: " + System.currentTimeMillis());
			// 唤醒所有绑定 conditionB 的线程，
			conditionB.signalAll();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}
}

class Start {
	public static void main(String[] args) throws InterruptedException {
		ThreadPoolExecutor executor = new ThreadPoolExecutor(10, 10, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>(), Executors.defaultThreadFactory());
		MyService service = new MyService();
		executor.execute(service::awaitA);
		executor.execute(service::awaitB);

		Thread.sleep(2000);
		// 通知A
		service.signalAllA();

		Thread.sleep(2000);
		// 通知B
		service.signalAllB();
	}
}

```



### 生产者与消费者模型

``` java
public class ProviderAndConsumer {
	private final Lock lock = new ReentrantLock();

	private final Condition providerCondition = lock.newCondition();
	private final Condition consumerCondition = lock.newCondition();

	private final LinkedList<Integer> payloadList = new LinkedList<>();

	public void consumerAction() {
		lock.lock();
		try {
			while (true) {
				if (payloadList.size() == 0) {
					System.out.println("consumer spending over，signal provider...");
					providerCondition.signal();
					consumerCondition.await();
				}
				Thread.sleep(1000);
				System.out.println("consumer spending number ：" + payloadList.poll() + "...");
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}

	public void providerAction() {
		lock.lock();
		try {
			while (true) {
				if (payloadList.size() == 10) {
					System.out.println("provider production over，signal consumer...");
					consumerCondition.signal();
					providerCondition.await();
				}
				int number = RandomUtil.randomInt(10);
				System.out.println("provider production number ：" + number + "...");
				payloadList.push(number);
				Thread.sleep(1000);
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		} finally {
			lock.unlock();
		}
	}

}

class StartMain {
	public static void main(String[] args) throws InterruptedException {
		ThreadPoolExecutor executor = new ThreadPoolExecutor(10, 10, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>(), Executors.defaultThreadFactory());
		ProviderAndConsumer service = new ProviderAndConsumer();
		executor.execute(service::consumerAction);
		executor.execute(service::providerAction);
	}
}
```



## Condition 类和 Object 类锁方法区别

1. Condition 类的 await 方法和 Object 类的 wait 方法等效
2. Condition 类的 signal 方法和 Object 类的 notify 方法等效
3. Condition 类的 signalAll 方法和 Object 类的 notifyAll 方法有效
4. ReentratLock 类可以唤醒指定条件的线程，而 Object 的唤醒是随机的



## tryLock、lock、lockInterruptibly 的区别

1. tryLock 能获得锁就返回 true，不能就立即返回 false，tryLock(long timeout, TimeUnit unit)，可以增加时间限制，如果超过该时间段还没有获得锁，就返回 false；
2. lock 能获得锁就返回 true，不能得话一直等待获得锁；
3. lock 和 lockInterruptibly，如果两个线程分别执行这两个方法，但此时`中断这两个线程，lock 不会抛出异常，而 lockInterruptibly 会抛出异常`。

















