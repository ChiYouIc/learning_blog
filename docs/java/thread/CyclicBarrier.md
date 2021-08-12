# CyclicBarrier

CyclicBarrier 可以使一定数量的线程反复地在栅栏位置处汇集。当线程到达栅栏
位置时将调用 await 方法，这个方法将阻塞直到所有线程都到达栅栏位置。如果所有线程都到达栅栏位置，
那么栅栏将打开，此时所有的线程都将被释放，而栅栏将被重置以便一次使用。
CyclicBarrier 字面意思使“可重复使用的栅栏”，CyclicBarrier 和 CountDownLatch 很像，只是 CyclicBarrier
可以有不止一个栅栏，因为它的栅栏（Barrier）可以重复使用（Cyclic）。

<img :src="$withBase('/img/java/thread/CyclicBarrier演示.png')" alt="CyclicBarrier演示">

## CyclicBarrier 构造函数

``` java
public CyclicBarrier(int parties, Runnable barrierAction) {
    if (parties <= 0) throw new IllegalArgumentException();
    this.parties = parties;
    this.count = parties;
    this.barrierCommand = barrierAction;
}
```

``` java
public CyclicBarrier(int parties) {
    this(parties, null);
}
```

::: tip 参数：

* parties：参与线程的个数，每个线程使用 await() 方法告诉 CyclicBarrier 我已经到达了屏障，然后当前线程被阻塞；

* barrierAction：当线程到达屏障时，优先执行 barrierAction，方便处理更复杂的业务场景。

:::

## await() 方法

``` java
/**
 * 非定时等待
 */
public int await() throws InterruptedException, BrokenBarrierException {
    try {
        return dowait(false, 0L);
    } catch (TimeoutException toe) {
        throw new Error(toe); // cannot happen
    }
}

/**
 * 定时等待
 */
public int await(long timeout, TimeUnit unit) throws InterruptedException, BrokenBarrierException, TimeoutException {
    return dowait(true, unit.toNanos(timeout));
}
```
::: tip

* 线程调用 await() 表示自己已经到达栅栏；

* BrokenBarrierException 表示栅栏已经被破坏，破坏的原因可能是其中一个线程 await() 时被中断或超时。

:::

可以看到不管是定时等待还是非定时等待，它们都调用了 `dowait` 方法。

## dowait() 方法

``` java
/**
 * 主要障碍代码，涵盖各种政策。
 */
private int dowait(boolean timed, long nanos) throws InterruptedException, BrokenBarrierException, TimeoutException {
    final ReentrantLock lock = this.lock;
    lock.lock();
    try {
        final Generation g = generation;
        // 检查当前栅栏是否被打翻
        if (g.broken)
            throw new BrokenBarrierException();
        // 检查当前线程是否被中断
        if (Thread.interrupted()) {
            /*
             * 如果当前线程被中断会做以下三件事：
             *     1. 打翻当前栅栏
             *     2. 唤醒拦截的所有线程
             *     3. 抛出中断异常
             */
            breakBarrier();
            throw new InterruptedException();
        }
        
        // 每次都将计数器的值减 1
        int index = --count;
        // 计数器的值减少为 0 则需唤醒所有线程并转换到下一代（所有线程已经到达了栅栏，即将唤醒所有的线程）
        if (index == 0) {  // tripped
            boolean ranAction = false;
            try {
                // 唤醒所有线程前执行指定的任务
                final Runnable command = barrierCommand;
                if (command != null)
                    command.run();
                ranAction = true;
                // 唤醒所有线程并转到下一代（等待下一个栅栏）
                nextGeneration();
                return 0;
            } finally {
                // 确保在任务未成功执行时能将所有线程唤醒
                if (!ranAction)
                    // 将当前屏障生成设置为已破坏并唤醒所有线程
                    breakBarrier();
            }
        }

        // 如果计数器部位 0 则执行此循环
        for (;;) {
            try {
                // 根据传入的参数来决定是定时等待还是非定时等待
                if (!timed)
                    trip.await();
                else if (nanos > 0L)
                    nanos = trip.awaitNanos(nanos);
            } catch (InterruptedException ie) {
                // 如果当前线程在等待期间被中断则打翻栅栏唤醒其它线程
                if (g == generation && ! g.broken) {
                    // 将当前屏障生成设置为已破坏并唤醒所有线程
                    breakBarrier();
                    throw ie;
                } else {
                    // 如果在捕获中断异常前已经完成在栅栏上的等待，则直接调用中断操作
                    Thread.currentThread().interrupt();
                }
            }
            // 如果线程因为打翻栅栏操作而被唤醒则抛出异常
            if (g.broken)
                throw new BrokenBarrierException();
            // 如果线程因为换代操作而被唤醒则返回技术器的值
            if (g != generation)
                return index;
            // 如果线程因为时间到了而被唤醒则打翻栅栏并抛出异常
            if (timed && nanos <= 0L) {
                breakBarrier();
                throw new TimeoutException();
            }
        }
    } finally {
        lock.unlock();
    }
}
```

## 演示

``` java
public class CyclicBarrierGame {
	public static void main(String[] args) {

		ThreadPoolExecutor executor = new ThreadPoolExecutor(10, 10, 0, TimeUnit.SECONDS, new LinkedBlockingQueue<>(), Executors.defaultThreadFactory());

		CyclicBarrier cyclicBarrier = new CyclicBarrier(10, () -> System.out.println("资源加载中..."));

		for (int i = 0; i < 10; i++) {
			executor.execute(new GameRole(cyclicBarrier));
		}

		executor.shutdown();
	}
}

class GameRole implements Runnable {

	private final Random random = new Random(10);

	private final CyclicBarrier cyclicBarrier;

	public GameRole(CyclicBarrier cyclicBarrier) {
		this.cyclicBarrier = cyclicBarrier;
	}

	@SneakyThrows
	@Override
	public void run() {

		Thread.sleep(random.nextInt(5) * 1000L);
		System.out.println("玩家 " + Thread.currentThread().getName() + " 确定进入游戏...");

		cyclicBarrier.await();
		Thread.sleep(random.nextInt(5) * 1000L);
		System.out.println("玩家 " + Thread.currentThread().getName() + " 正在选择英雄...");

		cyclicBarrier.await();
		Thread.sleep(random.nextInt(5) * 1000L);
		System.out.println("玩家 " + Thread.currentThread().getName() + " 选择结束...");

		cyclicBarrier.await();
		Thread.sleep(random.nextInt(5) * 1000L);
		System.out.println("玩家 " + Thread.currentThread().getName() + ": 冲！冲！冲！");
	}
}
```

### 输出
``` shell script
玩家 pool-1-thread-1 确定进入游戏...
玩家 pool-1-thread-2 确定进入游戏...
玩家 pool-1-thread-3 确定进入游戏...
玩家 pool-1-thread-8 确定进入游戏...
玩家 pool-1-thread-9 确定进入游戏...
玩家 pool-1-thread-10 确定进入游戏...
玩家 pool-1-thread-7 确定进入游戏...
玩家 pool-1-thread-6 确定进入游戏...
玩家 pool-1-thread-5 确定进入游戏...
玩家 pool-1-thread-4 确定进入游戏...
资源加载中...
玩家 pool-1-thread-4 正在选择英雄...
玩家 pool-1-thread-1 正在选择英雄...
玩家 pool-1-thread-2 正在选择英雄...
玩家 pool-1-thread-8 正在选择英雄...
玩家 pool-1-thread-9 正在选择英雄...
玩家 pool-1-thread-6 正在选择英雄...
玩家 pool-1-thread-3 正在选择英雄...
玩家 pool-1-thread-5 正在选择英雄...
玩家 pool-1-thread-7 正在选择英雄...
玩家 pool-1-thread-10 正在选择英雄...
资源加载中...
玩家 pool-1-thread-10 选择结束...
玩家 pool-1-thread-5 选择结束...
玩家 pool-1-thread-3 选择结束...
玩家 pool-1-thread-7 选择结束...
玩家 pool-1-thread-2 选择结束...
玩家 pool-1-thread-6 选择结束...
玩家 pool-1-thread-4 选择结束...
玩家 pool-1-thread-9 选择结束...
玩家 pool-1-thread-8 选择结束...
玩家 pool-1-thread-1 选择结束...
资源加载中...
玩家 pool-1-thread-1: 冲！冲！冲！
玩家 pool-1-thread-10: 冲！冲！冲！
玩家 pool-1-thread-5: 冲！冲！冲！
玩家 pool-1-thread-6: 冲！冲！冲！
玩家 pool-1-thread-8: 冲！冲！冲！
玩家 pool-1-thread-4: 冲！冲！冲！
玩家 pool-1-thread-2: 冲！冲！冲！
玩家 pool-1-thread-7: 冲！冲！冲！
玩家 pool-1-thread-3: 冲！冲！冲！
玩家 pool-1-thread-9: 冲！冲！冲！
```

## CyclicBarrier 和 CountDownLatch 的区别

* CountDownLatch 的计数器只能使用一次，而 CyclicBarrier 的计数器可以使用 reset() 方法重置，
可以使用多次，所以 CyclicBarrier 能处理更为复杂的场景；

* CyclicBarrier 还提供了一些其它有用的方法，比如 getNumberWaiting() 方法可以获得 CyclicBarrier 阻塞的线程数量，
isBroken() 方法用来了解阻塞的线程是否被中断；

* CountDownLatch 允许一个或多个线程等待一组事件的产生，而 CyclicBarrier 用于等待其它线程运行到栅栏位置。
