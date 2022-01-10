---
title: 迭代器模式
sidebar: auto
date: 2022-01-10
categories:
 - 设计模式
tags:
 - DesignPattern
---

迭代器模式（Iterator Pattern）目前已经是一个没落的模式，基本上没有人会单独写一个迭代器，除非是产品性值的开发，其定义如下：

Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.（它提供一种方法访问一个容器对象中各个元素，而又不需要暴露该对象的内部细节。）

迭代器是为容器服务的，那什么是容器呢？能容纳对象的所有类型都可以称之为容器，例如 Collection 集合类型、Set 类型等，迭代器模式就是为解决遍历这些容器中的元素而诞生的。

## 迭代器模式的通用类图

<img :src="$withBase('/img/java/design/IteratorPattern.png')" alt="IteratorPattern类图" />

迭代器模式提供了遍历容器的方便性，容器只要管理增减元素就可以了，需要遍历时交由迭代器进行。迭代器模式正是由于使用得太频繁，所以大家才会忽略。

* Iterator 抽象迭代器

  抽象迭代器负责定义访问和遍历元素的接口，而且基本上是有固定的 3 个方法：

  - `first()` 获取第一个元素
  - `next()` 访问下一个元素
  - `isDone()` 是否已经访问到底部（Java 叫做 hashNext() 方法）

  ``` java
  public abstract class Iterator<E> {
  
  	/**
  	 * 遍历获取下一个元素
  	 */
  	public abstract E next();
  
  	/**
  	 * 是否已经遍历到尾部
  	 */
  	public abstract boolean hashNext();
  
  	/**
  	 * 删除当前指向的元素
  	 */
  	public abstract boolean remove();
  
  }
  ```

  

* ConcreteIterator 具体迭代器

  具体迭代器角色要实现迭代器接口，完成容器元素的遍历。

  ``` java
  public class ConcreteIterator extends Iterator<Object> {
  	private final Vector<Object> vector;
  
  	/**
  	 * 定义当前游标
  	 */
  	public int cursor = 0;
  
  	public ConcreteIterator(Vector<Object> vector) {
  		this.vector = vector;
  	}
  
  	@Override
  	public Object next() {
  		if (this.hashNext()) {
  			return this.vector.get(this.cursor);
  		}
  		return null;
  	}
  
  	@Override
  	public boolean hashNext() {
  		return this.cursor != this.vector.size();
  	}
  
  	@Override
  	public boolean remove() {
  		this.vector.remove(this.cursor);
  		return true;
  	}
  }
  ```

  

* Aggregate 抽象容器

  容器角色负责提供创建具体迭代器角色的接口，必然提供一个类似 `createIterator()` 这样的方法，在 Java 中一般是 `iterator()` 方法。

  ``` java
  public abstract class Aggregate<E> {
  	/**
  	 * 向容器内添加元素
  	 */
  	public abstract void add(E e);
  
  	/**
  	 * 减少元素
  	 */
  	public abstract void remove(E e);
  
  	/**
  	 * 由迭代器来遍历所有的元素
  	 */
  	public abstract Iterator iterator();
  }
  ```

  

* ConcreteAggregate 具体容器

  具体容器实现容器接口定义的方法，创建出容纳迭代器的对象。

  ``` java
  public class ConcreteAggregate extends Aggregate<Object> {
  
  	private final Vector<Object> vector = new Vector<Object>();
  
  	@Override
  	public void add(Object o) {
  		vector.add(o);
  	}
  
  	@Override
  	public void remove(Object o) {
  		this.vector.remove(o);
  	}
  
  	@Override
  	public Iterator<Object> iterator() {
  		return new ConcreteIterator(this.vector);
  	}
  }
  ```

简单的说，迭代器就类似于一个数据库中的游标，可以在一个容器内上下翻滚，遍历所有它需要查看的元素。

## 迭代器模式的应用

Java 从 JDK 1.2 版本开始增加了 java.util.Iterator 这个接口，并逐步把 Iterator 应用到各个聚集类（Collection）中，从 JDK 1.5 的 API 帮助文件中可以找到一个叫 java.util.Iterable 接口，并且有很多的接口继承了它：

- BeanContext
- BeanContextServices
- BlockingQueue\<E\>
- Collection\<E\>
- List\<E\>
- Queue\<E\>
- Set\<E\>
- SortedSet\<E\>

实现类：

- AbstractCollection
- AbstractList
- AbstractQueue
- AbstractSequentialList
- AbstractSet
- ArrayBlockingQueue
- ArrayList
- AttributeList
- BeanContextServicesSupport
- BeanContextSupport
- ConcurrentLinkedQueue
- CopyOnWriteArrayList
- CopyOnWriteArraySet
- DelayQueue
- EnumSet
- HashSet
- JobStateReasons
- LinkedBlockingQueue
- LinkedHashSet
- LinkedList
- PriorityBlockingQueue
- PriorityQueue
- RoleList
- RoleUnresolvedList
- Stack
- SynchronousQueue
- TreeSet
- Vector

基本上我们经常使用的类都在上述列表中了，也正是因为 Java 把迭代器模式已经融入到了基本 API 中，我们才能如此轻松、便捷。

java.util.Iterable 接口只有一个方法：iterator()，也就是说，通过 iterator() 方法去遍历聚集类中的所有方法或属性，基本上现在所有的高级语言都有 Iterator 这个接口或者实现，Java 已经把迭代器给我准备好了，我们再去写迭代器，就有些多余了。所以，迭代器模式也有些没落了，基本上很少有项目再独立写迭代器了，直接使用 Collection 下的实现类就可以完美地解决问题。

> 摘自：《设计模式之禅》(第 2 版)
