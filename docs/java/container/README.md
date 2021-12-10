---
title: 集合框架
sidebar: auto
date: 2021-11-26
categories:
 - container 容器
tags:
 - Collections
---

## 接口继承关系和实现

* Iterable 接口：提供迭代器访问能力，实现此接口允许对象通过 for-each 循环语句进行遍历。
* Collection 接口：集合层次结构中的根接口。集合中的一组对象称为元素。一些集合允许重复的元素，而另一些则不允许。有些是有序的，而另一些是无序的。 JDK 不提供此接口的任何直接实现，它提供了更多特定子接口的实现，例如 Set 和 List 。该接口通常用于传递集合并在需要最大通用性的地方使用。
* AbstractCollection 抽象类：此类提供了 Collection 接口的基本实现，以最大程度地减少实现此接口所需的工作。

* List 接口：Collection 接口的子接口，有序集合（也称为序列）。用户通过该接口可以精确控制列表中每个元素的插入位置。用户可以通过其整数索引（集合中的位置）访问元素，并在其中搜索元素。

* AbstractList 抽象类： 此类提供 List 接口的基本实现以最大程度地减少由“随机访问”数据存储（例如数组） 实现此接口所需的工作。

* AbstractSequentialList 抽象类：此类提供了 List 接口的基本实现，以最大程度地减少由“顺序访问”数据存储（例如集合）实现此接口所需的工作。对于随机访问数据（例如数组），应优先使用 AbstractList 类。

* Queue 接口：设计用于在处理之前容纳元素的集合。 除了基本的 Collection 接口操作之外，队列还提供其他插入，提取和检查操作。这些方法都以两种形式存在：一种在操作失败时引发异常，另一种返回特殊的值（取决于操作， null 或 false）。插入操作的后一种形式是专为容量受限的 Queue 实现而设计的；在大多数实现中，插入操作不会失败。

* Deque 接口：支持在两端插入和删除元素的线性集合。名称 Deque 是“双端队列”的缩写，通常发音为“deck”。大多数Deque 的实现都对元素可能包含的元素数量没有固定的限制，但是此接口支持容量受限的双端队列以及没有固定大小限制的双端队列。

* Cloneable 接口：该标记接口提供实例克隆的的能力。

* Serializable 接口：该标记接口提供类序列化或反序列化的能力。

<img :src="$withBase('/img/java/container/container_dependency.png')" alt="容器依赖图">



## List

Java 的 List 是非常常用的数据类型。List 是有序的 Collection。Java List 一共三个实现类：分别是 ArrayList、Vector 和 LinkedList。

### ArrayList（数组）

ArrayList 是最常用的 List 实现类，内部是通过数组实现的，它允许对元素进行快速随机访问。数组的缺点是每个元素之间不能有间隔，当数组大小不满足时需要增加存储空间，就需要将已经有数据的数组复制到新的存储空间中。当从 ArrayList 的中间位置插入或者删除元素时，需要对数组进行复制、移动，代价比较大。因此，它适合随机查找和遍历，不适合插入和删除。

### Vector（数组实现、线程同步）

Vector 与 ArrayList 一样，也是通过数组实现的，不同的是它支持线程的同步，即某一时刻只有一个线程能够写，避免多线程同时写而导致的读写不一致的情况，但实现同步需要花费很高的代价，因此，访问 Vector 比访问 ArrayList 要慢。

### LinkedList（链表）

LinkedList 是用链表结构存储数据的，很适合数据的动态插入和删除，随机访问和遍历的速度就比较慢。另外，它还提供了 List 接口中没有定义的方法，专门用来操作表头和表位元素，可以当作堆栈、队列和双向队列使用。

## Set

Set 注重独一无二的性质，该体系集合用于存储无序（存入和取出顺序不一定相同）元素，值不能重复。对象的相等性本质是对象 hashCode 值（Java 是依据对象的内存地址计算出此序号）判断的，如果想要让两个不同对象视为相等的，就必须覆盖 Object 的 hashCode 方法和 equals 方法。

### HashSet（Hash 表）

哈希表存放的是哈希值。HashSet 存储元素的顺序并不是按照存入时的顺序（和 List 显然不同）而是按照哈希值来存的，所以取数据也是按照 Hash 值取的。元素的哈希值是通过元素的 hashCode() 方法获的。HashSet 首先判断两个元素的哈希值，如果哈希值一样，接着会比较 equals 方法，如果 equals 方法结果为 true，HashSet 就视为同一个元素。如果 equals 为 false 就不是同一个元素。

哈希值相同 equals 为 false 的元素是怎么存储的呢？就是在相同的哈希值下顺延（可以认为哈希值相同的元素存放在同一个哈希桶中）。也就是哈希值一样的存在同一列中。如下图所示，A 表示的是所有元素的哈希值都不同的情况；B 表示各元素的哈希值相同的情况。

<img :src="$withBase('/img/java/container/hashSet_save.png')" alt="HashSet存储">

HashSet 通过 hashCode 值来确定元素在内存中的位置。一个 hashCode 位置上可以存放多个元素。

### LinkedHashSet（HashSet + LinkedHashMap）

对于 LinkedHashSet 而言，它是继承 HashSet、基于 LinkedHashMap 来实现的。LinkedHashSet 底层使用 LinkedHashMap 来保护所有元素，由于继承 HashSet，其所有的方法操作上又与 HashSet 相同，因此 LinkedHashSet 的实现非常简单，它只提供了四个构造方法，并通过传递一个标识参数，调用父类的构造器，在底层构造一个 LinkedHashMap 来实现。

### TreeSet（二叉树）

TreeSet 是使用二叉树的原理对 add() 的对象按照指定的顺序排序（升序、降序），每增加一个对象就会进行排序，将对象插入到二叉树指定的位置。

Integer 和 String 对象都可以进行默认的 TreeSet 排序，而自定义的对象是不可以的，自定义的类必须实现 Comparable 接口，并且覆盖相应的 compareTo() 方法，才可以正常使用。

在覆写 compareTo() 方法时，要返回相应的值才能使 TreeSet 按照一定的规则来排序。

比较此对象与指定对象的顺序。如果该对象小于、等于或大于指定对象，则分别返回负整数、零或正整数。

