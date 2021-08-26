---
title: 线程池
sidebar: auto
date: 2021-06-19
categories:
 - 多线程
 - Java
tags:
 - Thread
---

## 概念

> * 简单理解就是一个管理线程的池子
> * 它帮我们管理线程，避免增加创建线程和销毁线程的资源耗损。因为线程本身也是一个对象，创建需要经过类加载，回收也要经过GC回收
> * 它提高了响应速度。如果任务到达了，相对于在线程池中获取线程，重新创建执行要慢很多
> * 重复利用。线程用完，再返回线程池，可以达到重复利用的效果，节约资源


## 创建线程池

线程池可以通过ThreadPoolExecutor来创建，看下构造函数:
``` java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
    if (corePoolSize < 0 ||
        maximumPoolSize <= 0 ||
        maximumPoolSize < corePoolSize ||
        keepAliveTime < 0)
        throw new IllegalArgumentException();
    if (workQueue == null || threadFactory == null || handler == null) throw new NullPointerException();
    this.acc = System.getSecurityManager() == null ? null : AccessController.getContext();
    this.corePoolSize = corePoolSize;
    this.maximumPoolSize = maximumPoolSize;
    this.workQueue = workQueue;
    this.keepAliveTime = unit.toNanos(keepAliveTime);
    this.threadFactory = threadFactory;
    this.handler = handler;
}
```


**参数说明**
> * corePoolSize：核心线程的数量
> * maximumPoolSize：线程池中最大的线程数量
> * keepAliveTime：线程池中非核心线程空闲的存活时间
> * TimeUnit：线程空闲存活时间的时间单位
> * workQueue：存放任务的阻塞队列
> * threadFactory：用于创建核心线程的线程工厂，可以给创建的线程自定义名字，方便查日志
> * handle：线程池的饱和策略（拒绝策略），有四种类型，默认使用 AbortPolicy。


## 线程池的执行流程
<img :src="$withBase('/img/java/thread/线程池的执行流程.png')" alt="线程池的执行流程">


描述：
> * 提交一个任务，如果线程池里存活的可信线程数 < corePoolSize，线程池会创建一个核心线程取执行任务。
> * 如果核心线程池核心线程数已满，即线程数已经等于 corePoolSize，会把任务先放进阻塞队列中。
> * 如果线程池里核心线程数都忙着干其他事，并且任务队列也满了，线程池就会执行拒绝策略，判断线程数是否达到了最大线程数 maximumPoolSize，如果没达到，创建一个非核心线程执行任务，否则就执行拒绝策略。


## 线程池执行线程方法   public void execute(Runnable command)
``` java
/**
 * Executes the given task sometime in the future.  The task
 * may execute in a new thread or in an existing pooled thread.
 *
 * If the task cannot be submitted for execution, either because this
 * executor has been shutdown or because its capacity has been reached,
 * the task is handled by the current {@code RejectedExecutionHandler}.
 *
 * @param command the task to execute
 * @throws RejectedExecutionException at discretion of
 *         {@code RejectedExecutionHandler}, if the task
 *         cannot be accepted for execution
 * @throws NullPointerException if {@code command} is null
 */
public void execute(Runnable command) {
    if (command == null)
        throw new NullPointerException();
    /*
     * Proceed in 3 steps:
     *
     * 1. If fewer than corePoolSize threads are running, try to
     * start a new thread with the given command as its first
     * task.  The call to addWorker atomically checks runState and
     * workerCount, and so prevents false alarms that would add
     * threads when it shouldn't, by returning false.
     *
     * 2. If a task can be successfully queued, then we still need
     * to double-check whether we should have added a thread
     * (because existing ones died since last checking) or that
     * the pool shut down since entry into this method. So we
     * recheck state and if necessary roll back the enqueuing if
     * stopped, or start a new thread if there are none.
     *
     * 3. If we cannot queue task, then we try to add a new
     * thread.  If it fails, we know we are shut down or saturated
     * and so reject the task.
     */
    int c = ctl.get();
    if (workerCountOf(c) < corePoolSize) {
        if (addWorker(command, true))
            return;
        c = ctl.get();
    }
    if (isRunning(c) && workQueue.offer(command)) {
        int recheck = ctl.get();
        if (! isRunning(recheck) && remove(command))
            reject(command);
        else if (workerCountOf(recheck) == 0)
            addWorker(null, false);
    }
    else if (!addWorker(command, false))
        reject(command);
}
```


## 四种拒绝策略
### AbortPolicy：抛出一个异常，默认的拒绝策略
``` java
/**
 * A handler for rejected tasks that throws a
 * {@code RejectedExecutionException}.
 */
public static class AbortPolicy implements RejectedExecutionHandler {
    /**
     * Creates an {@code AbortPolicy}.
     */
    public AbortPolicy() { }

    /**
     * Always throws RejectedExecutionException.
     *
     * @param r the runnable task requested to be executed
     * @param e the executor attempting to execute this task
     * @throws RejectedExecutionException always
     */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        throw new RejectedExecutionException("Task " + r.toString() +
                                             " rejected from " +
                                             e.toString());
    }
}
```


### DiscardPolicy：直接丢弃任务
``` java
/**
 * A handler for rejected tasks that silently discards the
 * rejected task.
 */
public static class DiscardPolicy implements RejectedExecutionHandler {
    /**
     * Creates a {@code DiscardPolicy}.
     */
    public DiscardPolicy() { }

    /**
     * Does nothing, which has the effect of discarding task r.
     *
     * @param r the runnable task requested to be executed
     * @param e the executor attempting to execute this task
     */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
    }
}
```
### DiscardOldestPolicy：丢弃队列中最老的任务，将当前这个任务继续提交给线程池；
``` java
/**
 * A handler for rejected tasks that discards the oldest unhandled
 * request and then retries {@code execute}, unless the executor
 * is shut down, in which case the task is discarded.
 */
public static class DiscardOldestPolicy implements RejectedExecutionHandler {
    /**
     * Creates a {@code DiscardOldestPolicy} for the given executor.
     */
    public DiscardOldestPolicy() { }

    /**
     * Obtains and ignores the next task that the executor
     * would otherwise execute, if one is immediately available,
     * and then retries execution of task r, unless the executor
     * is shut down, in which case task r is instead discarded.
     *
     * @param r the runnable task requested to be executed
     * @param e the executor attempting to execute this task
     */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        if (!e.isShutdown()) {
            e.getQueue().poll();
            e.execute(r);
        }
    }
}
```


### CallerRunsPolicy：交给线程池调用所在的线程进行处理。
``` java
/**
 * A handler for rejected tasks that runs the rejected task
 * directly in the calling thread of the {@code execute} method,
 * unless the executor has been shut down, in which case the task
 * is discarded.
 */
public static class CallerRunsPolicy implements RejectedExecutionHandler {
    /**
     * Creates a {@code CallerRunsPolicy}.
     */
    public CallerRunsPolicy() { }

    /**
     * Executes task r in the caller's thread, unless the executor
     * has been shut down, in which case the task is discarded.
     *
     * @param r the runnable task requested to be executed
     * @param e the executor attempting to execute this task
     */
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        if (!e.isShutdown()) {
            r.run();
        }
    }
}
```
## 线程池的工作队列
### ArrayBlockingQueue
有界队列，是一个用数组实现的有界阻塞队列，按 FIFO 排序。


### LinkedBlockingQueue
基于链表实现的阻塞队列，按 FIFO 排序任务，容量可以设置，不设置的话将是一个无边界的阻塞队列（最大长度是 Integer.MAX_VALUE），吞吐量通常要高于 ArrayBlockingQueue；newFixedThreadPool 线程池使用的就是这个队列。


### DelayQueue
DelayQueue 是一个任务定时周期延迟执行的队列。根据指定的执行从小到大排序，否则根据插入到队列的先后排序。newScheduledThreadPool 线程池使用了这个队列。


### PriorityBlockingQueue
优先级队列是具有优先级的无界阻塞队列。


### SynchronousQueue
同步队列，一个不存储元素的阻塞队列，每个插入操作都必须等待另一个线程调用移除操作，否则插入操作将一直处于阻塞状态。吞吐量通常要高于 LinkedBlockingQueue，newCachedThreadPool使用了这个队列。


## 几种常用的线程池
* newFixedThreadPool（固定数目线程的线程池，内部使用 LinkedBlockingQueue）
* newCachedThreadPool（可缓存线程的线程池，内部使用 SynchronousBlockingQueue）
* newSingleThreadPool（单线程的线程池，内部使用LinkedBlobkingQueue）
* newScheduledThreadPool（定时即周期性执行的线程池，内部使用DelayQueue）


### newFixedThreadPool
``` java
/**
 * Creates a thread pool that reuses a fixed number of threads
 * operating off a shared unbounded queue.  At any point, at most
 * {@code nThreads} threads will be active processing tasks.
 * If additional tasks are submitted when all threads are active,
 * they will wait in the queue until a thread is available.
 * If any thread terminates due to a failure during execution
 * prior to shutdown, a new one will take its place if needed to
 * execute subsequent tasks.  The threads in the pool will exist
 * until it is explicitly {@link ExecutorService#shutdown shutdown}.
 *
 * @param nThreads the number of threads in the pool
 * @return the newly created thread pool
 * @throws IllegalArgumentException if {@code nThreads <= 0}
 */
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                  0L, TimeUnit.MILLISECONDS,
                                  new LinkedBlockingQueue<Runnable>());
}
```
**线程池特点**
> * 核心线程数量 = 最大线程数量
> * 没有所谓的非空闲时间，即 keepAliveTime = 0
> * 阻塞队列为无界队列 LinkedBlockingQueue 提交任务的执行流程参照 ThreadPoolExecutor 及 newFixedThreadPool自行得出。


### newCacheThreadPool
``` java
/**
 * Creates a thread pool that creates new threads as needed, but
 * will reuse previously constructed threads when they are
 * available.  These pools will typically improve the performance
 * of programs that execute many short-lived asynchronous tasks.
 * Calls to {@code execute} will reuse previously constructed
 * threads if available. If no existing thread is available, a new
 * thread will be created and added to the pool. Threads that have
 * not been used for sixty seconds are terminated and removed from
 * the cache. Thus, a pool that remains idle for long enough will
 * not consume any resources. Note that pools with similar
 * properties but different details (for example, timeout parameters)
 * may be created using {@link ThreadPoolExecutor} constructors.
 *
 * @return the newly created thread pool
 */
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```
**线程池特点**
> * 核心线程数为 0，最大线程数为 Integer.MAX_VALUE
> * 非核心线程空闲的存活时间为 60s
> * 阻塞队列是 SynchronousQueue
执行流程参照 ThreadPoolExecutor 和 线程池特点自行得出。这个线程池有一个问题：当提交任务的数量大于处理任务的数量时，每次提交一个任务必然会创建一个非核心线程，极端情况下会创建过多的线程（最大 Integer.MAX_VALUE），耗尽 CPU 和内存资源。当然如果没有任务了，这些空闲的非核心线程在存活 60s 后被回收。使用场景：用于并发量大执行大量短期的小任务。


### newSingleThreadExecuotr
``` java
/**
 * Creates a single-threaded executor that can schedule commands
 * to run after a given delay, or to execute periodically.  (Note
 * however that if this single thread terminates due to a failure
 * during execution prior to shutdown, a new one will take its
 * place if needed to execute subsequent tasks.)  Tasks are
 * guaranteed to execute sequentially, and no more than one task
 * will be active at any given time. Unlike the otherwise
 * equivalent {@code newScheduledThreadPool(1, threadFactory)}
 * the returned executor is guaranteed not to be reconfigurable to
 * use additional threads.
 * @param threadFactory the factory to use when creating new
 * threads
 * @return a newly created scheduled executor
 * @throws NullPointerException if threadFactory is null
 */
public static ScheduledExecutorService newSingleThreadScheduledExecutor(ThreadFactory threadFactory) {
    return new DelegatedScheduledExecutorService
        (new ScheduledThreadPoolExecutor(1, threadFactory));
}
```
**线程池特点**
> * 核心线程数=最大线程数=0，也就是这个线程池从始至终只有一个活着的线程。
> * keppAliveTime = 0，这个参数无效。
> * 阻塞队列是无界的 LinkedBlockingQueue
提交任务的执行流程可自行得出。其实这个线程池里干活的只有一个，不管你往里塞多少任务，都是它按部就班的从队列里获取任务执行，适合于串行执行任务的场景，一个任务接一个任务的执行。


### newScheduledThreadPool
``` java
/**
 * Creates a new ScheduledThreadPoolExecutor with the given
 * initial parameters.
 *
 * @param corePoolSize the number of threads to keep in the pool, even
 *        if they are idle, unless {@code allowCoreThreadTimeOut} is set
 * @param threadFactory the factory to use when the executor
 *        creates a new thread
 * @param handler the handler to use when execution is blocked
 *        because the thread bounds and queue capacities are reached
 * @throws IllegalArgumentException if {@code corePoolSize < 0}
 * @throws NullPointerException if {@code threadFactory} or
 *         {@code handler} is null
 */
public ScheduledThreadPoolExecutor(int corePoolSize,
                                   ThreadFactory threadFactory,
                                   RejectedExecutionHandler handler) {
    super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
          new DelayedWorkQueue(), threadFactory, handler);
}
```
**线程池特点**
> * 核心线程数自定义，最大线程数为 Integer.MAX_VALUE
> * keepAliveTime = 0
> * 阻塞队列为 DelayedWorkQueue 这里 scheduleAtFixedRate 和 scheduleWithFixedDelay 两个方法的区别如下：
>     * scheduleAtFixedRate：按某种速率周期性的执行，不管上一个任务有没有执行结束。也就是说从上一个任务开始执行算起 + 一个周期作为下一个任务的开始执行时间。

>     * scheduleWithFixedDelay：在某个延迟后执行，是要等上一个任务执行结束算起的。也就是说从上一个任务执行结束时间 + 一个周期作为下一个任务的开始执行时间。

使用场景：周期性的执行任务的场景，做一些简单的定时调度。


## 线程池状态
线程池有几种状态：RUNNING、SHUTDOWN、STOP、TIDYING、TERMINATED
``` java
// 线程池状态
// runState is stored in the high-order bits
private static final int RUNNING    = -1 << COUNT_BITS;
private static final int SHUTDOWN   =  0 << COUNT_BITS;
private static final int STOP       =  1 << COUNT_BITS;
private static final int TIDYING    =  2 << COUNT_BITS;
private static final int TERMINATED =  3 << COUNT_BITS;
```

<img :src="$withBase('/img/java/thread/线程池状态.png')" alt="线程池状态">

**RUNNING**
> * 该状态的线程池会接受新任务，并处理阻塞队列中的任务
> * 调用 shutdown() 方法可以切换到 SHUTDOWN 状态
> * 调用 shutdownNow() 方法可以切换到 STOP 状态


**SHUTDOWN**
> * 该状态的线程池不会接受新任务，但会处理阻塞队列中的任务
> * 队列为空，并且线程池中执行的任务也为空，进入 TIDYING 状态


**STOP**
> * 该状态的线程池不会接受新任务，也不会处理阻塞队列中的任务，而且会终端正在执行中的任务
> * 线程池中执行的任务一旦变为空，进入 TIDYING 状态


**TIDYING**
> * 该状态表明所有的任务已经运行终止，记录的任务数量为 0
> * terminated() 执行完毕，进入 TERMINATED 状态


**TERMINATED**
该状态表明线程池彻底终止或死亡
