---
title: 同步锁与死锁
sidebar: auto
date: 2021-05-28
categories:
 - 多线程
 - Java
tags:
 - Thread
---

## 同步锁

当多个线程同时访问同一个数据时，很容易出现问题。为了避免这种情况出现，需要`保证线程同步互斥，就是指并发执行的多个线程`，在同一时间内只允许出现一个线程访问共享数据。
Java 中可以使用 synchronized 关键字来取得一个对象的同步锁。


## 死锁

死锁，就是多个线程同时被阻塞，他们中的一个或全部都在等待某个资源被释放。
