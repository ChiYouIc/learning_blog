---
title: DelayQueue（延迟队列）
sidebar: auto
date: 2022-06-16
categories:
 - container 容器
tags:
 - Collections
---

## 介绍

DelayQueue 是一个无边界的 BlockQueue 对象，根据其名称，就知道它是一个延迟等待队列，它只能存储实现了 Delayed 接口的对象。在存入元素时，会进行队列的排序，将延迟时间最短的元素放置到表头，延迟时间最长的元素放置到表位；取出元素时，会判断当前队列头部元素的延迟时间是否到达，如果没有则会陷入等待，直到元素的延迟时间到达。注意：DelayQueue 不能存放 null 元素。

## Delayed 接口定义

```java
public interface Delayed extends Comparable<Delayed> {

    /**
     * 给定一个时间单位，返回此对象在该单位时间上的剩余延迟时间
     * 
     * @param unit 时间单位
     * @return 剩余延迟时间; 如果返回 0 或者 负值则表示延迟时间已经达到
     */
    long getDelay(TimeUnit unit);
}
```

Delayed 接口中声明一个 `long getDelay(TimeUnit unit)` 方法，并实现了 Comparable 接口。实现 Comparable 接口是为了自定义元素在 DelayQueue 中的排序规则；定义 getDelay 方法用于获取延迟时间，通常与 Comparable 接口中的 `comparaTo` 结合使用。

## DelayQueue 源码解析

### 全局参数

```java
/**
 * 保证其在多线程中可用
 */
    private final transient ReentrantLock lock = new ReentrantLock();

/**
 * 元素容器，PriorityQueue 是一个线程不安全的优先队列，这也解释了为什么要单独引入对象锁
 */
    private final PriorityQueue<E> q = new PriorityQueue<E>();

    /**
 * 线程指定等待队列头部的元素。 Leader-Follower 模式的这种变体 (http://www.cs.wustl.edu/~schmidt/POSA/POSA2/) 用于最大限度地
 * 减少不必要的定时等待。当一个线程成为领导者时，它只等待下一个延迟过去，但其他线程无限期地等待。领导者线程必须在从 take() 或 poll
 * (...) 返回之前向其他线程发出信号，除非其他一些线程在此期间成为领导者。每当队列的头部被一个具有更早过期时间​​的元素替换时，leader 
 * 字段通过被重置为 null 来失效，并且一些等待线程（但不一定是当前的 le​​ader）被发出信号。所以等待线程必须准备好在等待时获取和失去领
 * 导权。
     */
    private Thread leader = null;

    /**
 * 当队列头部有新元素可用或新线程可能需要成为领导者时发出条件信号。
 */
private final Condition available = lock.newCondition();    
```

### 新增

DelayQueue 中新增元素方法有 `add(e)`、`put(e)`、`offer(e)` 前两者内部都是调用的 `offer` 方法，包括另外一个 `offer(e, timeout, unit)` 方法。所以这里只解析 offer 方法：

```java
    /**
     * Inserts the specified element into this delay queue.
     *
     * @param e the element to add
     * @return {@code true}
     * @throws NullPointerException if the specified element is null
     */
    public boolean offer(E e) {
        final ReentrantLock lock = this.lock;
        // 获取锁
        lock.lock();
        try {
            // 调用 PriorityQueue 对象的 offer 方法存储元素
            q.offer(e);
            // 如果当前插入元素到了队列头，那么当前线程需要放弃主导权，并唤醒其它等待线程
            // 这一点会在 take 方法中体现，take 方法在调用 q.peek() 为 null 时会进入等待
            if (q.peek() == e) {
                leader = null;
                available.signal();
            }
            return true;
        } finally {
            // 释放锁
            lock.unlock();
        }
    }
```

### 获取

#### peek()

```java
    /**
 * 返回队列头部元素，但不会删除元素，也不验证元素是否过期
     *
 * @return 返回队列头部元素，如果队列为空时，返回 null
     */
    public E peek() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return q.peek();
        } finally {
            lock.unlock();
        }
    }
```

#### poll()

```java
    /**
 * 检索并删除队列头部元素，如果队列没有元素或是元素未到达过期，则返回 null
     *
 * @return 返回队列头部元素，如果队列中没有元素或是没有元素达到过期，则返回 null
     */
    public E poll() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
        // 检索队列头部元素
            E first = q.peek();
        // 判断是否为空，是否达到过期要求
            if (first == null || first.getDelay(NANOSECONDS) > 0)
                return null;
            else
            // 返回并删除队列头部元素
                return q.poll();
        } finally {
            lock.unlock();
        }
    }
```

#### poll(timeout, unit)

这个 poll 方法，增加了两个参数，timeout 和 unit，其中 timeout 表示需要等待的时间数量，unit 是时间单位。它的功能是返回并删除队列头部元素，如果 timeout <= 0 ，直接取队头元素，如果为空，直接返回 null；当 timeout > 0 时，取对头元素，如果为空，则等待 nanos，进入下一次判断。

```java
    /**
     * 检索并删除此队列的头部，如有必要，等待直到此队列上有一个具有过期延迟的元素，或指定的等待时间过期。
     *
     * @return 此队列的头部，如果在具有过期延迟的元素变得可用之前经过了指定的等待时间，则返回 null
     * @throws InterruptedException {@inheritDoc}
     */
    public E poll(long timeout, TimeUnit unit) throws InterruptedException {
        // 将 timeout 转换为纳秒
        long nanos = unit.toNanos(timeout);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            for (;;) {
                // 获取队头元素
                E first = q.peek();
                // 如果 first 为 null，并且 timeout < 0，那么直接返回 null，否则等待 nanos 后，再次获取元素
                if (first == null) {
                    if (nanos <= 0)
                        return null;
                    else
                        // 等待 nanos ，如果此时是因为经过 nanos 纳秒之后被唤醒的，nanos 将被赋值为 0；然后再一次获取元素，
                        // 在下面代码中，nanos 会被判断是否为 0，即这里的重置就是为了避免陷入死循环
                        nanos = available.awaitNanos(nanos);
                } else {
                    // 获取元素剩余延迟时间
                    long delay = first.getDelay(NANOSECONDS);
                    // 小于或等于 0 说明延迟时间已到，直接返回
                    if (delay <= 0)
                        return q.poll();
                    // nanos 小于等于0，表示不需要再继续等待从头获取，直接返回 null
                    if (nanos <= 0)
                        return null;
                    // 取消与对头元素的应用关系
                    first = null; // don't retain ref while waiting
                    // 如果 delay > nanos 或者当前已经有其他的主导者，则先耗尽 nanos
                    // delay 是当前队头元素的延迟，不等待 delay 是因为队列的元素情况是随时变化的，
                    // nanos 纳秒之后队列的第一个元素可能就不是当前这个元素了
                    if (nanos < delay || leader != null)
                        nanos = available.awaitNanos(nanos);
                    else {
                        // 成为当前队列的主导者
                        Thread thisThread = Thread.currentThread();
                        leader = thisThread;
                        try {
                            long timeLeft = available.awaitNanos(delay);
                            // nanos = nanos - (delay - timeLeft)，其中 (delay - timeLeft) 表示的是此次等待消耗的时间
                            nanos -= delay - timeLeft;
                        } finally {
                            if (leader == thisThread)
                                leader = null;
                        }
                    }
                }
            }
        } finally {
            if (leader == null && q.peek() != null)
                available.signal();
            lock.unlock();
        }
    }
```

#### take

take 函数是取元素常用的方法，它返回并删除队头元素，如果元素为空则会陷入阻塞，直到被唤醒或中断；当元素的延迟未到时，也会陷入阻塞。

```java
    /**
     * 检索并移除此队列的头部，如有必要，等待直到此队列上有一个具有过期延迟的元素。
     *
     * @return 队列的头部元素
     * @throws InterruptedException {@inheritDoc}
     */
    public E take() throws InterruptedException {
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            for (;;) {
                E first = q.peek();
                // 如果队列头部元素为空，则阻塞，直到有新元素到来被唤醒
                if (first == null)
                    available.await();
                else {
                    // 获取元素延迟
                    long delay = first.getDelay(NANOSECONDS);
                    if (delay <= 0)
                        return q.poll();
                    first = null; // don't retain ref while waiting
                    // 当有其他主导者时，需要放弃操作，进行阻塞
                    if (leader != null)
                        available.await();
                    else {
                        // 获取主导者位置，并等待 delay 耗尽元素的延迟
                        Thread thisThread = Thread.currentThread();
                        leader = thisThread;
                        try {
                            available.awaitNanos(delay);
                        } finally {
                            // 放弃自己的主导者位置
                            if (leader == thisThread)
                                leader = null;
                        }
                    }
                }
            }
        } finally {
            if (leader == null && q.peek() != null)
                available.signal();
            lock.unlock();
        }
    }
```

### 删除

#### remove

```java
     /**
 * 从此队列中删除指定元素的单个实例（如果存在），无论它是否已过期
     */
    public boolean remove(Object o) {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return q.remove(o);
        } finally {
            lock.unlock();
        }
    }
```

除了 remove 方法以外，像 poll、take 这类方法也是具有删除效果的。

### 检查

DelayQueue 中的 `peek()` 方法可用于检查队列是否存在元素，即检查队列头部，它与 poll、take 不一样，它不将元素从队列中抽取出来。

## DelayQueue 使用场景

DelayQueue 主要应用于一些延迟触发场景，例如：

1. 电商订单业务：用户下单后，如果 30 分钟内未付款，就自动取消订单；
2. 关闭服务器空闲连接：在服务器中，有很多的用户连接，当某些连接空闲一段时间后需要关闭；
3. 缓存：缓存元素过期，需要从中移除；
4. 任务超时处理：在网络协议滑动窗口请求应答式交互时，处理超时未响应的请求。

## 案例

### 基本使用案例

```java
public class DelayedMessage implements Delayed {

    private String body;

    private long fireTime;

    public DelayedMessage(String body, long delayTime) {
        this.body = body;
        // 触发时间
        this.fireTime = delayTime + System.currentTimeMillis();
    }

    @Override
    public long getDelay(TimeUnit unit) {
        // 当前剩余延迟时间
        return unit.convert(this.fireTime - System.currentTimeMillis(), TimeUnit.MILLISECONDS);
    }

    @Override
    public int compareTo(Delayed o) {
        return (int) (this.getDelay(TimeUnit.MILLISECONDS) - o.getDelay(TimeUnit.MILLISECONDS));
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public long getFireTime() {
        return fireTime;
    }

    public void setFireTime(long fireTime) {
        this.fireTime = fireTime;
    }

    public static void main(String[] args)  {

            BlockingQueue<DelayedMessage> delayeds = new DelayQueue<>();

            DelayedMessage message1 = new DelayedMessage("1", 10000 * 1);
            DelayedMessage message2 = new DelayedMessage("2", 11000 * 1);
            DelayedMessage message3 = new DelayedMessage("3", 12000 * 1);
            DelayedMessage message4 = new DelayedMessage("4", 13000 * 1);
            DelayedMessage message5 = new DelayedMessage("5", 14000 * 1);

            delayeds.put(message1);
            delayeds.put(message2);
            delayeds.put(message3);
            delayeds.put(message4);
            delayeds.put(message5);

            while (delayeds.size() > 0) {
                DelayedMessage take = delayeds.take();
                System.out.println(take.getBody());
            }
    }
}
```

### 多消费者定时调度任务

#### 延迟任务对象

```java
public class DelayTask implements Delayed {

    /**
     * 所有的任务从一个固定时间点开始延迟
     */
    private static long currentTime = System.currentTimeMillis();

    /**
     * 任务名称
     */
    protected final String taskName;

    /**
     * timeCost 表示处理此任务需要的时间，本示例中为 2s
     */
    protected final int timeCost;

    /**
     * 理论上被调度的时间点
     */
    protected final long scheduleTime;

    /**
     * 任务数量
     */
    protected static final AtomicInteger taskCount = new AtomicInteger(0);

    public DelayTask(String taskName, int timeCost) {
        this.taskName = taskName;
        this.timeCost = timeCost;
        taskCount.incrementAndGet();
        currentTime += 1000 + (long) (Math.random() * 1000);
        scheduleTime = currentTime;
    }

    @Override
    public int compareTo(Delayed o) {
        return (int) (this.scheduleTime - ((DelayTask) o).scheduleTime);
    }

    @Override
    public long getDelay(TimeUnit unit) {
        long expirationTime = scheduleTime - System.currentTimeMillis();
        return unit.convert(expirationTime, TimeUnit.MILLISECONDS);
    }

    public void execTask() {
        long startTime = System.currentTimeMillis();
        System.out.println("Task " + taskName + ": schedule start time=" + scheduleTime + ",real start time=" + startTime + ",delay=" + (startTime - scheduleTime));
        try {
            // 模拟这个任务的处理过程
            Thread.sleep(timeCost);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

#### 延迟任务消费者线程

```java
public class DelayTaskConsumer implements Runnable {
    private final BlockingQueue<DelayTask> queue;

    public DelayTaskConsumer(BlockingQueue<DelayTask> queue) {
        this.queue = queue;
    }

    @Override
    public void run() {
        DelayTask task = null;
        try {
            while (true) {
                task = queue.take();
                task.execTask();
                DelayTask.taskCount.decrementAndGet();
            }
        } catch (InterruptedException e) {
            System.out.println(Thread.currentThread().getName() + " finished");
        }
    }
}
```

#### 测试

```java
public class DelayQueueTest {
    public static void main(String[] args) {

        BlockingQueue<DelayTask> queue = new DelayQueue<>();

        for (int i = 0; i < 10; i++) {
            try {
                queue.put(new DelayTask("work " + i, 2000));
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        ThreadGroup g = new ThreadGroup("Consumers");

        // 模拟消费者个数
        for (int i = 0; i < 3; i++) {
            new Thread(g, new DelayTaskConsumer(queue)).start();
        }

        while (DelayTask.taskCount.get() > 0) {
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        g.interrupt();
        System.out.println("Main thread finished");
    }
}
```

这个多消费者定时调度模型里面，存在一个任务滞后执行问题；当该用例中，只有一个消费者线程时，定时任务执行的会发生滞后，而且越往后滞后性越大，这与任务的延迟等待时间和执行过程所需时间相关；存在某个任务在执行过程中，队列中的其它任务就已经到期的现象，所以单个消费者模型中，这种滞后现象很容易发生。如果我们引用多个消费者进入之后，会发现滞后性现象得到减缓，但不会完全消除；但多线程也存在一个线程数量配置问题，如果线程的数量过多，引发的线程上下文切换频繁，适得其反。所以在使用多消费者定时调度任务模型中，我们需要考察任务对 `滞后性的敏感程度`、`任务执行所需时间` 和 `服务器性能`，然后再根据这些参数设计模型中消费者的数量，以及某一时间点 `可触发任务的数量` 和 `任务执行使用时间的限制(不能让某个任务无休止的执行)`。
