---
title: Hashtable
sidebar: auto
date: 2022-01-05
categories:
 - container 容器
tags:
 - Collections
---

Hashtable 是遗留类，很多映射的常用功能与 HashMap 类似，不同的是他继承自 Directionary 类，并且是线程安全的，任意时间只有一个线程能够写 Hashtable，但并发性不如 ConcurrentHashMap，因为 ConcurrentHashMap 引入了分段锁。Hashtable 不建议在新代码中继续使用，不需要多线的情况下，建议使用 HashMap，需要多线程的场景，建议使用 ConcurrentHashMap。

## Hashtable 继承体系

Hashtable 也是一种 key - value 结构，它继承自 Dictionary，实现了 Map 和 Cloneable 以及 Serializable 接口。

### 继承图

<img :src="$withBase('/img/java/container/Hashtable.png')" alt="Hashtable">

## Hashtable 操作

Hashtable 的操作几乎与 HashMap 操作一致，主要区别在于 Hashtable 为了实现多线程安全，在几乎所有的方法上都加上了 synchronized 锁，而加锁的结果就是 Hashtable 操作效率十分低下。

## Hashtable 与 HashMap 对比

1. **线程安全**：HashMap 是线程不安全的类，多线程下回造成并发冲突，但单线程下运行效率较高；Hashtable 是线程安全的类，很多方法都是使用 synchronized 修饰，也正是因为加锁导致并发效率低下，单线程环境效率也十分低。

2. **插入 null**：HashMap 允许有一个键为 null，允许多个值为 null；但 Hashtable 不允许键或值为 null。

3. **容量**：HashMap 底层数组长度必须为 2 的次幂，这样做是为了降低 hash 冲突准备的，默认为 16；而 Hashtable 底层数组长度可以为任意值，这就造成了 hash 算法散射不均匀，hash 冲突率较高。

4. **Hash 映射**：HashMap 的 hash 算法通过非常规设计，将底层 table 长度设计为 2 的次幂，使用位与运算代替取模运算，减少运算消耗；而 Hashtable 的 hash 算法首先使得 hash 值小于整数最大值。

   ``` java
   // HashMap
   static final int hash(Object key) {
      int h;
      return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
   }
   // 下标index运算
   int index = (table.length - 1) & hash(key)
   
   // HashTable
   int hash = key.hashCode();
   int index = (hash & 0x7FFFFFFF) % tab.length;
   ```

5. **扩容机制**：HashMap 创建一个为原先 2 倍的数组，然后对原数组进行遍历以及 rehash；Hashtable 扩容创建一个原长度为 2 倍的数组，再使用头插法将链表进行反序。

6. **结果区别**：HashMap 是由数组 + 链表组成，在 JDK 1.8 之后，当链表长度大于 8 时，链表自动转换为红黑树；而 Hashtable 一直都是数组 + 链表。

7. **继承关系**：Hashtable 继承自 Dictionary 类；而 HashMap 继承自 AbStractMap 类。

8. **迭代器**：HashMap 是 fail - fast；而 Hashtable 不是。