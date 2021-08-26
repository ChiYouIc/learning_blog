---
title: 线程池原理
sidebar: auto
date: 2021-06-20
categories:
 - 多线程
 - Java
tags:
 - Thread
---

线程池做的工作主要是控制运行的线程的数量，处理过程中将任务放入队列，然后在线程创建后启动这些任务，
如果线程数量超过了线程池的最大容量，那么超出数量的线程将会进行排队等待，等待其它线程执行完毕，再从
任务队列中取出任务来执行。它的主要特定是：`线程服用、控制最大并发数和管理线程`。

## 线程复用

每一个 Thread 的类都有一个 start 方法。当调用 start 启动线程时 Java 虚拟机会调用该类的 run 方法。那么
该类的 run() 方法中就是调用 Runnable 对象的 run() 方法。`如果继承重写 Thread 类，在其 start 方法中添加不断循环调用传递过来的 Runnable 对象`。
这就是线程池的实现原理，`循环方法中不断获取 Runnable 是用 Queue 实现的`，在获取下一个 Runnable 之前可以是阻塞的。

## 线程池的组成

一般的线程池主要分为以下 4 个组成部分：

1. 线程池管理器：用于创建并管理线程池

2. 工作线程：线程池中的线程

3. 任务接口：每个任务必须实现的接口，用于工作线程调度其运行

4. 任务队列：用于存放待处理的任务，提供一种缓冲机制

Java 中的线程池是通过 Executor 架构实现的，该架构中用到了 `Executor`、`Executors`、`ExecutorService`、`ThreadPoolExecutor`、`Callable` 和 `Future`、`FutureTask` 这些类。

<img :src="$withBase('/img/java/thread/线程池UML.png')" alt="线程池UML">

ThreadPoolExecutor 的构造方法如下：
``` java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
        ... ...
    }
```
::: tip 参数详解
* corePoolSize：指定了线程池中的线程数量；

* maximumPoolSize：指定了线程池中的最大线程数量；

* keepAliveTime：当前线程池数量超过 corePoolSize 时，多余的空闲线程的存活时间，即多次时间内会被销毁；

* unit： keepAliveTime 的单位；

* workQueue：任务队列，被提交但尚未被执行的任务；

* threadFactory：线程工厂，用于创建线程，一般用默认的即可；

* handler：拒绝策略，当任务太多来不及处理，如何拒绝任务。
:::

## 拒绝策略

当线程池中的线程已经到达了阈值，无法继续为新任务服务，同时，等待队列也排满了，再也塞不下新任务了。这时就需要使用拒绝策略机制来处理这个问题。

::: tip JDK 内置的拒绝策略如下：
* AbortPolicy：直接抛出异常，阻止系统正常运行；

* CallerRunsPolicy：只要线程池未关闭，该策略直接在调用者线程中，运行当前被丢弃的任务。显然这样做不会真的丢弃任务，但极有可能导致任务提交线程的性能会急剧下降；

* DiscardOldestPolicy：丢弃最老的一个请求，也就是即将被执行的一个任务，并尝试再次提交当前任务；

* DiscardPolicy：该策略默默地丢弃无法处理的任务，不予任何处理。如果任务丢失，这是最好的一种方案。

:::

上述的内置拒绝策略均实现了 `RejectedExecutionHandler` 接口，若已上策略仍然无法满足实际需要，完全可以自己扩展 `RejectedExecutionHandler` 接口，该接口的定义如下：

``` java
public interface RejectedExecutionHandler {
    void rejectedExecution(Runnable r, ThreadPoolExecutor executor);
}
```

## 线程池工作过程

* 线程池刚创建时，里面没有一个线程。任务队列是最为参数传进来的。不过，就算队列里面有任务，线程池也不会马上执行它们。

* 当调用 execute() 方法添加一个任务时，线程池会做如下判断：
  * 如果正在运行的线程数量小于 `corePoolSize`，那么马上创建线程运行这个任务；

  * 如果正在运行的线程数量大于或等于 `corePoolSize`，那么将这个任务放入对待队列；

  * 如果等待队列已满，而且正在运行的线程数量小于 `maximumPoolSize`，那么还是要创建非核心线程立刻运行这个任务；

  * 如果等待队列已满，而且正在运行的线程数量大于或等于 `maximumPoolSize`，那么线程池会抛出异常 `RejectExecutionException`。

* 当一个线程完成任务时，它会从队列中取下一个任务来执行。

* 当一个线程无事可做，超过一定的时间（`keepAliveTime`）后，线程池会判断，如果当前运行的线程数大于 `corePoolSize`，那么这个线程就被停掉。
所以在线程池的所有任务完成之后，它最终会收缩到 `corePoolSize` 大小。

### 示意图

<img :src="$withBase('/img/java/thread/线程池工作流程.png')" alt="线程池工作流程">
