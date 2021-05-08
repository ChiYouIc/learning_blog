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

wait() 只能在 synchronized block 中调用；当某个线程调用了对象的 wait() 方法后，那么该线程会放弃当前对象锁，进入等待此对象的等待池，当有其他线程调用了 `notifyAll()` 方法（唤醒所有 wait 线程）或 `notify()`方法（随机唤醒一个 wait 线程），被唤醒的线程便会进入该对象的锁池中，锁池中的线程会去竞争该对象锁，优先级高的线程竞争到对象锁的概率大；没有获取到对象锁的线程，还会继续留在锁池中，直到有线程再次调用 wait() 方法，它才会重新回到等待池中。而获取对象锁的线程则会继续往下执行，直到执行完 synchronized block，它才会释放掉该对象锁，此时锁池中的线程会继续竞争该对象锁。

::: tip

**锁池**：假设线程 A 已经拥有了某个对象的锁，而其它的线程想要调用这个对象的某个 synchronized 方法（或者 synchronized block），由于这些线程在进入对象的 synchronized 方法之前必须先获得该对象的锁的拥有权，但此时的对象锁被线程 A 拥有，所以这些线程就会进入了该对象的锁池中。

**等待池**：假设一个线程 A 调用了某个对象的 wait() 方法，线程 A 就会释放该对象的锁，同时线程 A 就进入到了对象锁的等待池中。

:::