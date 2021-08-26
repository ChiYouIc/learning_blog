---
title: 责任链模式
sidebar: auto
date: 2021-04-04
categories:
 - 设计模式
tags:
 - DesignPattern
---

责任链模式定义如下：Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request.Chain the receiving objects and pass the request along the chain until an object handles it.（使多个对象都有机会处理请求，从而避免了请求的发送者和接受者之间的耦合关系。将这些对象连成一条链，并沿着这条链传递改请求，知道有对象处理它为知。）

## 责任链模式的通用类图

责任链模式的重点是在“链”上，由一条链去处理相似的请求在链中决定谁来处理这个请求，并返回相应的结果，其通用类图如下：

<img :src="$withBase('/img/java/design/责任链模式类图.png')" alt="责任链模式类图" />

责任链模式的核心在“链”上，“链”是由多个处理者 ConcreteHandler 组成的，我们先来看抽象 Handler 类，源码如下：

``` java
public abstract class Handler {
    private Handler nextHandler;

    public final Response HandleMessage(Request request) {
        Response response = null;
        // 判断是否是自己的处理级别
        if (this.getHandlerLevel().equals(request.getRequestLevel())) {
            response = this.echo(request);
        }
        // 不属于自己的处理级别
        else {
            // 判断是否有下一个处理者
            if (this.nextHandler != null) {
                response = this.nextHandler.HandleMessage(request);
            }
            // 没有适当的处理者
            else {

            }
        }
        return response;
    }

    /**
	 * 设置下一个处理者
	 *
	 * @param handler 处理者
	 */
    public void setNextHandler(Handler handler) {
        this.nextHandler = handler;
    }

    /**
	 * 每个处理者都有一个处理级别
	 *
	 * @return 处理级别
	 */
    protected abstract Level getHandlerLevel();

    /**
	 * 每个处理者都必须实现处理任务
	 *
	 * @param request 请求
	 * @return 相应
	 */
    protected abstract Response echo(Request request);
}
```

抽象的处理者实现三个职责：

* 定义一个请求的处理方法 handleMessage，唯一对外开放的方法；
* 定义一个链的编排方法 setNext，设置下一个处理者；
* 定义具体的请求者必须实现的两个方法，一个是获取自己能够处理的级别 getHandlerLevel 和具体的处理任务行为 echo。

::: warning 注意

在责任链模式中一个请求发送到链中后，前一节点消费部分消息，然后交由后续节点继续处理，最终可以有处理结果也可以没有处理结果，我们可以不用理会什么纯的、不纯的责任链模式。同时，请注意 handlerMessage 方法前的 **final** 关键字，这使用的是模板方法模式。

:::

我们定义三个具体的处理者，以便可以组成一个链，代码如下：

``` java
public class ConcreteHandler1 extends Handler {
    @Override
    protected Level getHandlerLevel() {
        // 配置自己的处理级别
        return null;
    }

    @Override
    protected Response echo(Request request) {
        // 完成业务逻辑
        return null;
    }
}
```

``` java
public class ConcreteHandler2 extends Handler {
    @Override
    protected Level getHandlerLevel() {
        // 配置自己的处理级别
        return null;
    }

    @Override
    protected Response echo(Request request) {
        // 完成业务逻辑
        return null;
    }
}
```

``` java
public class ConcreteHandler3 extends Handler {
    @Override
    protected Level getHandlerLevel() {
        // 配置自己的处理级别
        return null;
    }

    @Override
    protected Response echo(Request request) {
        // 完成业务逻辑
        return null;
    }
}
```

在处理者中涉及三个类：Level 类负责定义请求和处理级别，Request 类负责封装请求，Response 负责封装链中返回的结果，该三个类都需要根据业务产生，读者可以在实际应用中完成相关的业务填充，其框架代码如下：

``` java
public class Level {
    // 定义一个请求和处理等级
}
```

``` java
public class Request {
    /**
	 * 请求的等级
	 */
    public Level getRequestLevel() {
        return null;
    }
}
```

``` java
public class Response {
    // 处理者返回的数据
}
```

在场景类或高层模块中对链进行组装，并传递请求，返回结果，代码如下：

``` java
public class Client {
    public static void main(String[] args) {
        // 声明所有的处理节点
        Handler handler1 = new ConcreteHandler1();
        Handler handler2 = new ConcreteHandler2();
        Handler handler3 = new ConcreteHandler3();

        // 设置链中的阶段顺序 1 --> 2 --> 3
        handler1.setNextHandler(handler2);
        handler2.setNextHandler(handler3);
        // 提交请求，返回结果
        Response response = handler1.HandleMessage(new Request());
    }
}
```

在实际应用中，一般会有一个封装类对责任模式进行封装，也就是代替 Client 类，直接返回链中的第一个处理者，具体链的设置不需要高层次模块关心，这样，更简化了高层次模块的调用，减少模块间的耦合，提高系统的灵活性。

## 责任链模式的应用

### 责任链模式的优点

责任链模式非常显著的优点是将请求和处理分开。请求者可以不用知道是谁处理的，处理者可以用知道请求全貌（例如在 J2EE 项目开发中，可以剥离出无状态 Bean 由责任链处理），两者解耦，提高系统的灵活性。

### 责任链模式的缺点

责任链模式有两个非常显著的缺点：

* 性能问题：每个请求都是从链头遍历到链尾，特别是在链比较长的时候，性能是一个非常大的问题；
* 调式不方便：在链比较长，环节比较多的时候，由于采用了类似递归的方式，调式的时候逻辑可能会比较复杂。

### 责任链模式的注意事项

链中节点数量需要控制，避免出现超长的情况，一般的做法是在 Handler 中设置一个最大节点数量，在 setNext 方法中判断是否已经是超过其阈值，超过则不允许该链建立，避免无意识地破坏系统性能。

## 最佳实践

在通用代码中 Handler 是抽象类，融合了模板方法模式，每个实现类只要实现两个方法：echo 方法处理请求和 getHandlerLevel 获取处理级别。想想单一职责原则和迪米特法则，通过融合模板方法模式，各个实现类只要关注着自己业务逻辑就可以了，至于什么事要自己处理，就让父类去决定好了，也就是说父类实现了请求传递的功能，子类实现请求的处理，符合单一职责原则，各个实现类只完成一个动作或逻辑，也就是只有一个原因引起类的改变，所以建议大家在使用的时候用这种方法，好处是非常明显的，子类的实现非常，责任链的建立也是非常灵活的。

责任链模式屏蔽了请求的处理过程，一个请求到底是谁处理的，这个不需要我们关心，只要把请求交给责任链的第一个处理者，最终会返回一个处理结果（当然也可以不做任何处理），`作为请求者可以不用知道到底是需要谁来处理`，这是责任链模式的核心，同时责任链模式也可以作为一种补救模式来使用。举个简单的例子，如项目开发的时候，需求确认是这样子的：一个请求（如银行客户存款的币种），一个处理者（只处理人民币），但是随着业务的发展（增加了币种，还需要处理美元、日元、欧元等等），处理者的数量和类型都有所增加，那这时候就可以在第一个处理者后面建立一个链，也就是责任链来处理请求，如果是人民币，还是第一个业务逻辑来处理；如果是美元，传递到第二个业务逻辑来处理；日元、欧元...，使用这种方式处理，就不会对原有的业务逻辑产生很大的改变，通过扩展实现类就可以很好地解决这些需求变更的问题。


> 摘自：《设计模式之禅》(第 2 版)

