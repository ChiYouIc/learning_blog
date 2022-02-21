---
title: Java 面试题
sidebar: auto
date: 2022-02-21
categories:
 - Java
tags:
 - 面试
---



## Java 的 sleep 和 wait 的区别

- Sleep 是 Thread 的静态方法，wait 是 Object 的方法，任何对象都可以调用；

- sleep 不会释放锁，它也不需要占用锁。Wait 会释放锁，但调用它的前提是当前线程占有锁；

- 他们都可以被 interrupted 方法打断。



## 怎么让一个线程等待另一个线程？

- 可以使用 wait 礼让

- join等待其它线程终止

