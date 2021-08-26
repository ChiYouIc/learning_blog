---
title: 阻塞队列
sidebar: auto
date: 2021-06-09
categories:
 - 多线程
 - Java
tags:
 - Thread
---


阻塞队列，关键字是阻塞，先理解阻塞的含义，在阻塞队列中，线程阻塞有这样的两种情况：

1. 当队列中没有数据的情况下，消费者端的所有线程都会被自动阻塞（挂起），直到有数据放入队列。

<img :src="$withBase('/img/java/thread/BlockingConsumer.png')" alt="BlockingConsumer">

2. 当队列中填满数据的情况下，生产者端的所有线程都会被自动阻塞（挂起），直到队列中有空的位置，线程被自动唤醒。

<img :src="$withBase('/img/java/thread/BlockingProducer.png')" alt="BlockingProducer">

## 阻塞队列的主要方法

| 方法类型 | 抛出异常  | 特殊值   | 阻塞   | 超时                 |
| :------- | --------- | -------- | ------ | -------------------- |
| 插入     | add(e)    | offer(e) | put(e) | offer(e, time, unit) |
| 移除     | remove()  | poll()   | take() | poll(time, unit)     |
| 检查     | element() | peek()   | 不可用 | 不可用               |

> 抛出异常：抛出一个异常
>
> 特殊值：返回一个特殊值（null 或 false，视情况而定）
>
> 阻塞：在成功操作之前，一直阻塞线程
>
> 超时：放弃前只在最大的时间内阻塞


### 插入操作

1. `public abstract boolean add(E param)`：将指定元素插入次队列中，成功时返回 true，如果当前没有可用空间，则抛出 IllegalStateException。如果该元素是 NULL，则会抛出 NullPointerException 异常；

2. `public abstract boolean offer(E param)`： 将指定元素插入此队列中（如果立即可行且不会违反容量限制），成功时返回 true，如果当前没有可用的空间，则返回 false；

3. `public abstract void put(E param) throws InterruptedException`：将指定元素插入此队列中，将等待可用的空间（如果有必要）；

``` java
public void put(E paramE) throws InterruptedException {
    
    checkNotNull(paramE);
   
    ReentrantLock localReentrantLock = this.lock;
    
    localReentrantLock.lockInterruptibly();
    
    try {
        while (this.count == this.items.length) {
            //如果队列满了，则线程阻塞等待
            this.notFull.await();   
        }
        enqueue(paramE); 
        localReentrantLock.unlock();
    } finally {
        localReentrantLock.unlock();
    }
}
```
4. `offer(E o, long timeout, TimeUnit unit)`：可以设定等待的时间，如果在指定的时间内，还不能往队列中加入 BlockingQueue，则返回失败。

### 获取数据操作

1. `poll(time)`：取走 BlockingQueue 里排在首位的对象,若不能立即取出，则可以等 time 参数规定的时间，取不到时返回 null;

2. `poll(long timeout, TimeUnit unit)`： 从 BlockingQueue 取出一个队首的对象，如果在指定时间内，队列一旦有数据可取，则立即返回队列中的数据。否则直到时间超时还没有数据可取，返回失败。

3. `take()`：取走 BlockingQueue 里排在首位的对象，若 BlockingQueue 为空，阻断进入等待状态直到 BlockingQueue 有新的数据被加入。

4. `drainTo()`：一次性从 BlockingQueue 获取所有可用的数据对象（还可以指定获取数据的个数），通过该方法，可以提升获取数据效率；不需要多次分批加锁或释放锁。


## 阻塞队列

* ArrayBlockingQueue：由数组结构组成的有界阻塞队列；

* LinkedBlockingQueue：由链表结构组成的有界阻塞队列；

* PriorityBlockingQueue：支持优先级排序的无界阻塞队列；

* DelayQueue：使用优先级队列实现的无界阻塞队列；

* SynchronousQueue：不存储元素的阻塞队列；

* LinkedTransferQueue：由链表结构组成的无界阻塞队列；

* LinkedBlockingDeque：由链表结构组成的双向阻塞队列。

### 示意图

<img :src="$withBase('/img/java/thread/BlockingQueue.png')" alt="BlockingQueue">

## ArrayBlockingQueue（公平、非公平）

用数组实现的有界阻塞队列。此队列按照先进先出（FIFO）的原则对元素进行排序。`默认情况下不保证访问者能公平访地问队列`，所谓公平访问队列是指阻塞的所有生产者线程或消费者线程，
当队列可用时，可以按照阻塞的先后顺序访问队列，即先阻塞的生产者线程，可以先往队列里插入元素，先阻塞的消费者线程，可以先从队列里获取元素。通常情况下为了保证公平性会降低吞吐量。

### ### 构造方法

``` java
public ArrayBlockingQueue(int capacity, boolean fair) {
    ... ...
}
```

::: tip 参数解析
* capacity：队列容量

* fair：是否公平，true 创建能公平访问地队列，false 反之
:::

## LinkedBlockingQueue（两个独立锁提供并发）

基于链表的阻塞队列，同 ArrayListBlockingQueue 类似，此队列按照先进先出（FIFO）的原则对元素进行排序。而 LinkedBlockingQueue 之所以能够`高效地处理并发数据`，
是因为其对于`生产端和消费端分别采用了独立的锁来控制数据同步`，这也意味着高并发的情况下生产者和消费者可以并行地操作队列中的数据，以此来提供整个队列的并发性能。

LinkedBlockingQueue 默认初始化大小为 `Integer.MAX_VALUE`。

### 构造方法

``` java
public LinkedBlockingQueue() {
    this(Integer.MAX_VALUE);
}

public LinkedBlockingQueue(int capacity) {
    ... ...
}
```

::: tip 参数详解
* capacity：队列容量，当创建时，不指定初始化容量时，默认容量大小为 Integer.MAX_VALUE。
:::


## PriorityBlockingQueue（compareTo 排序实现优先）

这是一个支持优先级的无界队列。默认情况下元素采取自然顺序升序排列。可以自定义实现 compareTo() 方法来指定元素进行排序规则，或者初始化 PriorityBlockingQueue 时，
指定构造参数 Comparator 来对元素进行排序。需要注意的是不能保证同优先级元素的顺序。

### 构造方法
``` java
public PriorityBlockingQueue() {
    this(DEFAULT_INITIAL_CAPACITY, null);
}

public PriorityBlockingQueue(int initialCapacity, Comparator<? super E> comparator) {
    ... ...    
}
```

::: tip 参数详解
* initialCapacity：初始化队列容量，默认值，`private static final int DEFAULT_INITIAL_CAPACITY = 11;`

* comparator：初始化队列
:::

## DelayQueue（缓存失效、定时任务）

这是一个支持`延迟获取元素的无界阻塞队列`。队列使用 PriorityQueue 来实现。队列中的元素必须实现 Delayed 接口，在创建元素时可以指定多久才能从队列中获取当前元素。
只有在延迟期满时才能从队列中提取元素。我们可以将 DelayQueue 运用在一下应用场景：

1. 缓存系统的设计：可以用 DelayQueue 保存缓存元素的有效期，使用一个线程循环查询 DelayQueue，一旦能从 DelayQueue 中获取元素时，表示缓存有效期到了。

2. 定时任务调度：使用 DelayQueue 保存当前将会执行的任务和执行时间，一旦从 DelayQueue 中获取到任务就开始执行，从比如 TimerQueue 就是使用 DelayQueue 实现的。

## SynchronousQueue（不存储数据、可用于传递数据）

这是`一个不存储元素的阻塞队列。每一个 put 操作必须等待一个 take 操作，否则不能继续添加元素`。SynchronousQueue 可以看成是一个传球手，负责把生产者线程处理的数据直接传递给消费者线程。
队列本身本部存储任何元素，非常适合于传递性场景，比如在一个线程中使用的数据，传递给另外一个线程使用，SynchronousQueue 的吞吐量高于 LinkedBlockingQueue 和 ArrayBlockingQueue。

### 构造方法

``` java
public SynchronousQueue() {
    this(false);
}

public SynchronousQueue(boolean fair) {
    transferer = fair ? new TransferQueue<E>() : new TransferStack<E>();
}
```

::: tip 参数详解
* fair：默认是 false，创建不公平的存储队列
:::

## LinkedTransferQueue

这是一个由链表结构组成的无界阻塞 TransferQueue 队列。相对于其它阻塞队列，LinkedTransferQueue 多了 `tryTransfer` 和 `transfer` 方法。

1. transfer 方法：如果当前有消费者正在等待接收元素（消费者使用 take() 方法或带时间限制的 poll() 方法时），`transfer 方法可以把生产者传入的元素立刻 transfer（传输）给消费者`。
如果没有消费者在等待接收元素，`transfer 方法会将元素存放在队列的尾节点，并等到该元素被消费者消费了才返回`。

``` java
public void transfer(E e) throws InterruptedException {
    if (xfer(e, true, SYNC, 0) != null) {
        
        Thread.interrupted(); // 可能会因为线程中断导致返回失败（消费空数据）
        
        throw new InterruptedException();
    }
}
```

2. tryTransfer 方法。则是用来试探生产者传入的元素是否能直接传给消费者。如果没有消费者等待接收元素，则返回 false。和 transfer 方法的区别是 tryTransfer 方法无论
消费者是否接收，方法立即放回。而 transfer 方法是必须等到消费者消费了才返回。

``` java
public boolean tryTransfer(E e) {
    return xfer(e, true, NOW, 0) == null;
}
```

对于带有时间限制的 tryTransfer(E e, long timeout, TimeUnit unit) 方法，则是试图把生产者传入的元素直接传给消费者，但是如果没有消费者消费该元素则等待指定的时间再返回，如果超时
还没有消费元素，则返回 false，如果在超时时间内消费了元素，则返回 true。

``` java
public boolean tryTransfer(E e, long timeout, TimeUnit unit) throws InterruptedException {
    if (xfer(e, true, TIMED, unit.toNanos(timeout)) == null) 
        return true;
    
    if (!Thread.interrupted())
        return false;
        
    throw new InterruptedException();
}
```



## LinkedBlockingDeque

这是一个由链表结构组成的双向阻塞队列。所谓双向队列指的是`可以从队列的两端插入和移除元素`。双端队列因为多了一个操作队列的入口，在多线程同时入队时，也就减少了一半的竞争。
相比其它的阻塞队列，LinkedBlockingDeque 多了 `addFirst`、`addLast`、`offerFirst`、`offerLast`、`peekFirst`、`peekLast` 等方法，以 First 单词结尾的方法表示插入、获取或移除
双端队列的最后一个元素。另外插入方法 add 等同于 addLast，移除方法 remove 等同于 removeFirst。但是 take 方法却是等同于 takeFirst，所以在使用时还是用带有 First
和 Last 后缀的方法更清楚。

在初始化 LinkedBlockingDeque 时可以设置容量防止其过度膨胀。另外双端队列可以运用在`"工作窃取"`模式中。

``` java
public void addFirst(E e) {
    if (!offerFirst(e))
        throw new IllegalStateException("Deque full");
}


public void addLast(E e) {
    if (!offerLast(e))
        throw new IllegalStateException("Deque full");
}

public boolean offerFirst(E e) {
    if (e == null) throw new NullPointerException();
    Node<E> node = new Node<E>(e);
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        return linkFirst(node);
    } finally {
        lock.unlock();
    }
}

public boolean offerLast(E e) {
    if (e == null) throw new NullPointerException();
    Node<E> node = new Node<E>(e);
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        return linkLast(node);
    } finally {
        lock.unlock();
    }
}

public E peekFirst() {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        return (first == null) ? null : first.item;
    } finally {
        lock.unlock();
    }
}

public E peekLast() {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        return (last == null) ? null : last.item;
    } finally {
        lock.unlock();
    }
}

public E removeFirst() {
    E x = pollFirst();
    if (x == null) throw new NoSuchElementException();
    return x;
}

public E removeLast() {
    E x = pollLast();
    if (x == null) throw new NoSuchElementException();
    return x;
}

public E pollFirst() {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        return unlinkFirst();
    } finally {
        lock.unlock();
    }
}

public E pollLast() {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        return unlinkLast();
    } finally {
        lock.unlock();
    }
}
```

### 构造方法

``` java
public LinkedBlockingDeque() {
    this(Integer.MAX_VALUE);
}

public LinkedBlockingDeque(int capacity) {
    ... ...
}
```

::: tip 参数详解
* capacity：初始化队列大小
:::
