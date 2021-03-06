---
title: GC 垃圾收集器
sidebar: auto
date: 2021-07-18
categories:
 - Java
tags:
 - JVM
---

Java 堆内存被划分为新生代和老年代两部分，新生代主要使用复制和标记-清除垃圾回收算法；老年代主要使用标记-整理垃圾回收算法，因此 Java 虚拟机中针对新生代和老年代分别提供能了多种不同的垃圾收集器，JDK 1.6 中 Sun HotSpot 虚拟机的垃圾收集器如下：

<img :src="$withBase('/img/java/jvm/Sun HotSpot 虚拟机的垃圾收集器.png')" alt="Sun HotSpot 虚拟机的垃圾收集器">

## Serial 垃圾收集器（单线程、复制算法）

<font color='#0172D0'>Serial（译：连续）是最基本垃圾收集器，使用复制算法</font>，曾经是 JDK 1.3.1 之前新生代唯一的垃圾收集器。Serial 是一个单线程的收集器，它使用一个 CPU 资源或一条线程去完成垃圾收集工作，在进行垃圾收集的时候，必须暂停其它所有的工作线程，直到垃圾收集结束。

Serial 垃圾收集器虽然在垃圾收集过程中需要暂停其它工作线程，但它是简单高效的，对于限定单个 CPU 环境来说，没有线程交互的开销，可以获得最高的单线程垃圾收集效率，因此 Serial 垃圾收集器依然是<font color='#0172D0'>Java 虚拟机运行在 Client 模式下，默认的新生代垃圾收集器</font>。

## ParNew 垃圾收集器（Serial + 多线程）

ParNew 垃圾收集器其实是 <font color='#0172D0'>Serial 收集器的多线程版本</font>，也使用复制算法，除了使用多线程进行垃圾收集之外，其余的行为和 Serial 收集器完全一样，ParNew 垃圾收集器在垃圾收集过程中同样也要暂停所有其他的工作线程。

ParNew 收集器默认开启和 CPU 数目相同的线程数，可以通过 -XX:ParellelGCThreads 参数来限制垃圾收集器的线程数。【Parallel：平行的】

ParNew 除了多线程外，其它功能特性与 Serial 收集器几乎完全一样，但是 ParNew 垃圾收集器是<font color='#0172D0'>很多 Java 虚拟机运行在 Server 模式下，新生代默认的垃圾收集器</font>。

## Parallel Scavenge 收集器（多线程复制算法、高效）

Parallel Scavenge 收集器也是一个新生代垃圾收集器，同样使用的是复制算法，也是一个多线程的垃圾收集器，<font color='#0172D0'>他重点关注的是程序达到一个可控制的吞吐量（Thoughput，CPU 用于运行用户代码的时间 / CPU 总消耗时间，级吞吐量 = 运行用户代码时间 / （运行用户代码时间 + 垃圾收集的时间））</font>，高吞吐亮可以最高效率地利用 CPU 时间，尽快地完成程序的运算任务，主要适用于在后台运算而不需要太多交互的任务。<font color='#0172D0'>自适应调节策略也是 Parallel Scavenge 收集器与 ParNew 收集器的一个重要区别</font>。

## Serial Old 收集器（单线程标记整理算法）

<font color='#0172D0'>Serial Old 是老年版的 Serial 垃圾收集器</font>。它同样是个单线程的收集器，使用标记-整理算法，这个收集器也主要是<font color='#0172D0'>运行在 Client 模式下，默认的老年代垃圾收集器。</font>

在 Server 模式下，主要有两个用途：

1. 在 JDK 1.5 之前版本中与新生代的 Parallel Scavenge 收集器搭配使用。
2. 作为老年代中使用 CMS 收集的后备垃圾收集方案。

新生代 Serial 与老年代 Serial Old 搭配垃圾收集过程图：

<img :src="$withBase('/img/java/jvm/新生代 Serial 与年老代 Serial Old 搭配垃圾收集过程图.png')" alt="新生代 Serial 与年老代 Serial Old 搭配垃圾收集过程图">

新生代 Parallel Scavenge 收集器与 ParNew 收集器做工作原理类似，都是多线程的收集器，都是用的是复制算法，在垃圾收集过程中都需要暂停所有的工作线程。新生代 Parallel Scavenge / ParNew 与老年代 Serial Old 搭配垃圾收集过程图：

<img :src="$withBase('/img/java/jvm/新生代 Parallel Scavenge-ParNew 与年老代 Serial Old 搭配垃圾收集过程图.png')" alt="新生代 Parallel Scavenge-ParNew 与年老代 Serial Old 搭配垃圾收集过程图">

## Parallel Old 收集器（多线程标记整理算法）

Parallel Old 收集器是 Parallel Scavenge 的老年代版本，使用多线程的标记-整理算法，在 JDK1.6 才开始提供。

在 JDK1.6 之前，新生代使用 Parallel Scavenge 收集器搭配老年代的 Serial Old 收集器，这个组合只能保证新生代的吞吐量优先，而无法保证整体的吞吐量。<font color='#0172D0'> Parallel Old 正是一个可保证整体吞吐量优先的垃圾收集器</font>，如果系统对吞吐量要求比较高，可以优先考虑新生代 Parallel Scavenge 和老年代 Parallel Old 收集器的搭配策略。

新生代 Parallel Scavenge 和老年代 Parallel Old 收集器搭配运行过程图：

<img :src="$withBase('/img/java/jvm/新生代 Parallel Scavenge 和年老代 Parallel Old 收集器搭配运行过程图.png')" alt="新生代 Parallel Scavenge 和年老代 Parallel Old 收集器搭配运行过程图">

## CMS 收集器（多线程标记清除算法）

Concurrent mark sweep（CMS）收集器是一种老年代垃圾收集器，其最<font color='#0172D0'> 主要目标是获取最短垃圾回收停顿时间</font>，和其他老年代使用标记-整理算法不同，它使用<font color='#0172D0'> 多线程的标记-清除算法</font>。

最短的垃圾收集停顿时间可以为交互比较高的程序提高用户体验。

CMS 工作机制相比其它的垃圾收集器来说更复杂，整个过程分为一下 4 个阶段：

### 初始标记

知识标记一下 GC Roots 能直接关联的对象，速度很快，但仍然需要暂停其它工作线程。

### 并发标记

进行 GC Roots 跟踪的过程，和用户线程一起工作，不需要暂停其它工作线程。

### 重新标记

为了修正在并发标记期间，因用户程序继续运行而导致标记产生变动的那一部分对象的标记记录，仍然需要暂停所有的工作线程。

### 并发清除

清除 GC Roots 不可达对象，和用户线程一起工作，不需要暂停工作线程。由于并发标记和并发清除过程耗时比较长，垃圾收集线程可以和用户线程一起并发工作，<font color='#0172D0'> 所以总体上来看 CMS  收集的内存回收和用户线程是一起并发执行的</font>。

CMS 收集器工作过程：

<img :src="$withBase('/img/java/jvm/CMS 收集器工作过程.png')" alt="CMS 收集器工作过程">

## G1 收集器

Grabage first 垃圾收集器是目前垃圾收集器理论发展的最前沿成果，相比与 CMS 收集器，G1 收集器两个最突出的改进是：

1. 基于标记-整理算法，不产生内存碎片。
2. 可以非常精确控制停顿时间，在不牺牲吞吐量前提下，实现低停顿垃圾回收。

<font color='#0172D0'>G1 收集器避免全区域垃圾收集，它把堆内存划分为大小固定的几个独立区域</font>，并且跟踪这些区域的垃圾收集进度，同时在后台维护一个优先级列表，每次根据所允许的收集时间。<font color='#0172D0'>优先回收垃圾最多的区域</font>。区域划分和优先级区域回收机制，确保了 G1 收集器可以在有限时间内获得最高的垃圾收集效率。
