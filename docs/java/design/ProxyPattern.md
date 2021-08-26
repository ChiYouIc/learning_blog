---
title: 代理模式
sidebar: auto
date: 2021-04-11
categories:
 - 设计模式
tags:
 - DesignPattern
---

代理模式（Proxy Pattern）是一个使用率非常高的模式，其定义如下：

Provide a  surrogate or placeholder for another object to control access to it.（为其他对象提供一种代理以控制对这个对象的访问。）

## 代理模式的通用类图

<img :src="$withBase('/img/java/design/ProxyPattern类图.png')" alt="ProxyPattern类图">

代理模式也叫做委托模式，它是一项基本设计技巧。许多其它的模式，如状态模式、策略模式、访问者模式本质上是在更特殊的场合采用了委托模式，而且在日常的应用中，代理模式可以提供非常好的访问控制。在一些著名的开源软件中也经常见到它的身影，如 Struct2 的 Form 元素映射就采用了代理模式（准确的说是动态代理模式）。我们先来看一下类图中的三个角色的定义：

* Subject 抽象主题角色：抽象主题类可以是抽象类也可以是接口，是一个最普通的业务类型定义，无特殊要求。
* RealSubject 具体主题角色：也叫做被委托角色、被代理角色。他才是冤大头，是业务逻辑的执行者。
* Proxy 代理主题角色：也叫做委托类、代理类。它负责对真实角色的应用，把所有抽象主题类定义的方法限制委托给真实主题角色实现，并且在真实主题角色处理完毕前后做预处理和善后处理工作。

下面先来看看 Subject 抽象主题类的通用源码：

``` java
public interface Subject {
	/**
	 * 定义一个方法
	 */
	public void request();
}
```

在接口中我们定义了一个方法 request() 来作为方法的代表，RealSubject 对它进行实现，如下：

``` java
public class RealSubject implements Subject {
	/**
	 * 实现方法
	 */
	@Override
	public void request() {
		// 业务逻辑处理
	}
}
```

RealSubject 是一个正常的业务实现类，代理模式的核心就在代理类上，如下：

``` java
public class Proxy implements Subject {

	/**
	 * 被代理目标
	 */
	private Subject subject = null;

	/**
	 * 默认被代理者
	 */
	public Proxy() {
		this.subject = new Proxy();
	}

	/**
	 * 通过构造函数传递代理者
	 *
	 * @param objects
	 */
	public Proxy(Object... objects) {
	}

	/**
	 * 实现接口定义的方法
	 */
	@Override
	public void request() {
		this.before();
		this.subject.request();
		this.after();
	}

	/**
	 * 预处理
	 */
	public void before() {
		// do something
	}

	/**
	 * 善后处理
	 */
	public void after() {
		// do something
	}
}
```

一个代理类可以代理多个被委托者或被代理者，因此一个代理类具体代理哪个真实主题角色，是由场景类决定的。当然，最简单的情况就是一个主题类和一个代理类，这是最简洁的代理模式，在通常情况下，一个接口只需要一个代理类就可以了，具体代理哪个实现类由高层模块来决定，也就是在代理类的构造函数中传递被代理者，例如我们可以在代理类 Proxy 中增加如下代码：

``` java
/**
 * 通过参数获取被代理对象
 *
 * @param subject 被代理对象
 */
public Proxy(Subject subject) {
    this.subject = subject;
}
```

这样，你需要代理谁就生产该代理的实例，然后把被代理者传递进来，该模式在实际的项目应用中比较广泛。

## 代理模式的优点

* 职责清晰：真实的角色就是实现实际的业务逻辑，不用关心其它非本职责的事务，通过后期的代理完成一件事务，附带的结果就是编程简洁清晰。
* 高扩展性：具体主题角色是随时都会发生变化的，只要它实现了对应的接口，无论怎么变化，都是在接口定义的范围内变化，所以我们的代理完全可以在不做任务修改的情况下去支撑具体主题角色的变化。
* 智能化：这在我们以上的讲解中还没有体现出来，不过在后面的[动态代理模式](./DynamicProxyPattern.md)章节中就会看到代理的智能化。

## 代理模式的使用场景

我相信第一次接触到代理模式的读者肯定很郁闷，为什么要用代理呀？想想现实世界吧，打官司为什么要找个律师？因为你不想参与中间过程的是是非非，只要完成自己的答辩就成，其他的比如事前调查、事后追查都由律师来搞定，这就是为了减轻你的负担。代理模式的使用场景非常多，大家可以看看Spring AOP，这是一个非常典型的动态代理；还有 Spring 中的事务、日志等，都是通过代理的方式去处理的。

## 总结

代理模式应用得非常广泛，大到一个系统架构、企业平台，小到代码片段、事务处理，稍不留意就用到代理模式。可能该模式是大家接触最多的模式，而且有了 AOP 大家写代理就更加简单了，有类似 Spring AOP 和 AspectJ 这样非常优秀的工具，开箱即用。

::: tip 友情提示

在学习 AOP 框架时，需要搞清楚几个名词：切面（Aspect）、切入点（JoinPoint）、通知（Advice）、织入（Weave），掌握了这几个词的含义，使用 AOP 时就可以游刃有余了。

:::

> 摘自：《设计模式之禅》(第 2 版)
