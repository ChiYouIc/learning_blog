# start() 与 Run()

## start() 

**start() 方法是用来启动线程，真正实现多线程运行**。当调用 start() 方法后线程将从 `NEW（新建）状态` 变为 `READY（就绪）状态`。只有当线程成为 `READY（就绪）状态`时，他才可能得到 CPU 的调度，执行线程任务，也就是线程从 `READY（就绪）状态` 到 `RUNABLE（执行）状态` 的转换。 start() 方法是启动线程，但不是立即执行线程。

## run()

run() 方法是线程执行体，也就是我们需要线程执行的任务区域；将需要执行的任务代码编写到 run() 方法中，当线程得到 CPU 调度之后，run() 就会被执行。run() 方法和 start() 方法的关系是：`start() 负责将线程从新建状态调入就绪状态，run() 则是线程在执行状态下需要执行的任务`。

<img :src="$withBase('/img/java/thread/start()与run().png')" alt="start()与run()">