---
title: 中介者模式
sidebar: auto
date: 2021-04-09
categories:
 - 设计模式
tags:
 - DesignPattern
---

中介者模式的定义为：Define an object that encapsulates how a set of objects instance.Mediator promotes loose coupling by keeping objects from referring to each other explicitly,and it lets you vary their interaction independently.（用一个中介对象封装一系列的对象交互，中介者使各对象不需要显示地相互作用，从而使其耦合松散，而且可以独立地改变它们之间的交互。）

## 中介者模式的通用类图

<img :src="$withBase('/img/java/design/MediatorPattern类图.png')" alt="MediatorPattern类图" />

从类图中看，中介者模式由以下几部分组成：

* Mediator 抽象中介者角色：抽象中介者决定定义统一的接口，用于各同事角色之间的通信。
* ConcreteMedistor 具体中介者角色：具体中介者角色通过协调各同事角色实现协作行为，因此它必须依赖于各个同事角色。
* Colleague 同事角色：每一个同事角色都知道中介者角色，而且与其它的同事角色通信的时候，一定要通过中介者角色协作。每个同时类的行为分为两张：一种是同事本身的行为，比如改变对象本身的状态，处理自己的行为等，这种行为叫做 **自发行为（Self-Method）**，与其它的同时类或中介者没有任何的依赖；第二种是必须依赖中介者才能完成的行为，叫做 **依赖方法（Dep-Method）**。

中介者模式比较简单，其通用源码也比较简单，先看抽象中介者 Mediator 类，源码如下：

``` java
public abstract class Mediator {
    /**
	 * 定义同事类
	 */
    protected ConcreteColleague1 c1;

    protected ConcreteColleague2 c2;

    /**
	 * 通过 getter/setter 方法吧同事类注入进来
	 */

    public ConcreteColleague1 getC1() {
        return c1;
    }

    public void setC1(ConcreteColleague1 c1) {
        this.c1 = c1;
    }

    public ConcreteColleague2 getC2() {
        return c2;
    }

    public void setC2(ConcreteColleague2 c2) {
        this.c2 = c2;
    }


    /**
	 * 中介者模式的业务逻辑
	 */
    public abstract void doSomething1();

    public abstract void doSomething2();
}

```

在 Mediator 抽象类中我们只定义了同事类的注入，为什么使用同事类注入而不使用抽象类注入呢？那是因为同事类虽然有抽象，但是每个同事类必须要完成的业务方法可能是不同的，当然如果每个同事类都有相同的方法，比如 execute、handler等，那当然注入抽象类，做到依赖倒置。

具体的中介者一般只有一个，即通用中介者，其源码如下：

``` java
public class ConcreteMediator extends Mediator {
    @Override
    public void doSomething1() {
        super.c1.selfMethod();
        super.c2.selfMethod();
    }

    @Override
    public void doSomething2() {
        super.c1.depMethod();
        super.c2.depMethod();
    }
}
```

中介者所具有的方法doSomething1 和 doSomething2 都是比较复杂的业务逻辑，为同事类服务，其实现是依赖各个同事类来完成的。

同事类的基类源码如下：

``` java
public abstract class Colleague {

    protected Mediator mediator;

    public Colleague(Mediator mediator) {
        this.mediator = mediator;
    }
}
```

这个基类也非常简单。一般来说，中介者模式中的抽象都比较简单，是为了建立这个中介而服务的，具体同事类如下：

``` java
public class ConcreteColleague1 extends Colleague {
    public ConcreteColleague1(Mediator mediator) {
        super(mediator);
    }

    /**
	 * 自有行为 self-method
	 */
    public void selfMethod() {
        // 处理自己的业务逻辑
    }

    /**
	 * 依赖方法 dep-method
	 */
    public void depMethod() {
        // 处理自己的业务逻辑
        // 自己不能处理的业务逻辑，委托给中介者处理
        super.mediator.doSomething1();
    }
}
```

``` java
public class ConcreteColleague2 extends Colleague {
    public ConcreteColleague2(Mediator mediator) {
        super(mediator);
    }

    /**
	 * 自有行为 self-method
	 */
    public void selfMethod() {
        // 处理自己的业务逻辑
    }

    /**
	 * 依赖方法 dep-method
	 */
    public void depMethod() {
        // 处理自己的业务逻辑
        // 自己不能处理的业务逻辑，委托给中介者处理
        super.mediator.doSomething2();
    }
}
```

为什么同事类要使用构造函数注入中介者，而中介者使用 getter/setter 方式注入同事类呢？这是因为同事类必须有中介者（类似强制代理的概念），而中介者却可以只有部分同事类。

## 中介者模式的优点

中介者模式的优点就是减少类间的依赖，把原有的一对多的依赖变成了一对一的依赖，同事类只依赖中介者，减少了依赖，当然同事也降低了类间的耦合。

## 中介者模式的缺点

中介者模式的缺点就是中介者会膨胀得很大，而且逻辑复杂，原本 N 个对象直接的相互依赖关系转换为中介者和同事类的依赖关系，同事类越多，中介者的逻辑就越复杂。

## 中介者模式的使用场景

中介者模式简单，但是简单不代表容易使用，很容易被误用。在面向对象编程中，对象和对象之间必然会有依赖关系，如果某个类和其它类没有任何相互依赖的关系，那这个类就是一个“孤岛”，在项目中就没有存在的必要了！就像是某个人如果永远独立生活，与任何人都没有关系，那这个人基本上就算是野人了 -- 排除在人类这个定义之外。

类之间的依赖关系是必然存在的，一个类依赖多个类的情况也是存在的，存在即合理，那是否可以说只要有多个依赖关系就考虑使用中介者模式呢？答案是否定的。中介者模式未必能帮你把原本凌乱的逻辑整理得清清楚楚，而且中介者模式也是有缺点的，这个缺点在使用不当时会被放大，比如原本就简单的几个对象依赖关系，如果为了使用模式而加入中介者，必然导致中介者的逻辑复杂化，因此中介者模式的使用需要“量力而行”！中介者模式适用于 **多个对象之间紧密耦合的情况**，紧密耦合的标准是：**在类图中出现了蜘蛛网状结构**。在这种情况下一定要考虑使用中介者模式，这有利于把蜘蛛网梳理为星状结构，使原本复杂混乱的关系变得清晰简单。

## 中介者模式的实际应用

中介者模式也叫做调停者模式，是什么意思呢？一个对象要和 N 多个对象交流，就像对象间的战争，很混乱。这时，需要加入一个中心，所有的类都和中心交流，中心说怎么处理就怎么处理，下面举一些在开发和生活中经常会碰到的例子。

* 机场调度中心

  大家在每个机场都会看到一个“xx机场调度中心”，他就是具体的中介者，用来调度每一架要降落和起飞的飞机，比如，某架飞机（同事类）飞到机场上空了，就询问调度中心（中介者）“我是否可以降落”以及“降落在哪个跑道”，调度中心（中介者）查看其它飞机（同事类）情况，然后通知飞机降落。如果没有机场调度中心，飞机飞到机场了，飞行员要先看看有没有飞机和自己一起降落的，有没有空跑到，停机位是否具备等情况，这种局面是难以想象的！

* MVC 架构

  大家都应该使用过 Struts，MVC 框架，其中的 C（Controller）就是一个中介者，叫做前端控制器（Front Controller），它的作用就是把 M（Model，业务逻辑）和 V（View，视图）隔离开，协调 M 和 V 协同工作，把 M 运行的结果和 V 代表的视图融合成一个前端可以展示的页面，减少 M 和 V 的依赖关系。MVC 框架已经成为一个非常流行、成熟的开发框架，这也是中介者模式的优点的一个体现。

* 媒体网关

  媒体网关也是一个典型的中介者模式，比如使用 MSN 时，张三发消息给李四，其过程应该是这样的：张三发送消息，MSN 服务器（中介者）接收到消息，查找李四，把消息发送到李四，同事通知张三，消息已经发送。在这里，MSN 服务器就是一个中转站，负责协调两个客户端的信息交流，于此相反的就是 IPMsg（也叫飞鸽），他没有使用中介者（**去中心化**），而直接使用了 UDP 广播的方式，每个客户端既是客户端也是服务端。

* 现在中介服务非常多，比如租房中介、出国中介，这些也都是中介模式的具体体现，比如你去租房子，如果没有房屋中介，你就必须一个一个小区去找，看看有没有空房子，有没有适合自己的房子，找到房子后还要和房东签合约，自己检查房屋的家具、水电煤等；有了中介后，你就省心多了，找中介，然后安排看房子，看中了，签合约，中介帮你检查房屋家具、水电煤等等。这也是中介模式的实际应用。

## 最佳实践

本章讲述得中介者模式很少用到接口或者抽象类，这与依赖导致原则是冲突的，这是什么原因呢？首先，既然是同事类而不是兄弟类（有相同的血缘），那就说明这些类之间是协作关系，完成不同的任务，处理不同的业务，所以不能在抽象类或接口中严格定义同事类必须具有的方法（从这点也可以看出继承是高入侵性的）。这是不合适的，就像你我是同事，虽然我们大家都是朝九晚五地上班，但是你跟我干的活肯定不同的，不能抽象初一个父类统一定义同事类所必须有的方法。当然，每个同事都要吃饭，上厕所，可以把这些最基本的信息封装到抽象类中，但这些最基本的行为或属性是中介者模式需要关心的吗？如果两个对象不能提炼出共性，那就不要刻意去追求两者的抽象，抽象只要定义出模式需要的角色即可。当然如果严格遵守面向接口编程的话，则是需要抽象的，这就需要读者在实际开发中灵活掌握运用。其次，在一个项目中，中介者模式可能被多个模块采用，每个中介者所围绕的同事类各不相同，你能抽象出一个具有共性的中介者吗？不可能，一个中介者抽象类一般只有一个实现者，除非中介者逻辑非常复杂，代码量非常大，这时才会出现多个中介者的情况。所以，对于中介者来说，抽象已经没有太多的必要。

中介者模式是一个非常好的封装模式，也是一个非常容易被滥用的模式，一个对象依赖几个对象是再正常不过的事情，但是纯理论家就会要求使用中介者模式来封装这种依赖关系，这是非常危险的！使用中介者模式就必然会带来中介者的膨胀问题，这在一个项目中是很不恰当的。大家可以在如下的情况下尝试使用中介者模式：

* N 个对象之间产生了相互依赖关系（N > 2）；
* 多个对象有依赖关系，但是依赖的行为尚不确定或者有发生改变的可能，在这种情况下一般建议采用中介者模式，降低变更引起的风险扩散；
* 产品开发。一个明显的例子就是 MVC 框架，把中介者模式应用到产品中，可以提升产品的性能和扩展性，但是对于项目开发就未必，因为项目是以交付投产为目标，而产品则是以稳定、高效、扩展为宗旨。

> 摘自：《设计模式之禅》(第 2 版)
