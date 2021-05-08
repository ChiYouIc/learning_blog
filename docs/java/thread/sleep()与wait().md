# sleep() 与 wait()

## slepp() 

sleep() 方法是 Thread 类中的一个静态的，native 修饰的方法：

``` java
public static native void sleep(long millis) throws InterruptedException;
```

`Thread.sleep()` 方法在任何情况下都可以调用的，调用 `sleep(long millis)` 方法后，当前线程会进入休眠状态（参数 millis 休眠时长，单位：毫秒），在线程暂停期间，当前暂停线程会让出 CPU 资源给其他线程，但不会失去任何监视器的所有权，并且不会释放任何锁资源。

## wait()

wait() 方法是 Object 中定义的 native 修饰的方法：

``` java
public final native void wait(long timeout) throws InterruptedException;
```

wait() 只能在 synchronized block 中调用，即调用前，线程必须是获得了该对象的对象锁；当某个线程调用了对象的 wait() 方法后，那么该线程会放弃当前对象锁，进入等待此对象的等待池中。

## notify()

``` java
public final native void notify();
```

该方法也是只能在 synchronized block 中调用，同样的调用前，线程必须是获得了该对象的对象锁；如果在调用对象的 notify() 方法时，没有获得适当的锁，则会抛出 `IllegalMonitorStateException` 异常。

该方法用来通知等待池中的其它线程，当等待池中有多个线程时，线程规划器会任意选出一个线程，并将其放入锁池中竞争对象的对象锁。

::: warning

* 调用对象的 notify()  方法之后，当前线程并不会马上释放该对象的对象锁，锁池中的线程也不会立马获取到该对象锁，要等到程序退出 synchonized block 之后，当前线程才真正的释放锁，其它线程也才可能获取到该对象锁。

* 等待池中线程在没有收到该对象的 notify() 或 notifyAll() 通知，是不会进入到锁池中竞争对象锁的，即便当前对象锁空闲没有被任何线程持有，直到有线程调用该对象的 notify() 或 notifyAll() 之后才有机会去竞争锁。

:::

## notifyAll()

``` java
public final native void notifyAll();
```

改方法与 notify() 方法的工作方式相同，唯一不同的是, notifyAll() 会使得所有处于等待池中的线程退出 wait 状态，进入到对象的锁池中；一旦对象锁被其它线程释放，锁池中的线程就会开始竞争。如果一个线程获得了该对象的对象锁，它就继续往下执行，在他退出 synchronized block 释放锁之后，锁池中的线程又开始竞争，直到锁池中所有的线程（被唤醒线程）执行完毕。

::: warning

线程调用对象的 wait() 方法，线程会阻塞进入对象等待池，等待池中的线程不会去竞争对象锁；

当有其他线程调用了该对象的 `notifyAll()` 方法（唤醒所有 wait 线程）或 `notify()`方法（随机唤醒一个 wait 线程），被唤醒的线程便会进入该对象的锁池中，锁池中的线程会去竞争该对象锁；

优先级高的线程竞争到对象锁的概率大，假若某个线程（指从等待池进入到锁池的线程）没有获取到对象锁，它还会继续留在锁池中，直到有线程再次调用对象的 wait() 方法后，它又会重新回到等待池中。而竞争到对象锁的线程则会继续往下执行，直到执行完 synchronized block，它才会释放掉该对象锁，此时锁池中的线程又会继续竞争该对象锁。
:::

::: tip

**锁池**：假设线程 A 已经拥有了某个对象的锁，而其它的线程想要调用这个对象的某个 synchronized 方法（或者 synchronized block），由于这些线程在进入对象的 synchronized 方法之前必须先获得该对象的锁的拥有权，但此时的对象锁被线程 A 拥有，所以这些线程就会进入了该对象的锁池中。

**等待池**：假设一个线程 A 调用了某个对象的 wait() 方法，线程 A 就会释放该对象的锁，同时线程 A 就进入到了对象锁的等待池中。

当有线程调用了该对象的 notifyAll() 方法后，所有处于对象等待池的线程就会全部进入该对象的锁池中，准备争夺锁的拥有权。如果调用的是 notify() 方法，那么仅仅只有一个处于等待池的线程会进入到锁池中。

<img :src="$withBase('/img/java/thread/锁池与等待池.png')" alt="锁池与等待池">

:::


