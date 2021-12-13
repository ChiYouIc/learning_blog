---
title: LinkedHashSet
sidebar: auto
date: 2021-12-13
categories:
 - container 容器
tags:
 - Collections
---

对于 LinkedHashSet 而言，他是继承 HashSet、基于 LinkedHashMap 来实现的。LinkedHashSet 底层使用 LinkedHashMap 来保护所有元素，他继承 HashSet，其所有的方法操作上又与 HashSet 相同，因此 LinkedHashSet 的实现非常简单，只提供了四个构造方法，并通过传递一个标识参数，调用父类的构造器，底层构造一个 LinkedHashMap 来实现，在相关操作上与父类 HashSet 的操作相同，直接调用父类 HashSet 方法即可。

``` java
/**
 * Constructs a new, empty linked hash set with the specified initial
 * capacity and load factor.
 *
 * @param      initialCapacity the initial capacity of the linked hash set
 * @param      loadFactor      the load factor of the linked hash set
 * @throws     IllegalArgumentException  if the initial capacity is less
 *               than zero, or if the load factor is nonpositive
 */
public LinkedHashSet(int initialCapacity, float loadFactor) {
    super(initialCapacity, loadFactor, true);
}

/**
 * Constructs a new, empty linked hash set with the specified initial
 * capacity and the default load factor (0.75).
 *
 * @param   initialCapacity   the initial capacity of the LinkedHashSet
 * @throws  IllegalArgumentException if the initial capacity is less
 *              than zero
 */
public LinkedHashSet(int initialCapacity) {
    super(initialCapacity, .75f, true);
}

/**
 * Constructs a new, empty linked hash set with the default initial
 * capacity (16) and load factor (0.75).
 */
public LinkedHashSet() {
    super(16, .75f, true);
}

/**
 * Constructs a new linked hash set with the same elements as the
 * specified collection.  The linked hash set is created with an initial
 * capacity sufficient to hold the elements in the specified collection
 * and the default load factor (0.75).
 *
 * @param c  the collection whose elements are to be placed into
 *           this set
 * @throws NullPointerException if the specified collection is null
 */
public LinkedHashSet(Collection<? extends E> c) {
    super(Math.max(2*c.size(), 11), .75f, true);
    addAll(c);
}
```

`LinkedHashSet`与`HashSet`的区别和`LinkedHashMap`与`HashMap`的区别一样，`LinkedHashMap`和`LinkedHashSet`是有序的，内部由双向链表来记录顺序，而`HashMap`和`HashSet`都是无序的。