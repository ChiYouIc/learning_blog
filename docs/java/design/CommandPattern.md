---
title: 命令模式
sidebar: auto
date: 2021-04-05
categories:
 - 设计模式
tags:
 - DesignPattern
---

命令模式是一个高内聚的模式，其定义为：Encapsulate a request as an object,thereby letting you parameterize clients with different requests,queue or log requests,and support undoable operations.（将一个请求封装成一个对象，从而允许你使用不同的请求把客户端参数化，对请求进行排队或者记录请求，可以提供命令的撤销和恢复功能。）

## 命令模式的通用类图

<img :src="$withBase('/img/java/design/CommandPattern模式.png')" alt="CommandPattern模式" />

在该类图中，我们看到三个角色：

* Receive 接收者角色：该角色就是干活的角色，命令传递到这里时应该被执行的。

* Command 命令角色：需要执行的所有命令都在这里声明。

* Invoker 调用者角色：接受到命令，并执行命令。

命令模式比较简单，但是在项目中非常频繁地使用，因为它的封装性非常好，把请求方（Invoker）和执行方（Receiver）分开了，扩展性也有很好的保障，通用代码比较简单。我们先阅读以下 Receiver 类，源码如下：

``` java
public abstract class Receiver {
    /**
	 * 抽象接收者，定义每个接收者都必须完成的业务
	 */
    public abstract void action();
}
```

  Receiver 是一个抽象类，因为接收者可以有多个，有多个接收者那么就可以定义一个所有特性的抽象集合 -- 抽象接收者，源码如下：

``` java
public class ConcreteReceiver  extends Receiver {
	@Override
	public void action() {
		// 每个接收者都必须处理一定的业务逻辑
	}
}
```

接收者可以是 N 个，这要依赖业务的具体定义。命令角色是命令模式的核心，其抽象的命令类源码如下：

``` java
public abstract class Command {
    /**
	 * 每个命令类都必须有一个执行命令的方法
	 */
    public abstract void execute();
}
```

更具环境的需求，具体的命令类也可以有 N 个，其实先类源码如下：

``` java
public class ConcreteCommand extends Command {

    /**
	 * 对哪个 Receiver 类进行命令处理
	 */
    private Receiver receiver;

    public ConcreteCommand1(Receiver receiver) {
        this.receiver = receiver;
    }

    /**
	 * 必须实现一个命令
	 */
    @Override
    public void execute() {
        // 业务处理
        this.receiver.action();
    }
}
```

在实际应用开发中，可以通过继承 Command 类来扩展命令类。在命令类中，通过构造函数定义了该命令是针对哪一个接收者发出来的，定义一个命令接收的主体。调用者非常简单，仅实现命令的传递，源码如下：

``` java
public class Invoker {
    private Command command;

    /**
	 * 接收命令
	 */
    public void setCommand(Command command) {
        this.command = command;
    }

    /**
	 * 执行命令
	 */
    public void action() {
        this.command.execute();
    }
}
```

调用者就像是一个受气包，不管什么命令，都要接收、执行。那我们来看看高层模块如何调用命令模式，源码如下：

```java
public class Client {
    public static void main(String[] args) {
        // 首先声明调用者 Invoker
        Invoker invoker = new Invoker();

        // 定义接收者
        ConcreteReceiver concreteReceiver = new ConcreteReceiver();

        // 定义一个发送给接收者的命令
        ConcreteCommand command = new ConcreteCommand(concreteReceiver);

        // 把命令交给调用者去执行
        invoker.setCommand(command);
        invoker.action();

    }
}
```



## 命令模式的优点

* 类间解耦：调用者角色与接收者角色之间没有任何依赖关系，调用者实现功能时只需要调用 Command 抽象类的 execute 方法就可以，不需要了解到底时哪个接收者执行；

* 可扩展：Command 的子类可以非常容易地扩展，而调用者 Invoker 和高层的模块 Client 不产生严重的代码耦合；

* 命令模式结合其它模式会更优秀：命令模式可以结合责任链模式，实现命令族解析任务；结合模板方法模式，则可以减少 Command 子类的膨胀问题。



## 命令模式的缺点

命令迷失也是有缺点的，请看 Command 的子类：如果有 N 个命令，问题就出来了，Command 的子类就可不是几个，而是 N 个，这个类膨胀得非常大，这个就需要读者在项目中慎重考虑使用。



## 命令模式的使用场景

只要你认为时命令的地方就可以采用命令模式，例如，在 GUI 开发中，一个按钮的点击是一个命令，可以采用命令模式；模拟 DOS 命令的时候，当然也要采用命令模式；触发 -- 反馈机制的处理等。

> 摘自：《设计模式之禅》(第 2 版)
