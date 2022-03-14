---
title: Java 集合面试题
sidebar: auto
date: 2022-03-09
categories:
 - container 容器
tags:
 - Collections
 - 面试
---

## List 与 Set 的区别

List 是一个有序集合，即存入顺序与取出顺序一致；Set 集合是一个无序且集合内元素不重复的集合，无序指的是元素的存取顺序不一致，元素不重复指的是集合内的元素都是独一无二的。对象的相等性本质依赖于 hashCode 值的判断，如果需要特殊定制对象相等性的判断，可以覆盖对象本身的 hashCode 和 equals 方法。

## Hashtable 与 HashMap 的区别

- 线程安全：Hashtbale 是线程安全的类，而 HashMap 是线程不安全的类；Hashtable 几乎在所有方法上都追加了 synchronized 锁，在单线程环境下，Hashtabl 的效率比不上 HashMap。

- 插入值：HashMap 允许有一个键为 null，允许多个值为 null 的情况，而 Hashtable 不允许出现键或值为 null 的情况。

- 容量与扩容：HashMap 底层数组的长度设计为 2 的次幂，初始为 16，Hashtable 底层数组并没有限制，可以设置为任意长度，这也就造成 Hashtable 的 hash 冲突高于 HashMap；在扩容上，HashMap 创建一个为原先 2 倍的数组，然后对原数组遍历以及 rehash；Hashtable 创建一个长度为原先 2 倍的数组，在使用头插法将链表进行反序。

- 结果区别：HashMap 是由数组 + 链表组成，在 JDk 1.8 之后，当链表长度大于 8 时，链表自动转换为红黑树；而 Hashtable 一直都是数组 + 链表。

- 继承关系：Hashtable 继承自 Dictionary；而 HashMap 继承自 AbStractMap。


