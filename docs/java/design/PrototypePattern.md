---
title: 原型模式
sidebar: auto
date: 2021-04-10
categories:
 - 设计模式
tags:
 - DesignPattern
---

原型模式（Prototype Pattern）的简单程度仅次于单例模式和迭代器模式。正是由于简单，使用的场景才非常地多，其定义如下：

Specify the kinds of object to create using a prototypical instance, and create new objects by copying this prototype.（用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。）

## 原型模式的通用类图

<img :src="$withBase('/img/java/design/PrototypePattern类图.png')" alt="PrototypePattern类图" />

原型模式的核心是一个 clone 方法，通过该方法进行对象的拷贝，Java 提供了一个接口 Cloneable 接口来标示这个对象是可拷贝的，为了说是“标示”呢？我们可以从 Cloneable 接口内容中发现，该接口一个方法都没有，这个接口就只是一个标记作用，在 JVM 中具有这个标记的对象才有可能被拷贝。那么怎么才能从“有可能被拷贝”转换为“可以被拷贝”呢？方法就是重写覆盖 clone() 方法。下面展示原型模式的通用源代码：

``` java
public class Prototype implements Cloneable {

    @Override
    protected Prototype clone() {

        Prototype prototype = null;

        try {
            prototype = (Prototype) super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return prototype;
    }
}
```

实现一个接口，然后重写 clone 方法，就完成了原型模式！

## 原型模式的优点

* 性能优良

  原型模式是在内存二进制流的拷贝，要比直接 new 一个对象性能好很多，特别是要在一个循环体内产生大量的对象时，原型模式可以更好地体现其优点。

* 逃避构造函数的约束

  这既是优点也是缺点，直接在内存中拷贝，构造函数是不会执行的。优点就是减少了约束，缺点也是减少了约束，在实际应用时需要谨慎使用。

## 原型模式的使用场景

* 资源优化场景：类初始化需要消化非常多的资源，这个资源包括数据、硬件资源等。
* 性能和安全要求的场景：通过 new 产生一个对象需要非常繁琐的数据准备或访问权限，则可以使用原型模式。
* 一个对象多个修改者的场景：一个对象需要提供给其它对象访问，而且各个调用者可能都需要修改其值时，可以考虑使用原型模式拷贝多个对象提供调用者使用。

在实际应用场景中，原型模式很少单独出现，一般是和工厂方法模式一起出现，通过 clone 的方法创建一个对象，然后由工厂方法提供给调用者。

## 原型模式的注意事项

原型模式虽然很简单，但是在 Java 中使用原型模式（clone 方法）还是有一些注意事项的。

### 构造函数不会被执行

一个实现了 Cloneable 并重写了 clone 方法的类 A，有一个无参构造或有参构造 B，通过 new 关键字产生一个对象 S，然后再通过 S.clone() 方式产生了一个新的对象 T，那么在对象拷贝过程中，构造函数 B 是不会被执行的，请看如下演示：

``` java
public class Thing implements Cloneable {

	public Thing() {
		System.out.println("构造函数执行了...");
	}

	@Override
	protected Thing clone() {
		Thing thing = null;
		try {
			thing = (Thing) super.clone();
		} catch (CloneNotSupportedException e) {
			e.printStackTrace();
		}
		return thing;
	}
}
```
再编写一个演示用例：

``` java
public class Client {
	public static void main(String[] args) {
		// new 一个对象
		Thing thing = new Thing();
		// 克隆一个对象
		Thing clone = thing.clone();
	}
}
```

运行结果如下：

``` shell
构造函数执行了...
```

对象在被拷贝时构造函数确实没有被执行，这点从原理来说也是说得通的，Object 类的 clone 方法的原理是从内存中（具体地说就是堆内存）以二进制流的方式进行拷贝，重新分配一个内存块，那构造函数没有被执行也是非常正常的了。

### 浅拷贝和深拷贝

解释深拷贝与浅拷贝前，先看一个例子：

``` java
public class Thing implements Cloneable {

    private ArrayList<String> list = new ArrayList<>();

    public ArrayList<String> getList() {
        return list;
    }

    public void setValue(String value) {
        this.list.add(value);
    }

    @Override
    protected Thing clone() {
        Thing thing = null;
        try {
            thing = (Thing) super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return thing;
    }
}
```

在 Thing 类中增加一个私有变量 list，然后通过 setValue 和 getList 分别进行设置值和取值，下面是场景类：

``` java
public class Client {
    public static void main(String[] args) {
        // new 一个对象
        Thing thing = new Thing();

        // 克隆一个对象
        Thing clone = thing.clone();

        thing.setValue("张三");

        clone.setValue("李四");

        clone.getList().forEach(System.out::println);
    }
}
```

运行结果：

``` shell
张三
李四
```

从结果中，可以看出两个对象的 list 属性貌似引用的是同一对象，为什么会这样子呢？这是因为 Java 拷贝机制的原因，Object 类提供的 clone 方法只是拷贝本对象，其对象内部的数组、引用对象等都不拷贝，还是指向原生对象的内部元素地址，这种拷贝就叫做浅拷贝。确实是非常浅，两个对象共享了一个私有变量，两个对象都能进行修改，是一种非常不安全的方式，在实际项目中使用还是比较少的。在 Object 类提供的 clone 方法中，只会对原始类型（基本数据类型）int、long、char等进行拷贝，对于数组和引用类型是不会进行拷贝的，但是，请注意 String 类型不属于原始类型，这种类型的变量是可以被拷贝的，它没有 clone 方法，处理机制比较特殊，通过字符串池（stringpool）在需要的时候才在内存中创建新的字符串。

::: warning 注意

使用原型模式时，引用的成员变量必须满足两个条件才不会被拷贝：一是类的成员变量，而不是方法内变量；二是必须是一个可变的引用对象，而不是一个原始类型或不可变对象。

:::

浅拷贝是有风险的，那怎么才能深入地拷贝呢？只需要在 Thing 类中稍作修改即可，如下：

``` java
public class Thing implements Cloneable {

    private ArrayList<String> list = new ArrayList<>();

    public List<String> getList() {
        return list;
    }

    public void setValue(String value) {
        this.list.add(value);
    }

    @Override
    protected Thing clone() {
        Thing thing = null;
        try {
            thing = (Thing) super.clone();
            this.list = (ArrayList<String>) this.list.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return thing;
    }
}
```

再次运行，结果：

``` shell
李四
```

改方法就实现了完全的拷贝，两个对象之间没有任何瓜葛了，你修改你的，我修改我的，互不影响，这种拷贝就叫做深拷贝。深拷贝还有一种实现方式就是通过自己写的二进制流来操作对象，然后实现对象的深拷贝。

::: warning 注意

深拷贝和浅拷贝建议不要混合使用，特别是在涉及类的继承时，父类有多个引用的情况就非常复杂，建议的方法时深拷贝和浅拷贝分开实现。

:::

### clone 与 final

对象的 clone 与对象内的 final 关键字是有冲突的，书写一个例子来说明，如下：

``` java
public class Thing implements Cloneable {

    private final ArrayList<String> list = new ArrayList<>();

    public List<String> getList() {
        return list;
    }

    public void setValue(String value) {
        this.list.add(value);
    }

    @Override
    protected Thing clone() {
        Thing thing = null;
        try {
            thing = (Thing) super.clone();
            this.list = (ArrayList<String>) this.list.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
        return thing;
    }
}
```

在私有成员变量 list 增加了 final 关键字后，编译器就开始报错了，原因是试图修改 final 修饰的变量的引用，在这种情况下，该变量是不能通过 clone 方法被复制的，除非删除 final 关键字，这也是最便捷、安全、快速的方式。

::: tip 提示

要使用 clone 方法进行对象克隆时，类的成员变量上不要增加 final 关键字。

:::

## 总结

原型模式先产生出一个包含大量共有信息的类，然后可以拷贝出副本，修正细节信息，建立了一个完整的个性对象。可以这么去理解：一个对象的产生可以不从零开始，直接从一个已经具备一定雏形的对象克隆，然后再修改为生产需要的对象。

> 摘自：《设计模式之禅》(第 2 版)
