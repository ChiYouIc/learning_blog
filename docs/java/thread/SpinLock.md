---
title: 自旋锁
sidebar: auto
date: 2021-06-22
categories:
 - 多线程
 - Java
tags:
 - Thread
---

自旋锁原理很简单，如果持有锁的线程能在很短时间内释放锁资源，那么那些等待竞争锁的线程不需要在用户态与内核态之间切换，它们只需要等一等（自旋），等持有锁的线程释放锁后即可立即获取锁，这样就避免用户线程在用户态与内核态之间的切换开销。

线程自旋是需要消耗 CPU 的，原因就是自旋；当线程获取不到锁时，线程会持续主动访问资源锁，这样就会导致 CPU 做了很多无用功，所以使用自旋锁时，需要设定一个自旋等待最大时间，防止线程长时间自旋消耗 CPU 资源。

如果持有锁的线程执行的时间超过了自旋等待的最大时间仍然没有释放锁，就会导致其它竞争锁的线程停止自旋进入线程阻塞状态。

<img :src="$withBase('/img/java/thread/自旋锁演示.png')" alt="自旋锁演示">

## 优点

自旋锁`尽可能的减少了线程的阻塞`，这对于锁竞争不激烈，且占用锁时间非常短的代码块来说性能能大幅度的提升。因为自旋的消耗会小于线程在阻塞态与执行态之间切换的消耗，并且线程状态的切换会导致线程发生两次上下文交换（用户态与内核态切换）。

## 缺点

如果`锁的竞争激烈，或者持有锁的线程需要长时间占用锁执行同步块`，这时候就不适合使用自旋锁。因为自旋锁在获取锁前一致都是占用 CPU 做无用功的，同时有大量线程在竞争一个锁，会导致获取锁的平均时间很长；线程自旋的消耗大于线程在阻塞态与执行态之间切换的消耗，导致其它需要 CPU 的线程又不能获取到 CPU，就会造成 CPU 资源浪费，还可能导致线程死锁（得到锁的，得不到 CPU 调度；得不到锁的，占用着 CPU）；所以这种情况下需要关闭自旋锁。

## 自旋锁时间阈值

自旋锁的目的是为了占着 CPU 的资源不释放，等到获取到锁立即进行处理。但是如何去选择自旋的执行时间呢？如果自旋执行时间太长，会有大量的线程处于自旋状态占用 CPU 资源，进而会影响整个体系的性能。因此自旋的周期选择额外重要。

JVM 对于自旋周期的选择，在 jdk1.5 时，这个限度是一个常量写死的，在 1.6 中引入了`适应性自旋锁`，适应性自旋锁意味这自旋的时间不在是固定的，而是**根据上一个持有该锁的线程的自选时间以及状态来确定的**，可以认为一个线程上下文切换时间就是最佳的自旋时间，同时 JVM 还针对当前 CPU 的负荷情况做了较多的优化，如果平均负载小于 CPUs 则一直自旋，如果有超过（CPUs / 2）个线程正在自旋，则后来线程直接阻塞；如果正在自旋的线程发现`当前锁持有线程` 发生了变化则延迟自旋时间（自旋计数）或进入阻塞；如果 CPU 处于节电模式则停止自旋，自旋时间的最坏情况是 CPU 的存储延迟（CPU A存储了一个数据，到 CPU B获取这个数据的直接时间差），自旋时会适当放弃线程优先级之间的差异。