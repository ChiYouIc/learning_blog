---
title: HashSet
sidebar: auto
date: 2021-12-13
categories:
 - container 容器
tags:
 - Collections
---

哈希表存放的是哈希值。HashSet 存储元素的顺序并不是按照存入时的顺序（和 List 显然不同）而是按照哈希值来存的，所以取数据也是按照 Hash 值取的。元素的哈希值是通过元素的 hashCode() 方法获取的，HashSet 首先判断两个元素的哈希值，如果哈希值一样，接着会比较 equals 方法，如果 equals 结果为 true，HashSet 就视为同一个元素。如果 equals 为 false 就不是同一个元素。

哈希值相同 equals 为 false 的元素是怎么存储的呢？就是在相同的哈希值下顺延（可以认为哈希值相同的元素存放在同一个哈希桶中）。也就是哈希值一样的存在同一列中。如下图所示，A表示的是所有元素的哈希值都不同的情况；B表示各元素的哈希值相同的情况。

<img :src="$withBase('/img/java/container/Hash_u8868_u5B58_u653E_u89C4_u5219.png')" alt="Hash_u8868_u5B58_u653E_u89C4_u5219">

HashSet 通过 hashCode 值来确定元素在内存中的位置。一个 hashCode 位置上可以存放多个元素。

`HashSet`实现了`Set`接口，它的底层是由`HashMap`来支持的。`HashSet`的元素实际上是存储在底层`HashMap`的`key`上的。由于`HashMap`的无序不重复特性，`HashSet`存储的元素也是无序的，并且元素也不能重复，同时也只允许存储一个`null`元素。

## 源码分析

### 主要属性

``` java
// HashSet 底层的 map
private transient HashMap<E,Object> map;

// Dummy value to associate with an Object in the backing Map
// 虚拟的值，主要用于与存入的元素，在 HashMap 中构建 key - value 关系（唯一的用途）
private static final Object PRESENT = new Object();
```

`HashSet`是通过`HashMap`来保存元素，由于只需要目标元素保存在`key`中，所以采用虚拟对象`PRESENT`对应`map`中的`value`值的引用。每次向`map`中添加元素时，每个元素在`map`中对应的`value`都是`PRESENT`。

### 构造函数

``` java
// 默认无参构造
public HashSet() {
    map = new HashMap<>();
}
// 根据已有集合元素来构造HashSet
public HashSet(Collection<? extends E> c) {
    map = new HashMap<>(Math.max((int) (c.size()/.75f) + 1, 16));
    addAll(c);
}
// 给定初始容量
public HashSet(int initialCapacity) {
    map = new HashMap<>(initialCapacity);
}
// 给定初始容量和加载因子
public HashSet(int initialCapacity, float loadFactor) {
    map = new HashMap<>(initialCapacity, loadFactor);
}
// 这个构造函数外部不能调用，供LinkedHashSet复写
HashSet(int initialCapacity, float loadFactor, boolean dummy) {
    map = new LinkedHashMap<>(initialCapacity, loadFactor);
}
```

### 重要方法

``` java
/**
 * Returns the number of elements in this set (its cardinality).
 * 长度
 * @return the number of elements in this set (its cardinality)
 */
public int size() {
    return map.size();
}

/**
 * Returns <tt>true</tt> if this set contains no elements.
 * 是否为空
 * @return <tt>true</tt> if this set contains no elements
 */
public boolean isEmpty() {
    return map.isEmpty();
}

/**
 * Returns <tt>true</tt> if this set contains the specified element.
 * More formally, returns <tt>true</tt> if and only if this set
 * contains an element <tt>e</tt> such that
 * <tt>(o==null&nbsp;?&nbsp;e==null&nbsp;:&nbsp;o.equals(e))</tt>.
 * 连接
 * @param o element whose presence in this set is to be tested
 * @return <tt>true</tt> if this set contains the specified element
 */
public boolean contains(Object o) {
    return map.containsKey(o);
}

/**
 * Adds the specified element to this set if it is not already present.
 * More formally, adds the specified element <tt>e</tt> to this set if
 * this set contains no element <tt>e2</tt> such that
 * <tt>(e==null&nbsp;?&nbsp;e2==null&nbsp;:&nbsp;e.equals(e2))</tt>.
 * If this set already contains the element, the call leaves the set
 * unchanged and returns <tt>false</tt>.
 * 添加元素
 * @param e element to be added to this set
 * @return <tt>true</tt> if this set did not already contain the specified
 * element
 */
public boolean add(E e) {
    return map.put(e, PRESENT)==null;
}

/**
 * Removes the specified element from this set if it is present.
 * More formally, removes an element <tt>e</tt> such that
 * <tt>(o==null&nbsp;?&nbsp;e==null&nbsp;:&nbsp;o.equals(e))</tt>,
 * if this set contains such an element.  Returns <tt>true</tt> if
 * this set contained the element (or equivalently, if this set
 * changed as a result of the call).  (This set will not contain the
 * element once the call returns.)
 * 移除元素
 * @param o object to be removed from this set, if present
 * @return <tt>true</tt> if the set contained the specified element
 */
public boolean remove(Object o) {
    return map.remove(o)==PRESENT;
}

/**
 * Removes all of the elements from this set.
 * The set will be empty after this call returns.
 * 清空
 */
public void clear() {
    map.clear();
}
```
