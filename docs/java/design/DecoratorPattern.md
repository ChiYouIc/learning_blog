---
title: 装饰模式
sidebar: auto
date: 2021-04-05
categories:
 - 设计模式
tags:
 - DesignPattern
---

装饰模式（Decorator Pattern）是一种比较常见的模式，其定义如下：Attach additional responsibilities to an object dynamically keeping the same interface.Decorators provide a flexible alternative to subclassing for extending functionality.（动态地给一个对象添加一些额外的职责。就增加功能来说，装饰器模式相比生成子类更为灵活。）


## 装饰模式的通用类图

<img :src="$withBase('/img/java/design/DecoratorPattern类图.png')" alt="DecoratorPattern类图">

在类图中，有四个角色需要说明：

* Component 抽象构件

  Component 是一个接口或者是抽象类，就是定义最核心的对象，也就是最原始的对象。

  ::: warning 注意

  在装饰模式中，必然后一个最基本、最核心、最原始的接口或抽象类充当 Component 抽象构件。

  :::

* ConcreteComponent 具体构件

  ConcreteComponent 是最核心、最原始、最基本的接口或抽象类的实现，它就是你要装饰的对象。

* Decorator 装饰角色

  一般是一个抽象类，用于实现接口或者抽象方法，该类里面不一定存在存在抽象方法，但是一定存在一个 private 修饰的属性指向 Component 抽象构件。

* 具体装饰角色

  ConcreteDecorator 是具体的装饰类，在这个类中你可把最核心、最原始、最基本的东西进行装饰。

装饰模式的所有角色已经介绍完毕，下面来看看如何实现，先看抽象构件，如下：

``` java
public interface Component {
    /**
	 * 抽象方法
	 */
    public void operation();
}
```

具体构件代码如下：

``` java
public class ConcreteComponent implements Component {
	/**
	 * 具体实现
	 */
	@Override
	public void operation() {
		// 业务逻辑
	}
}
```

装饰角色通常是一个抽象类，代码如下：

``` java
public abstract class Decorator implements Component {

	private Component component;

	/**
	 * 通过构造函数传递被修饰者
	 */
	public Decorator(Component component) {
		this.component = component;
	}

	/**
	 * 执行被装饰者
	 */
	@Override
	public void operation() {
		this.component.operation();
	}
}
```

如果你的设计中只有一个装饰类，则可以没有这个抽象的装饰角色，直接实现具体的装饰角色即可，代码如下：

``` java
public class ConcreteDecorator extends Decorator {
	public ConcreteDecorator(Component component) {
		super(component);
	}

	/**
	 * 定义自己的装饰方法
	 */
	public void decorateMethod() {
		// 装饰业务
	}

	/**
	 * 重写父类的 operation 方法，加入自己定义的装饰方法
	 */
	@Override
	public void operation() {
		this.decorateMethod();
		super.operation();
	}
}
```

::: warning 注意

原始方法和装饰方法的执行顺序在具体的装饰类里是固定的，可以通过方法重载实现多种执行顺序。

:::

我们通过 Clinet 类来模式高层模块的耦合关系，看看装饰模式是如何运行的，代码如下：

``` java
public class Client {
    public static void main(String[] args) {
        Component component = new ConcreteComponent();
        // 第一次修饰
        component = new ConcreteDecorator(component);
        // 第二次修饰(可根据需要创建多个装饰器)
        // component = new ConcreteDecorator(component);
        // 修饰后运行
        component.operate();
    }
}
```



## 装饰模式的优点

* 装饰类和被装饰类可以独立发展，而不会相互耦合。换句话说，Component 类无须知道 Decorator 类，Decorator 类是从外部来扩展 Component 类的功能，而 Decorator 也不用知道具体的构件；
* 装饰模式是继承关系的一种替代方案。从上面的通用代码中，可以看出作为装饰类的 Decorator，不管装饰多少层，返回的对象还是 Component，实现的还是 is-a 的关系；
* 装饰模式可以动态地扩展一个实现类的功能，这不需要过多的解释，装饰模式的定义就是如此。



## 装饰模式的缺点

对于装饰模式记住一点就足够了：多层的装饰是比较复杂的。如果一个构件被过多装饰之后，在增加我们开发调试工作。这就好比剥洋葱一样，一层一层的剥下去，结果剥到最后的时候才发现是最里层的装饰器出了问题，这对于程序调试绝对是一个噩梦。因此，在实际使用当中，尽量的减少单个构件的装饰类的数据，从而降低系统的复杂度。



## 装饰模式的使用场景

* 需要扩展一个类的功能，或给一个类增加附加功能；
* 需要动态地给一个对象增加功能，这些功能可以再动态地撤销；
* 需要为一批的兄弟类进行改装或加装功能，当然是首选装饰模式。



## 最佳实践

装饰模式是对继承的有力补充。要知道继承不是万能的，继承可以解决实际的问题，但是在项目中我们是需要考虑诸如易维护、易扩展、易复用等，而且在一些情况下使用继承会增加很多子类，而且灵活性非常差，维护难度也会增加，而装饰模式恰好可以代替这种继承场景，解决类膨胀的问题。

装饰模式还有一个非常好的优点：扩展性非常好。在一个项目中，你会有非常多的因素考虑不到，特别是业务的变更，不时地冒出一个需求，尤其是提出一个可以让项目严重推迟的需求时，往往是令人非常难受的！在这方面，装饰模式可以给我们提供很好的帮助，通过装饰模式重新封装一个类。举个例子，有三个继承关系 Father、Son、GrandSon 三个类，现在需要对 Son 类进行增强，应该怎么做呢？继承吗？不行，这里使用继承的方式进行增强会影响原有的继承关系，直接修改 Son 类吗？那问题又来了，对于增强，是需要进行修改 Son 类的某个方法，还是增加某些功能呢？这类问题放到实际项目中，光是工作量评估都是一件令人头大的事，在此类情况下，巧妙的使用装饰模式，通过建立一个 SonDecorator 类修饰 Son，相当于创建了一个新的类，在不影响原有的继承关系下，完成了 Son 类的增强。

> 摘自：《设计模式之禅》(第 2 版)
