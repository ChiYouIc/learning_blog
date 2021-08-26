---
title: 线程创建方式
sidebar: auto
date: 2021-06-08
categories:
 - 多线程
 - Java
tags:
 - Thread
---

## 继承 Thread 类

Thread 类本质上是实现了 Runnable 接口的一个实例，代表一个线程的实例。启动线程的唯一方法就是通过 Thread 的 start()  方法。**start() 方法是一个 native 方法，**它将启动一个新的线程，并执行 run() 方法。

``` java
/**
 * 继承 Thread ，重写 run() 方法，其实 Thread 实现了接口 Runnable
 */
public class ThreadDemo01 extends Thread {
	// 通过自定义线程中断标志去停止线程
	private boolean interrupt = false;

	@Override
	public void run() {
		try {
			int i = 0;
			do {
				i++;
				Thread.sleep(1000);
				System.out.println(Thread.currentThread().getName() + ": " + i);
				if (interrupt) {
					System.out.println(Thread.currentThread().getName() + "被主动中断停止...");
				}
			} while (!interrupt);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

	public void interruptThread() {
		this.interrupt = true;
	}
}
```



## 实现 Runnable 接口

由于 Java 不支持多继承，当我们不能去继承 Thread 的时候，可以通过实现接口 Runnable ，并重写 run() 方法，然后将改类型实例化后，传入 Thread 对象中，通过调用 Thread 的 start() 执行多线程任务。

``` java
/**
 * 通过实现接口 Runnable，将需要执行的任务内容编写在 run() 方法内
 */
public class RunnableDemo01 implements Runnable {
	// 通过自定义线程中断标志去停止线程
	private boolean interrupt = false;

	@Override
	public void run() {
		try {
			int i = 0;
			do {
				i++;
				Thread.sleep(500);
				System.out.println(Thread.currentThread().getName() + ": " + i);
				if (interrupt) {
					System.out.println(Thread.currentThread().getName() + "被主动中断停止...");
				}
			} while (!interrupt);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

	public void interruptThread() {
		this.interrupt = true;
	}
}
```

``` java
// Thread 有参构造方法
public Thread(Runnable target) {
    init(null, target, "Thread-" + nextThreadNum(), 0);
}

// 在 Thread 的 run() 方法中，当我们传入自定义的 Runnable 接口的实现，那么默认就是执行自定义的 Runnable 接口的 run() 方法
@Override
public void run() {
    if (target != null) {
        target.run();
    }
}
```



## ExecutorSevice、Future\<Class>、Callable\<Class> 创建有返回值的线程

有返回值的任务需要实现 Callable 接口，类似的，无返回值的任务需要实现 Runable 接口。使用线程接口ExecutorService 的 submit() 方法执行 Callable 任务后，可以获取一个 Future 对象，在该对象上调用 get 就可以获取到 Callable 任务返回的 Object 了。

``` java
/**
 * 实现 Callable<T> 接口，结合 Future 就可以实现有返回值的线程
 */
public class CallableDemo01 implements Callable<String> {

	private final Integer sleepTime;

	public CallableDemo01(Integer sleepTime) {
		this.sleepTime = sleepTime;
	}

	@Override
	public String call() throws Exception {
		int i = 0;
		do {
			i++;
			Thread.sleep(sleepTime);
			System.out.println(Thread.currentThread().getName() + ":" + i);
		} while (i < 10);
		return Thread.currentThread().getName() + "线程结束...";
	}
}
```

``` java
public class ThreadCreateDemo01 {
	public static void main(String[] args) throws InterruptedException, ExecutionException {

		// 线程池
		int poolSize = 10;
		ExecutorService executorService = Executors.newFixedThreadPool(poolSize);

		List<Future<String>> list = new ArrayList<>();
		for (int i = 1; i <= poolSize; i++) {
			// 创建 Callable 对象
			CallableDemo01 callableDemo01 = new CallableDemo01(i * 1000);
			// 将 Callable 对象作为任务提交到线程池执行，并获取到对应的 Future 对象，
			// 可以从 Future 的 get() 方法获取到线程的返回值，也就是 Callable 中 call() 方法的返回值
			Future<String> future = executorService.submit(callableDemo01);
			list.add(future);
		}
		// 停止线程池
		executorService.shutdown();
		// 打印收集到的线程返回值，Callable 实现的 call() 未执行完时，get() 方法会阻塞
		for (Future<String> future : list) {
			System.out.println(future.get());
		}

	}
}
```



## ExecutorService 执行线程

使用 Thread 对象显示的创建和执行线程是不明智的做法，因为线程的创建、执行和销毁都是非常消耗系统资源的。在使用多线程时，建议使用线程池去创建执行线程，由线程池去管理我们的线程任务，合理使用系统资源。

``` java
public class ThreadCreateDemo01 {
	public static void main(String[] args) throws InterruptedException, ExecutionException {

		RunnableDemo01 demo011 = new RunnableDemo01();
		// 线程池
		int poolSize = 10;
		ExecutorService executorService = Executors.newFixedThreadPool(poolSize);
		executorService.execute(demo011);
    }
}
```



