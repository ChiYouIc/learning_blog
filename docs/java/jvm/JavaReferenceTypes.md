---
title: Java 四种引用类型
sidebar: auto
date: 2021-07-15
categories:
 - Java
tags:
 - JVM
---

## 强引用

在 Java 中最常见的就是强引用，<font color='#0172D0'>把一个对象赋值给一个变量，这个引用变量就是一个强引用。当一个对象被强引用变量引用时</font>，它处于可达状态，它是不可能被垃圾回收机制回收的，即使该对象以后永远都不会被用到 JVM 也不会回收。因此强引用是造成 Java 内存泄漏的主要原因之一。

## 软引用

<font color='#0172D0'>软引用需要用 SoftReference 类来实现</font>，对于只有软引用的对象来说，当系统内存足够时他不会被回收，当系统内存空间不足时它会被回收。软引用通常用在内存敏感的程序中。

## 弱引用

<font color='#0172D0'>弱引用需要用 WeakReference 类来实现</font>，他比软引用的生存周期更短，对于只有弱引用的对象来说，只要垃圾回收机制一运行，不管 JVM 的内存空间是否足够，总会回收该对象的内存。

## 虚引用

虚引用需要 PhantomReference 类来实现，它不能单独使用，必须和引用队列联合使用。<font color='#0172D0'>虚引用的主要作用是跟踪对象被垃圾回收的状态</font>。
