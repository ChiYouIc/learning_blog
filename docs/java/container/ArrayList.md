---
title: ArrayList（数组）
sidebar: auto
date: 2021-12-10
categories:
 - container 容器
tags:
 - Collections
---

ArrayList 是最常用的 List 实现类，内部是通过数组实现的，它允许对元素进行快速随机访问。数组的缺点是每个元素之间不能有间隔，当数组大小不满足时需要增加存储能力，就要将已经有数据的数组复制到新的存储空间中。当从 ArrayList 的中间位置插入或者删除元素时，需要对数组进行复制、移动、代价比较高。因此，他适合随机查找和遍历，不适合插入和删除。

<img :src="$withBase('/img/java/container/ArrayList.png')" alt="ArrayList">

从上图可以看出 ArrayList 继承了 AbstractList, 直接实现了 Cloneable, Serializable，RandomAccess 类型标志接口。

- AbstractList 作为列表的抽象实现，将元素的增删改查都交给了具体的子类去实现，在元素的迭代遍历的操作上提供了默认实现。
- Cloneable 接口的实现，表示了 ArrayList 支持调用 Object 的 `clone` 方法，实现 ArrayList 的拷贝。
- Seriaizable 接口实现，表示 ArrayList 还支持序列化和反序列化操作，具有固定的 `serialVersionUID`属性值。
- RandomAccess 接口实现，表示 ArrayList 里的元素可以被高效率的随机访问，以下标数字的方式获取元素。实现 RandomAccess 接口的列表上在遍历时可直接使用普通的 for 循环方式，并且执行效率上给迭代器方式更高。

### 源码分析

ArrayList 有两个非常重要的成员变量：`elementData` 和 `size`。

``` java
/**
 * Default initial capacity.
 * 默认初始容量
 */
private static final int DEFAULT_CAPACITY = 10;

/**
 * Shared empty array instance used for empty instances.
 */
private static final Object[] EMPTY_ELEMENTDATA = {};

/**
 * Shared empty array instance used for default sized empty instances. We
 * distinguish this from EMPTY_ELEMENTDATA to know how much to inflate when
 * first element is added.
 */
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

/**
 * The array buffer into which the elements of the ArrayList are stored.
 * The capacity of the ArrayList is the length of this array buffer. Any
 * empty ArrayList with elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA
 * will be expanded to DEFAULT_CAPACITY when the first element is added.
 */
transient Object[] elementData; // non-private to simplify nested class access

/**
 * The size of the ArrayList (the number of elements it contains).
 * ArrayList的大小（包含元素个数）
 * @serial
 */
private int size;
```

- `elementData` 是一个 Object 数组，存放的元素，正是外部需要存放到 ArrayList 的元素，即 ArrayList 对象维护着这个对象数组 Object[]，对外提供的增删改查以及遍历都是与这个数组有关，也因此添加到 ArrayList 的元素都是有序地存储在数组对象 `elementData`中。
- `size`字段表示着当前添加到 ArrayList 的元素个数，需要注意的是它必定小于等于数组对象`elementData`的长度。一旦`size`与`elementData`长度相同，并且还在往列表添加元素时，ArrayList 就会执行扩容操作，用一个更长的数组对象存储先前的元素。

因为底层维护的是一个对象数组，所以向 ArrayList 集合添加的元素自然是可以重复的，允许为 null 的，并且它们的索引位置各不一样。

### 如何扩容

上诉中，已经说到当 size 字段与 elementData 长度相同时，此时再添加元素到集合中就会出现容量不够的情况，需要进行扩容，也就是说 ArrayList 的扩容操作发生在添加方法中，并且满足一定条件时才会发生。

<img :src="$withBase('/img/java/container/ArrayList_20add.png')" alt="ArrayList_20add">

``` java
/**
 * Appends the specified element to the end of this list.
 * 向列表末尾追加元素
 * @param e element to be appended to this list
 * @return <tt>true</tt> (as specified by {@link Collection#add})
 */
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}
```

从上面可以看出第三行代码是简单地添加单个元素，并让 `size` 递增加 1；那么扩容实现就在 `ensureCapacityInternal` 方法中，这里传入参数为 `size`+1，就是要在真正添加元素前判断添加后的元素个数，也就是集合所需要的最小容量是否会超过原数组的长度。再看下这个 `ensureCapacityInternal` 方法实现。

``` java
private void ensureCapacityInternal(int minCapacity) {
    ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}
```

其内部仍有两个方法调用，首先看下比较简单的 `calculateCapacity` 方法：

``` java
private static int calculateCapacity(Object[] elementData, int minCapacity) {
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        return Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    return minCapacity;
}
```

当 `elementData` 与 `DEFAULTCAPACITY_EMPTY_ELEMENTDATA` 相等，也就是空数组时，返回一个可添加元素的默认最小容量值 `DEFAULT_CAPACITY` 对应的10 ，否则按照传入的 `size` +1 为最小容量值；执行完之后接着看 `ensureExplicitCapacity` 方法：

``` java
private void ensureExplicitCapacity(int minCapacity) {
    modCount++;

    // overflow-conscious code
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}
```

从代码中可以看到扩容实现在 `grow` 方法之中，并且只有当数组长度小于所需要的最小容量时执行：当数组存储元素已满，无法再存储将新加入的元素。

``` java
/**
 * Increases the capacity to ensure that it can hold at least the
 * number of elements specified by the minimum capacity argument.
 * 增加容量以确保它至少可以容纳最小容量参数指定的元素数。
 * @param minCapacity the desired minimum capacity
 */
private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    // 扩容 1.5 倍
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    if (newCapacity - minCapacity < 0) 
        // 扩容后都还小于minCapacity，说明当前数组为空
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

进一步跳转到 `grow` 方法的实现，可以看到第8行利用工具类方法 `java.util.Arrays#copyOf(T[], int)` ,对原有数组进行拷贝，将内部所有的元素存放到长度为 `newCapacity` 的新数组中，并将对应新数组的引用赋值给 `elementData`。此刻 ArrayList 内部引用的对象就是更新长度了的新数组，实现效果就如下图一样：

<img :src="$withBase('/img/java/container/ArrayList_20_u6269_u5BB91.png')" alt="ArrayList_20_u6269_u5BB91">

现在我们再来关注下代表数组新容量的 `newCapacity` 被调整为多少。首先 `newCapacity` 通过 `oldCapacity + (oldCapacity >> 1)` 计算获得，使用位运算将原容量值 `oldCapacity` 通过右移一位，获得其一半的值（向下取整）, 然后加上原来的容量值，那么就是原容量值 `oldCapacity` 的1.5倍。

当计算得到的`newCapacity`仍然小于传入最小容量时，说明当前数组个数为空，采用默认的`DEFAULT_CAPACITY`作为容量值分配数组。

数组默认最大值，`MAX_ARRAY_SIZE`定义如下：

``` java
/**
 * The maximum size of array to allocate.
 * Some VMs reserve some header words in an array.
 * Attempts to allocate larger arrays may result in
 * OutOfMemoryError: Requested array size exceeds VM limit
 */
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
```

当`newCapacity`大于`MAX_ARRAY_SIZE`时，执行方法`hugeCapacity` :

``` java
private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
    MAX_ARRAY_SIZE;
}
```

从`hugeCapacity`中可知，ArrayList 最大容量为`Integer.MAX_VALUE`，所以当存储元素个数超出这个限制时，就会产生`OutOfMemoryError`错误。

其实在其它添加元素的方法里实现我们都可以看到`ensureCapacityInternal`方法的调用，在真正操作底层数组前都会进行容量的确认，容量不够则进行动态扩容。

<img :src="$withBase('/img/java/container/ArrayList_23ensureCapacityIternal.png')" alt="ArrayList_23ensureCapacityIternal">

### 序列化与反序列化

``` java
/**
 * The array buffer into which the elements of the ArrayList are stored.
 * The capacity of the ArrayList is the length of this array buffer. Any
 * empty ArrayList with elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA
 * will be expanded to DEFAULT_CAPACITY when the first element is added.
 */
transient Object[] elementData; // non-private to simplify nested class access
```

通常`transient`关键字修饰的字段表示该字段不会被序列化，但是 ArrayList 实现了序列化接口，并且提供了序列化方法`writeObject`与反序列化`readObject`的实现，如下：

``` java
/**
 * Save the state of the <tt>ArrayList</tt> instance to a stream (that
 * is, serialize it).
 *
 * @serialData The length of the array backing the <tt>ArrayList</tt>
 *             instance is emitted (int), followed by all of its elements
 *             (each an <tt>Object</tt>) in the proper order.
 */
private void writeObject(java.io.ObjectOutputStream s)
    throws java.io.IOException{
    // Write out element count, and any hidden stuff
    int expectedModCount = modCount;
    // 将当前对象的非 static 修饰，非 transient 修饰的字段写出到流中
    s.defaultWriteObject();

    // Write out size as capacity for behavioural compatibility with clone()
    // 将 ArrayList 元素个数作为输出容量大小
    s.writeInt(size);

    // Write out all elements in the proper order.
    for (int i=0; i<size; i++) {
        s.writeObject(elementData[i]);
    }

    if (modCount != expectedModCount) {
        throw new ConcurrentModificationException();
    }
}
```

在反序列化中，现根据读进来的流数据中获取 size 属性，然后进行数组扩容，最后将数据流中读到的所有元素数据存放到特有的对象数组中。

``` java
/**
 * Reconstitute the <tt>ArrayList</tt> instance from a stream (that is,
 * deserialize it).
 */
private void readObject(java.io.ObjectInputStream s)
    throws java.io.IOException, ClassNotFoundException {
    elementData = EMPTY_ELEMENTDATA;

    // Read in size, and any hidden stuff
    s.defaultReadObject();

    // Read in capacity
    s.readInt(); // ignored

    if (size > 0) {
        // be like clone(), allocate array based upon size not capacity
        int capacity = calculateCapacity(elementData, size);
        SharedSecrets.getJavaOISAccess().checkArray(s, Object[].class, capacity);
        ensureCapacityInternal(size);

        Object[] a = elementData;
        // Read in all elements in the proper order.
        for (int i=0; i<size; i++) {
            a[i] = s.readObject();
        }
    }
}
```

### 关于拷贝

针对列表元素的拷贝，ArrayList 提供自定义的 clone 实现如下：

``` java
/**
 * Returns a shallow copy of this <tt>ArrayList</tt> instance.  (The
 * elements themselves are not copied.)
 * 返回此ArrayList实例的浅表副本。 （元素本身不会被复制。）浅拷贝
 * @return a clone of this <tt>ArrayList</tt> instance
 */
public Object clone() {
    try {
        ArrayList<?> v = (ArrayList<?>) super.clone();
        v.elementData = Arrays.copyOf(elementData, size);
        v.modCount = 0;
        return v;
    } catch (CloneNotSupportedException e) {
        // this shouldn't happen, since we are Cloneable
        throw new InternalError(e);
    }
}
```

从上述代码可以清楚看出执行的`copyOf`操作是一次浅拷贝操作，原 ArrayList 对象的元素不会被拷贝一份存入到新的 ArrayList 对象中返回，它们各自的字段`elementData`里各位置存放的都是一样的元素引用，一旦某个列表修改了数据，另一个列表也会跟着改变。

### JDK 1.8 后的 ArrayList

1. 新增 removeIf() 方法

   `removeIf()`是 Collection 接口新增的接口方法，ArrayList 由于父类实现该接口，所以也有这个方法。`removeIf()`方法用于进行指定条件的从数组中删除元素。
   
   ``` java
   @Override
   public boolean removeIf(Predicate<? super E> filter) {
      Objects.requireNonNull(filter);
      // figure out which elements are to be removed
      // any exception thrown from the filter predicate at this stage
      // will leave the collection unmodified
      int removeCount = 0;
      final BitSet removeSet = new BitSet(size);
      final int expectedModCount = modCount;
      final int size = this.size;
      for (int i=0; modCount == expectedModCount && i < size; i++) {
          @SuppressWarnings("unchecked")
          final E element = (E) elementData[i];
          if (filter.test(element)) {
              removeSet.set(i);
              removeCount++;
          }
      }
      if (modCount != expectedModCount) {
          throw new ConcurrentModificationException();
      }
   
      // shift surviving elements left over the spaces left by removed elements
      final boolean anyToRemove = removeCount > 0;
      if (anyToRemove) {
          final int newSize = size - removeCount;
          for (int i=0, j=0; (i < size) && (j < newSize); i++, j++) {
              i = removeSet.nextClearBit(i);
              elementData[j] = elementData[i];
          }
          for (int k=newSize; k < size; k++) {
              elementData[k] = null;  // Let gc do its work
          }
          this.size = newSize;
          if (modCount != expectedModCount) {
              throw new ConcurrentModificationException();
          }
          modCount++;
      }
   
      return anyToRemove;
   }
   ```
   
    传入一个代表条件的函数式接口参数`Predicate`，也就是 Lambda 表达式进行条件匹配，如果条件为 `true`，则将该元素从数组中删除，例：
   
   ``` java
   List<Integer> list = new ArrayList<>(Arrays.asList(1,3,5,1,5,6,4,5,8,45,2,5,5));
   list.removeIf(l -> l == 5);
   System.out.println(list); // [1, 3, 1, 6, 4, 8, 45, 2]
   ```

2. 新增 spliterator 方法

   这个方法也是来自 Collection 接口，ArrayList 对此方法进行了重写。该方法会返回 ListSpliterator 实例，该实例用于遍历和分离容器所存储的元素。

   ``` java
   /**
   * Creates a <em><a href="Spliterator.html#binding">late-binding</a></em>
   * and <em>fail-fast</em> {@link Spliterator} over the elements in this
   * list.
   *
   * <p>The {@code Spliterator} reports {@link Spliterator#SIZED},
   * {@link Spliterator#SUBSIZED}, and {@link Spliterator#ORDERED}.
   * Overriding implementations should document the reporting of additional
   * characteristic values.
   *
   * @return a {@code Spliterator} over the elements in this list
   * @since 1.8
   */
   @Override
   public Spliterator<E> spliterator() {
      return new ArrayListSpliterator<>(this, 0, -1, 0);
   }
   ```

   在 ArrayList 的实现中，改方法返回一个内部静态类对象 ArrayListSpliterator，通过它可以对集合元素进行操作。

   它的主要操作方法有：

   - `tryAdvance`迭代单个元素，类似于`iterator.next()`
   - `forEachRemaining`迭代剩余元素
   - `trySplit`将元素切分成为两部分并行处理，但需要注意 Spliterator 并不是线程安全的。

   虽然这三个方法并不常用，但还是有必要了解一下，使用案例：

   ``` java
   List<Integer> list = new ArrayList<>(Arrays.asList(1, 3, 5, 1, 5, 6, 4, 5, 8, 45, 2, 5, 5));
   
   Spliterator<Integer> spliterator = list.spliterator();
   // 迭代单个元素，类似于 iterator.next()
   spliterator.tryAdvance(System.out::println); // 1
   
   // 迭代剩余元素
   spliterator.forEachRemaining(o -> System.out.print(o + " ")); // 3 5 1 5 6 4 5 8 45 2 5 5
   
   // 将元素切分成为两部分并行处理
   Spliterator<Integer> trySplit = spliterator.trySplit();
   trySplit.forEachRemaining(o -> System.out.print(o + " ")); // 3 5 1 5 6 4
   spliterator.forEachRemaining(o -> System.out.print(o + " ")); // 5 8 45 2 5 5
   ```




### 高效初始化

ArrayList 实现了三个构造函数，默认创建时会分配到空数组对象`EMPTY_ELEMENTDATA`；第二个是传入一个集合类型数据进行初始化；第三个允许传入集合长度的初始化值，也就是数组长度。由于每次数组长度不够会导致扩容，重新申请更长的内存空间，并进行复制。而让我们初始化 ArrayList 指定数组初始大小，可以减少数组的扩容次数，提高性能。

``` java
 /**
  * Constructs an empty list with the specified initial capacity.
  *
  * @param  initialCapacity  the initial capacity of the list
  * @throws IllegalArgumentException if the specified initial capacity
  *         is negative
  */
public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {
        this.elementData = EMPTY_ELEMENTDATA;
    } else {
        throw new IllegalArgumentException("Illegal Capacity: "+ initialCapacity);
    }
}

/**
 * Constructs an empty list with an initial capacity of ten.
 */
public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

/**
 * Constructs a list containing the elements of the specified
 * collection, in the order they are returned by the collection's
 * iterator.
 *
 * @param c the collection whose elements are to be placed into this list
 * @throws NullPointerException if the specified collection is null
 */
public ArrayList(Collection<? extends E> c) {
    elementData = c.toArray();
    if ((size = elementData.length) != 0) {
        // c.toArray might (incorrectly) not return Object[] (see 6260652)
        if (elementData.getClass() != Object[].class)
            elementData = Arrays.copyOf(elementData, size, Object[].class);
    } else {
        // replace with empty array.
        this.elementData = EMPTY_ELEMENTDATA;
    }
}
```



### 元素遍历

JDK 1.8 前，ArrayList 只支持 3 种遍历方式：迭代器遍历，普通 for 循环，for-each 增强，在 JDK 1.8 引入了 Stream API 之后，同属于 Collection 集合的 ArrayList 可以使用 `stream.foreach()`方法一个个地获取元素：

``` java
ArrayList<String> names = new ArrayList<String>(Arrays.asList( "alex", "brian", "charles"));
names.forEach(name -> System.out.println(name)); // alex brian charles
```

### 转换 Array

ArrayList 提供两个方法用于列表向数组的转换

``` java
 /**
  * Returns an array containing all of the elements in this list
  * in proper sequence (from first to last element).
  *
  * <p>The returned array will be "safe" in that no references to it are
  * maintained by this list.  (In other words, this method must allocate
  * a new array).  The caller is thus free to modify the returned array.
  *
  * <p>This method acts as bridge between array-based and collection-based
  * APIs.
  *
  * @return an array containing all of the elements in this list in
  *         proper sequence
  */
public Object[] toArray() {
    return Arrays.copyOf(elementData, size);
}

/**
 * Returns an array containing all of the elements in this list in proper
 * sequence (from first to last element); the runtime type of the returned
 * array is that of the specified array.  If the list fits in the
 * specified array, it is returned therein.  Otherwise, a new array is
 * allocated with the runtime type of the specified array and the size of
 * this list.
 *
 * <p>If the list fits in the specified array with room to spare
 * (i.e., the array has more elements than the list), the element in
 * the array immediately following the end of the collection is set to
 * <tt>null</tt>.  (This is useful in determining the length of the
 * list <i>only</i> if the caller knows that the list does not contain
 * any null elements.)
 *
 * @param a the array into which the elements of the list are to
 *          be stored, if it is big enough; otherwise, a new array of the
 *          same runtime type is allocated for this purpose.
 * @return an array containing the elements of the list
 * @throws ArrayStoreException if the runtime type of the specified array
 *         is not a supertype of the runtime type of every element in
 *         this list
 * @throws NullPointerException if the specified array is null
 */
@SuppressWarnings("unchecked")
public <T> T[] toArray(T[] a) {
    if (a.length < size)
        // Make a new array of a's runtime type, but my contents:
        return (T[]) Arrays.copyOf(elementData, size, a.getClass());
    System.arraycopy(elementData, 0, a, 0, size);
    if (a.length > size)
        a[size] = null;
    return a;
}
```

1. 第一个方法直接返回 Object 类型数组
2. 在第二个方法中，返回数组的类型为所传入的指定数组的类型。并且如果列表的长度符合传入的数组，将元素拷贝到数组后并返回。否则，将根据传入数组的类型和列表的大小重新分配一个新数组，拷贝完成后返回。

从上述描述可以看出使用第二个方法更加合适，能保留原先的数据类型：

``` java
ArrayList<String> list = new ArrayList<>(4);
list.add("A");
list.add("B");
list.add("C");
list.add("D");

String[] array = list.toArray(new String[list.size()]);
System.out.println(Arrays.toString(array)); // [A, B, C, D]
```

### 应对多线程

ArrayList 本身是非线程安全的，如果需要使用线程安全的列表通常采用的方式是`java.util.Collections#synchronizedList(java.util.List<T>)` 或者 使用 Vector 类代替。还有一种方式是使用并发容器类`CopyOnWriteArrayList`在多线程中使用，它底层通过创建原数组的副本来实现更新，不仅线程安全，同时减少了对线程的同步操作。

### 应对头部节点的增删

ArrayList是数组实现的，使用的是连续的内存空间，当有需要在数组头部进行元素的添加或删除操作的时候，需要对目标元素以后的元素进行复制并重新排序，效率很低。针对有大量类似操作的场景，出于性能考虑，我们应该使用`LinkedList`代替。因为 LinkedList 是基于链表实现，当我们需要操作的目标元素处于整个链表的前半段时，可直接通过遍历的方式查询目标元素，然后进行元素的增删操作。
