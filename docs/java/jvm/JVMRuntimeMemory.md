---
title: JVM 运行时内存
sidebar: auto
date: 2021-07-13
categories:
 - Java
tags:
 - JVM
---

Java 堆从 GC 的角度还可以细分为：**新生代**（Eden 区、From survivor 区和 To Survivor 区）和**老年代**。

<img :src="$withBase('/img/java/jvm/JVM运行时内存.png')" alt="JVM运行时内存">

## 新生代

新生代是用来存放新生的对象。一般占据堆的 1/3 空间.由于频繁创建对象，所以新生代会频繁触发 MinorGC 进行垃圾回收。新生代又分为 Eden 区、ServivorFrom、ServivorTo 三个区。

### Eden 区

<font color='#316CA5'>Java 新对象的出生地</font>（如果新创建的对象占用内存很大，则直接分配到老年代）。当 Eden 区内存不够的时候就会触发 MinorGC，对新生代区进行一次垃圾回收。

### ServivorFrom

上一次 GC 的幸存者，作为这一次 GC 的被扫描者。

### ServivorTo

保留了一次 MinorGC 过程中的幸存者。

### MinorGC 的过程（复制 -> 清空 -> 互换）

MinorGC 采用复制算法。

1. Eden、ServivorFrom 复制到 ServivorTo，年龄 +1

   首先，把 Eden  和 ServivorFrom 区域中存活的对象复制到 ServivorTo 区域（如果有对象的年龄以及达到了老年的标准，则赋值到老年代区），同时把这些对象的年龄+1（如果 ServivorTo 不够位置了就放到老年区）

2. 清空 Eden、ServivorFrom

   然后，清空 Eden 和 ServivorFrom 中的对象

3. ServivorTo 和 ServivorFrom 互换

   最后，ServivorTo 和 ServivorFrom 互换，原 ServivorTo 成为下一次 GC 时的 ServivorFrom 区。

## 老年代

主要存放应用程序中生命周期长的内存对象。

老年代的对象比较稳定，所以 MajorGC 不会频繁执行。在进行 MajorGC 前一般都先进行了一次 MinorGC，使得有新生代的对象进入老年代，导致空间不够用时才触发。当无法找到足够大的连续空间分配给新创建的较大对象时也会提前触发一次 MajorGC 进行垃圾回收腾出空间。

MajorGC 采用标记清楚算法：首先扫描一次所有老年代，标记处存储的对象，然后回收没有标记的对象。MajorGC 的耗时比较长，因为要扫描再回收。MajorGC 会产生内存碎片，为了减少内存损耗，我们一般需要进行合并或者标记出来方便下次直接分配。当老年代也装不下的时候，就会抛出 OOM（Out Of Memory）异常。

## 永久代

永久代指内存的永久保存区域，主要存放 Class 和 Meta（元数据）的信息，Class 在被加载的时候被放入永久区域，它和存放实例的区域不同，<font color='#316CA5'>GC 不会在主程序运行期对永久区进行清理</font>。所以这也导致了永久代的区域会随着加载的 Class 的增多而胀满，最终抛出 OOM 异常。

### Java 8 与元数据

在 Java8 中，<font color='#24B0EF'>永久代已经被移除，被一个称为“元数据区”（元空间）的区域所取代</font>。元空间的本质和永久代类似，元空间与永久代之间最大的区别在于：<font color='#316CA5'>元空间并不在虚拟机中，而是使用本地内存</font>。因此，默认情况下，元空间的大小仅受本地内存限制。<font color='#316CA5'>类的元数据放入 Native Memroy，字符串池和类的静态变量放入 Java 堆中，</font>这样可以加载多少类的元数据就不再由 MaxPermSize 控制，而由系统的实际可用空间来控制。
