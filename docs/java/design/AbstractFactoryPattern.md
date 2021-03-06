---
title: 抽象工厂模式
sidebar: auto
date: 2021-04-03
categories:
 - 设计模式
tags:
 - DesignPattern
---

抽象工厂模式（Abstract Factory Pattern）是一种比较常用的模式，其定义如下：

Provide an interface for creating families of related or dependent objects without specifying their concrete classes.（为创建一组相关或相互依赖的对象提供一个接口，而且无须指定它们的具体类。）



## 抽象工厂模式的通用类图

<img :src="$withBase('/img/java/design/AbstractFactory类图.png')" alt="AbstractFactory类图">

抽象工厂模式是工厂方法模式的升级版本，在有多个业务品种、业务分类时，通过抽象工厂模式产生需要的对象是一种非常好的解决方式。我们来看看抽象工厂的通用源代码，首先有两个互相影响的产品线（也叫做产品族），例如制造汽车的左侧们和右侧们，这两个应该是数量相等的 - - 两个对象之间约束，每个型号的车门都是不一样的，这是产品等级结构约束的，我们先看看两个产品族的类图：

<img :src="$withBase('/img/java/design/AbstractFactory通用源码类图.png')" alt="AbstractFactory通用源码类图">

注意类图上的圈圈、框框相对应，两个抽象的产品类可以有关系，例如共同继承或实现一个抽象类或接口，其源代码如下：

``` java
public abstract class AbstractProductA {

	public void shareMethod() {
		// 工共方法
	}

	/**
	 * 相同业务，不同实现
	 */
	public abstract void doSomething();

}
```

两个具体的产品类代码：

``` java
public class ProductA1 extends AbstractProductA {
	@Override
	public void doSomething() {
		// 产品A1的业务
	}
}
```

``` java
public class ProductA2 extends AbstractProductA {
	@Override
	public void doSomething() {
		// 产品A2的业务
	}
}
```

产品 B 与上述一样，代码如下：

``` java
public abstract class AbstractProductB {

	public void shareMethod() {
		// 工共方法
	}

	/**
	 * 相同业务，不同实现
	 */
	public abstract void doSomething();
}
```

``` java
public class ProductB1 extends AbstractProductB {
	@Override
	public void doSomething() {
		// 产品A1的业务
	}
}
```

``` java
public class ProductB2 extends AbstractProductB {
	@Override
	public void doSomething() {
		// 产品A2的业务
	}
}
```

抽象工厂类 AbstractCreator 的职责是定义每个工厂要实现的功能，在通用代码中，抽象工厂定义了两个产品族的产品创建，代码如下：

``` java
public abstract class AbstractCreator {
	/**
	 * 创建 A 产品对象
	 */
	public abstract AbstractProductA createProductA();

	/**
	 * 创建 B 产品对象
	 */
	public abstract AbstractProductB createProductB();
}

```

::: warning 注意

有 N 个产品族，在抽象工厂中就应该有 N 个创建方法。

:::



如何创建一个产品，则是由具体的实现类来完成的，Creator1 和 Creator2，代码如下：

``` java
public class Creator1 extends AbstractCreator {
	@Override
	public AbstractProductA createProductA() {
		return new ProductA1();
	}

	@Override
	public AbstractProductB createProductB() {
		return new ProductB1();
	}
}
```

``` java
public class Creator2 extends AbstractCreator {
	@Override
	public AbstractProductA createProductA() {
		return new ProductA2();
	}

	@Override
	public AbstractProductB createProductB() {
		return new ProductB2();
	}
}
```

::: warning 注意

有 M 个产品等级就应该有 M 个实现工厂类，在每个实现工厂中，实现不同产品族的生产任务。

:::



在具体的业务中如何产生一个与实现无关的对象呢？如下：

``` java
public class Client {
	public static void main(String[] args) {
		//定义出两个工厂
		AbstractCreator creator1 = new Creator1();
		AbstractCreator creator2 = new Creator2();
		//产生A1对象
		AbstractProductA a1 =  creator1.createProductA();
		//产生A2对象
		AbstractProductA a2 = creator2.createProductA();
		//产生B1对象
		AbstractProductB b1 = creator1.createProductB();
		//产生B2对象
		AbstractProductB b2 = creator2.createProductB();
		/*
		 * 然后在这里就可以为所欲为了...
		 */
	}
}
```

在场景类 Client 中，没有任何一个方法与实现类有关系，对于一个产品来说，我们只要知道它的工厂方法就可以直接产生一个产品对象，无须关心它的实现类。



## 抽象工厂模式的优点

* `封装性`，每个产品的实现类不是高层模块要关心的，他要关心的是什么？是接口，是抽象，它不关心对象是如何创建出来的，这由谁负责呢？工厂类，只要知道工厂类是谁，就能创建出一个需要的对象，省时省力，优秀设计就应该如此。
* `产品族内的约束为非公开状态`。例如在生产汽车的时候，汽车的座椅和座椅皮套是成对出现的，映射到抽象工厂模式，就应该有这么一个约束：没生产一个汽车座椅就应该生产一个皮套、座垫等，这样的胜场过程对调用工厂类的高层模块来说是透明的，它不需要知道这个约束，高层模块只需要知道自己要的是什么，而具体的产品族内部的约束、生产过程等在工厂内实现。



## 抽象工厂模式的缺点

抽象工厂模式的最大缺点就是产品族扩展非常困难，为什么这么说呢？就用通用代码为例，如果需要增加一个产品族 C，也就是说产品家族由原来的 2 个增加到 3 个，我们的程序的改动是比较大的。抽象类 `AbstractCreator` 要增加一个方法 CreateProductC()，然后两个实现类都要修改，想想看，这严重违反了 `开闭原则`，而且我们一直在说 `抽象类和接口是一个契约`。改变契约，所有与契约有关系的代码都要修改，那么这段代码叫什么？叫“有毒代码”，只要与这段代码有关系，就可能产生侵害的危险！



## 抽象工厂模式的使用场景

抽象工厂模式的使用场景定义非常简单：`一个对象族（或是一组没有任何关系的对象）都有相同的约束，则可以使用抽象工厂模式`。什么意思呢？例如一个文本编辑器和一个图片编辑器，都是软件实体，但是 liunx 下的文本编辑器和 windows 下的文本编辑器虽然功能和界面都相同，但是代码实现是不同的，图片处理器也有类似的情况。也就是具有了共同的约束条件：`操作系统类型`。于是我们可以使用抽象工厂模式，生产不同操作系统下的编辑器和图片处理器。



## 抽象工厂模式的注意事项

在抽象工厂模式的缺点中，我们提到抽象工厂模式的产品族扩展比较困难，但是一定要清楚，是产品族扩展困难，而不是产品等级。在该模式下，产品等级是非常容易扩展的，增加一个产品等级，只要增加一个工厂类负责新增加出来的产品生产任务即可。也就是说 `横向扩展容易，纵向扩展困难`。还以上述的文本编辑器与图片编辑器为例，产品族为 `文本编辑器` 和 `图片编辑器`，产品等级为 `操作系统`，如果这些软件需要运行到 Android 系统上时（新增一个产品等级），我们只需要扩展出一个新的工厂即可，由该工厂生产可运行在 Android 系统上的文本编辑器与图片编辑器即可；这种方式是完全通过扩展来实现需求的变更，从这一点来看，抽象工厂是符合开闭原则的。



## 总结

一个模式在什么情况下才能够使用，是很多开发者比较困惑的地方。抽象工厂模式是一个简单的模式，使用场景非常多，大家在软件产品开发过程中，涉及不同操作系统的时候，都可以考虑使用抽象工厂模式，例如一个应用，需要在三个不同平台（Windows、Liunx、Android）上运行，应该如何设计？设计三套不同的应用？并不是，通过抽象工厂模式屏蔽操作系统对应用的影响。三个不同操作系统上的软件功能、引用逻辑、UI 都应该是非常类似的，唯一不同的是调用不同的工厂方法，由不同的产品类去处理与操作系统交互的信息（将应用与操作系统的交互进行封装）。

> 摘自：《设计模式之禅》(第 2 版)
