---
title: Vector
sidebar: auto
date: 2021-12-13
categories:
 - container 容器
tags:
 - Collections
---

Vector 与 ArrayList 一样，也是通过数组实现的，不同的是它支持线程的同步，即某一时刻只有一个线程能够写，避免多线程同时写而引起的读写不一致的情况，但是实现同步是需要花费很高的代价，因此，Vector 的访问速度不及 ArrayList 的访问速度。

## 源码分析

Vector 与 ArrayList 底层同样是通过维护一个数组实现的，都支持随机访问，以及动态扩容；最大的差异就是 Vector 是线程安全的，而 ArrayList 不是。

``` java
/**
 * The array buffer into which the components of the vector are
 * stored. The capacity of the vector is the length of this array buffer,
 * and is at least large enough to contain all the vector's elements.
 *
 * <p>Any array elements following the last element in the Vector are null.
 *
 * @serial
 */
protected Object[] elementData;

/**
 * The number of valid components in this {@code Vector} object.
 * Components {@code elementData[0]} through
 * {@code elementData[elementCount-1]} are the actual items.
 *
 * @serial
 */
protected int elementCount;

/**
 * The amount by which the capacity of the vector is automatically
 * incremented when its size becomes greater than its capacity.  If
 * the capacity increment is less than or equal to zero, the capacity
 * of the vector is doubled each time it needs to grow.
 *
 * @serial
 */
protected int capacityIncrement;
```

`elementData`是一个对象数组的引用，也就是 Vector 内部需要维护的那个数组，`elementCount`用于记录数组的长度，类似于 ArrayList 中的 size，在创建 elementData 时，默认为 10；而 `capacityIncrement`是用来记录每次的扩容大小的，可以在初始化的时候设置，如果不设置，Vector 每次扩容默认是原来的 2 倍。

``` java
/**
 * Constructs an empty vector with the specified initial capacity and
 * capacity increment.
 *
 * @param   initialCapacity     the initial capacity of the vector
 * @param   capacityIncrement   the amount by which the capacity is
 *                              increased when the vector overflows
 * @throws IllegalArgumentException if the specified initial capacity
 *         is negative
 */
public Vector(int initialCapacity, int capacityIncrement) {
    super();
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal Capacity: "+ initialCapacity);
    this.elementData = new Object[initialCapacity];
    this.capacityIncrement = capacityIncrement;
}

/**
 * Constructs an empty vector with the specified initial capacity and
 * with its capacity increment equal to zero.
 *
 * @param   initialCapacity   the initial capacity of the vector
 * @throws IllegalArgumentException if the specified initial capacity
 *         is negative
 */
public Vector(int initialCapacity) {
    this(initialCapacity, 0);
}

/**
 * Constructs an empty vector so that its internal data array
 * has size {@code 10} and its standard capacity increment is
 * zero.
 * 数组默认长度为 10
 */
public Vector() {
    this(10);
}

/**
 * Constructs a vector containing the elements of the specified
 * collection, in the order they are returned by the collection's
 * iterator.
 *
 * @param c the collection whose elements are to be placed into this vector
 *
 * @throws NullPointerException if the specified collection is null
 * @since   1.2
 */
public Vector(Collection<? extends E> c) {
    elementData = c.toArray();
    elementCount = elementData.length;
    // c.toArray might (incorrectly) not return Object[] (see 6260652)
    if (elementData.getClass() != Object[].class)
        elementData = Arrays.copyOf(elementData, elementCount, Object[].class);
}
```

### 添加

``` java
/**
 * Appends the specified element to the end of this Vector.
 *
 * @param e element to be appended to this Vector
 * @return {@code true} (as specified by {@link Collection#add})
 * @since 1.2
 */
public synchronized boolean add(E e) {
    modCount++;
    ensureCapacityHelper(elementCount + 1);
    elementData[elementCount++] = e;
    return true;
}
```

Vector 的 add() 方法与 ArrayList 基本一样，数组扩容的方式逻辑上是一致的。不同的是 Vector 扩容大小默认是原来的 2 倍，而 ArrayList 是原来的 1.5 倍。

``` java
/**
 * This implements the unsynchronized semantics of ensureCapacity.
 * Synchronized methods in this class can internally call this
 * method for ensuring capacity without incurring the cost of an
 * extra synchronization.
 *
 * @see #ensureCapacity(int)
 */
private void ensureCapacityHelper(int minCapacity) {
    // overflow-conscious code
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}
```

``` java
/**
 * The maximum size of array to allocate.
 * Some VMs reserve some header words in an array.
 * Attempts to allocate larger arrays may result in
 * OutOfMemoryError: Requested array size exceeds VM limit
 */
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + ((capacityIncrement > 0) ?
                                     capacityIncrement : oldCapacity);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    elementData = Arrays.copyOf(elementData, newCapacity);
}

private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
    MAX_ARRAY_SIZE;
}
```

Vector 与 ArrayList 在内部结构和使用方法上基本上保持一致，从初始化和扩容上就能看出；在阅读 Vector 的源码时，你会发现类似 添加、删除、移动需要修改对象本身的方法头上，都用到了 `synchronized`关键字，这也是为什么 Vector 是线程安全的，而 ArrayList 不是。也正是如此，在多线程的情况下，推荐使用的是 Vector，Vector 因为线程安全也付出了部分性能代价。所以在多线程中推荐使用的并发容器类`CopyOnWriteArrayList`，不仅线程安全，同时减少了对线程同步的操作，既能保证线程安全，又能保证效率。