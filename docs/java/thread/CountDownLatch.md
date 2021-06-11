# CountDownLatch 倒计时器

在多线程协作完成业务功能时，有时候需要等待其它多个线程完成任务之后，主线程才能继续往下执行业务功能，在这种业务场景下，通常可以使用 `Thread 类的 join 方法`，
让主线程等待被 join 的线程执行完成之后，主线程才能继续往下执行。当然，使用线程间消息通信机制也可以完成。其实，Java 并发工具类中已经提供了类似 "倒计时" 这样的工具，
可以十分方便地完成上述的这种业务场景。

## 演示

> 使用 CountDownLatch 模拟老师上课，老师需要等待所有的学生进入教室之后才能开始上课。这是模拟了 10 个学生线程，代码如下：

### 使用 Thread 类的 join 方法

``` java
public class ThreadJoinDemo {
	public static void main(String[] args) {

		System.out.println("老师" + Thread.currentThread().getName() + "来了，等待所有同学都到了才上课...");
		List<Student> list = new ArrayList<>();
		list.add(new Student(1500));
		list.add(new Student(1600));
		list.add(new Student(1500));
		list.add(new Student(200));
		list.add(new Student(1500));
		list.add(new Student(1600));
		list.add(new Student(3000));
		list.add(new Student(2500));
		list.add(new Student(1900));
		list.add(new Student(1500));
		list.add(new Student(4000));
		list.add(new Student(1500));
		list.forEach(Thread::start);
		list.forEach(o -> {
			try {
				// 进入等待该线程结束
				o.join();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		});
		System.out.println("所有同学都到齐了，开始上课....");

	}


	public static class Student extends Thread {

		private final long sleepMillis;

		public Student(long sleepMillis) {
			this.sleepMillis = sleepMillis;
		}

		@Override
		public void run() {
			try {
				Thread.sleep(sleepMillis);
				System.out.println("同学" + Thread.currentThread().getName() + "进入了教室....");
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
}
```

### 运行

``` shell script
老师main来了，等待所有同学都到了才上课...
同学Thread-3进入了教室....
同学Thread-11进入了教室....
同学Thread-2进入了教室....
同学Thread-4进入了教室....
同学Thread-0进入了教室....
同学Thread-9进入了教室....
同学Thread-1进入了教室....
同学Thread-5进入了教室....
同学Thread-8进入了教室....
同学Thread-7进入了教室....
同学Thread-6进入了教室....
同学Thread-10进入了教室....
所有同学都到齐了，开始上课....
```

### 使用 CountDownLatch

``` java
public class CountDownLatchDemo {

	private static final Integer STUDENT_COUNT = 10;

	public static void main(String[] args) {

		/** 创建倒计时工具 */
		CountDownLatch countDownLatch = new CountDownLatch(STUDENT_COUNT);

		ThreadPoolExecutor executor = new ThreadPoolExecutor(20, 20, 0L, TimeUnit.SECONDS, new LinkedBlockingQueue<>(), Executors.defaultThreadFactory());

		Teacher teacher = new Teacher(countDownLatch);
		executor.execute(teacher);

		for (int i = 0; i < STUDENT_COUNT; i++) {
			executor.execute(new Student(countDownLatch));
		}

		executor.shutdown();
	}

	/**
	 * 教师
	 */
	public static class Teacher implements Runnable {

		private final CountDownLatch countDownLatch;

		public Teacher(CountDownLatch countDownLatch) {
			this.countDownLatch = countDownLatch;
		}

		@Override
		public void run() {
			System.out.println("老师" + Thread.currentThread().getName() + "来了，等待所有同学都到了才上课...");
			try {
				// 进入等待
				this.countDownLatch.await();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			System.out.println("所有同学都到齐了，开始上课....");
		}
	}

	/**
	 * 学生
	 */
	public static class Student implements Runnable {

		private final CountDownLatch countDownLatch;

		public Student(CountDownLatch countDownLatch) {
			this.countDownLatch = countDownLatch;
		}

		@SneakyThrows
		@Override
		public void run() {
			System.out.println("同学" + Thread.currentThread().getName() + "进入了教室....");
			// 每执行完一个线程，执行一次 countDown()
			this.countDownLatch.countDown();
		}
	}

}
```

### 运行

``` shell script
老师pool-1-thread-1来了，等待所有同学都到了才上课...
同学pool-1-thread-2进入了教室....
同学pool-1-thread-4进入了教室....
同学pool-1-thread-10进入了教室....
同学pool-1-thread-7进入了教室....
同学pool-1-thread-8进入了教室....
同学pool-1-thread-11进入了教室....
同学pool-1-thread-6进入了教室....
同学pool-1-thread-5进入了教室....
同学pool-1-thread-3进入了教室....
同学pool-1-thread-9进入了教室....
所有同学都到齐了，开始上课....
```
