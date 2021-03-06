---
title: 工厂方法模式
sidebar: auto
date: 2021-04-08
categories:
 - 设计模式
tags:
 - DesignPattern
---

工厂方法模式使用的频率非常高，在日常开发中也总能见到它的身影。其定义为：

Define an interface for creating an object, but let subclasses decide which class to instantiate. Factory Method lets a class defer instantiation to subclasses.（定义一个用于创建对象的接口，让子类决定实例化哪一个类。工厂方法使一个类的实例化延迟到其子类。）

## 工厂方法模式的通用类图

<img :src="$withBase('/img/java/design/FactoryMethod类图.png')" alt="FactoryMethod类图">

在工厂方法模式中，抽象产品类 `AbstractProduct` 负责定义产品的共性，实现对事物最抽象的定义；`AbstractCreator` 为抽象创建类，也就是抽象工厂，具体如何创建产品类是由具体的实现工厂 ConcreteCreator 完成的。工厂方法模式的变种较多，下面展示一个比较通用的工厂方法源码。

### 抽线产品类

``` java
public abstract class AbstractProduct {
	/**
	 * 产品类的公共方法
	 */
	public void publicMethod() {
		// 业务逻辑
	}

	/**
	 * 抽象方法
	 */
	public abstract void serviceMethod();
}
```

### 产品类

``` java
public class ConcreteProduct1 extends AbstractProduct {
	@Override
	public void serviceMethod() {
		// 业务逻辑
	}
}
```

``` java
public class ConcreteProduct2 extends AbstractProduct {
	@Override
	public void serviceMethod() {
		// 业务逻辑处理
	}
}
```

具体的产品类往往不是只有一个，但都继承于抽象产品类。

### 抽象工厂类

``` java
public abstract class AbstractCreator {
	/**
	 * 创建一个产品对象，其输入参数类型可以自行设置，通常为 String、Enum、Class 等，当然也可以为空
	 */
	public abstract <T extends AbstractProduct> T createProduct(Class<T> tClass);
}
```

抽象工厂类负责定义对象的产生，如何产生一个产品的对象，是具体的工厂类实现的。

### 具体工厂类

``` java
public class ConcreteCreator extends AbstractCreator {
	@Override
	public <T extends AbstractProduct> T createProduct(Class<T> tClass) {
		T product = null;
		try {
			product = (T) Class.forName(tClass.getName()).newInstance();
//			product = tClass.newInstance();
		} catch (Exception e) {
			// 异常处理
		}
		return product;
	}
}
```

该通用代码是一个比较实用、易扩展的架构，可在实际项目中根据需要进行扩展。



## 工厂方法模式的优点

首先，良好的封装性，代码结构清晰。一个对象的创建是有条件约束的，如一个调用者需要一个具体的产品对象，只要知道这个产品的类名（或约束字符串）就可以了，不用知道创建对象的艰辛过程，降低模块间的耦合。

其次，工厂方法模式的扩展性非常优秀。在增加产品类的情况下，只要适当地修改具体的工厂类或扩展一个工厂类，就可以完成“拥抱变化”。

再次，屏蔽产品类。这一特点非常重要，产品类的实现如何变化，调用者都不需要关心，只要接口保持不变，系统中的上层模块就不要发生变化。因为产品类的实例化工厂是由工厂类负责的，一个产品对象具体由哪一个产品生成是由工厂类决定的。在数据开发中，就能深刻体会到工厂方法模式的好处：如果使用 JDBC 连接数据库，数据库从 MySQL 切换到 Oracle，需要改动的地方就是切换一下驱动名称（前提条件是标准 SQL 语句），其他的都不需要修改，这是工厂方法模式灵活的一个直接案例。

最后，工厂方法模式是典型的解耦框架。高层模块值需要知道产品的抽象类，其他的实现类都不用关心，符合迪米特法则，不需要的就不要去交流；也符合依赖倒置原则，只依赖产品类的抽象；当然也符合里氏替换原则，使用产品子类替换产品父类。



## 工厂方法模式的使用场景

首先，工厂方法模式是 new 一个对象的替代品，所以在所有需要创建对象的地方都可以使用，但是需要慎重地考虑是否要增加一个工厂类进行管理，增加代码的复杂度。

其次，需要灵活的、可扩展的框架时，可以考虑采用工厂方法模式。万物皆对象，那万物也就是皆产品类；例如设计一个连接邮件服务器的框架，有三种网络协议可供选择：POP3、IMAP、HTTP，我们就可以把这三种连接方法作为产品类，定义一个如 IConnectMail，然后定义对邮件的操作方法，用不同的方法实现三个具体的产品类（也就是连接方式）再定义一个工厂方法，按照不同的传入条件，选择不同的连接方式。

再次，工厂方法模式可以用在异构项目中，例如通过 WebService 与一个非 Java 的项目交互，虽然 WebService 号称是可以做到异构系统的同构化，但是在实际开发中，还是会碰到很多问题，如类型问题、WSDL 文件的支持问题等等。从 WSDL 中创建的对象都认为是一个产品，然后由一个具体的工厂类进行管理，减少与外围系统的耦合。

最后，可以使用在测试驱动开发的框架下。例如，测试一个类 A，就需要把与类 A 有关联关系的类 B 也同时产生出来，我们可以使用工厂方法模式把类 B 虚拟出来，避免类 A 与类 B 的耦合。


## 总结

工厂方法模式在项目中使用得非常频繁，以至于很多代码中都包含工厂方法模式。该模式几乎人尽皆知，但不是每个人都能用得好。孰能生巧，熟练掌握该模式，多思考工厂方法如何应用，而且工厂方法模式还可以与其他模式混合使用（例如模板方法模式、单例模式、原型模式等），变化出无穷的优秀设计，这也正式软件设计和开发的乐趣所在。

> 摘自：《设计模式之禅》(第 2 版)
