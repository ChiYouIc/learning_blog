---
title: CPA 理论
sidebar: auto
date: 2021-06-13
categories:
 - 微服务
tags:
 - SpringCloud
 - 面试
---

[CAP 理论/定理](https://zh.wikipedia.org/wiki/CAP定理)起源于 2000年，由加州大学伯克利分校的Eric Brewer教授在分布式计算原理研讨会（PODC）上提出，因此 CAP定理又被称作 **布鲁尔定理（Brewer’s theorem）**。2年后，麻省理工学院的Seth Gilbert和Nancy Lynch 发表了布鲁尔猜想的证明，CAP理论正式成为分布式领域的定理。

## 介绍

CPA 也就是 **Consistency（一致性）**、**Availability（可用性）**、**Partition Tolerance（分区容错性）**这三个单词首写字母组合。

<img :src="$withBase('/img/microservice/theory/cap.png')" alt="cap" />

CAP 理论的提出者布鲁尔在提出 CAP 猜想的时候，并没有详细定义 Consistency、Availability、Partition Tolerance 三个单词的明确定义。因此，对于 CAP 的民间解读有很多，一般比较被大家推荐的是下面这种版本的解读。

在理论计算机科学中，CAP 理论（CAP Theorem）指出对于一个分布式系统来说，当设计读写操作时，只能同时满足以下三点中的两个：

* **一致性（Consistency）**：所有节点访问同一份最新的数据副本；
* **可用性（Availability）**：非故障的节点在合理的时间内返回合理的响应（不是错误或者超时的响应）；
* **分区容错性（Partition Tolerance）**：分布式系统出现网络分区的时候，仍然能够对外提供服务。

::: tip 什么是网络分区？

分布式系统中，多个节点之间的网络本来是连通的，但是因为某些故障（比如部门节点网络出现了问题）某些节点之间不连通了，整个网络就分成了几块分区，这就叫做网络分区。

<img :src="$withBase('/img/microservice/theory/partition-tolerance.png')" alt="partition-tolerance" />

:::

## 不是所谓的 “3” 选 “2”

大部分人解释这一定律时，常常简单的表述为：“一致性、可用性、分区容忍性”三者你只能同时到达其中两个，不可能同时达到“。实际上这时一个非常具有误导性质的说法，而且在 CAP 理论诞生 12 年之后，CAP 之父也在 2021 年重写了之前的论文。

::: tip

当发生网络分区的时候，如果我们要继续服务，那么强一致性和可用性只能 2 选 1。也就是说当网络分区之后 P 是前提，决定了 P 之后才有 C 和 A 的选择。总结就是分区容错性我们是必须要实现的。

简而言之就是：CAP 理论中的分区容错性 P 是一定要满足的，在此基础上，只能满足可用性 A 或者一致性 C。

:::

因此，**分布式系统理论上不可能选择 CA 架构，只能选择 CP 或者 AP 架构**。比如 Zookeeper、HBase 就是 CP 架构，Cassandra、Eureka 就是 AP 架构，Nacos 不仅支持 CP 同时也支持 AP。

::: tip 为什么不能选择 CA 架构呢？

举个例子：当分布式系统中出现网络分区时，系统中的某个节点在进行写操作。为了保证一致性 C，必然是要禁止其他节点的读写操作，这就和可用性 A 发生了冲突。如果我们保证可用性A，其他节点照常进行读写操作的话，那么就会和一致性 C 发生冲突。

:::

**选择 CP 还是 AP 关键在于当前业务场景，没有绝对的定论，比如对于需要确保强一致性的场景，如银行一般会选择保证 CP（一致性、分区容错性）**。

另外，需要补充说明的一点是：**在网络分区正常的情况下（系统在绝大部分时候所处状态），此时是不需要保证分区容错行，那么一致性和可用性能够同时保证**。



## CPA 实际引用案例

我们这里用注册中心来探讨一下 CAP 的实际应用，这里以 Dubbo 为例，下面是 Dubbo 的架构图：

<img :src="$withBase('/img/microservice/theory/dubbo-architecture.png')" alt="dubbo-architecture" />

::: tip 注册中心 Registry 在其中扮演了什么角色呢？提供了什么服务呢？

注册中心负责服务地址的注册与查找，相当于目录服务，服务提供者和消费者只在启动时与注册中心交互，注册中心不转发请求，压力很小。

:::

常见的可以作为注册中心的组件有：Zookeeper、Eureka、Nacos...

1. **Zookeeper 保证的是 CP。**任何时刻 Zookeeper 的读请求都能得到一致性的结果，但是，Zookeeper 不保证每次请求的可用性，比如在 Leader 选举过程中或者半数以上的机器不可用的时候服务就是不可用的。
2. **Eureka 保证的是 AP。**Eureka 在设计的时候就是优先保证 A 可用性。在 Eureka 中不存在什么 Leader 节点，因为 Eureka 集群中是没有中心节点一说的，是去中心化的，注册中心之间互相注册，保证每个节点一样、平等。因此 Eureka 不会像 Zookeeper 那样在选举过程中或者半数以上的机器不可用时服务也跟着不可用的情况。Eureka 保证即使大部分服务节点挂掉也不会影响正常服务对外提供服务，只要有一个节点是可用的就行了，只不过在这个节点上的数据可能不是最新的。
3. **Nacos 不仅支持 CP 也支持 AP。**



## 总结

在进行分布式系统的设计和开发时，我们不应该仅仅局限在 CAP 问题上，还要关注系统的扩展性、可用性等等。在系统发生“网络分区”的情况下，CAP 理论只能满足 CP 或者 AP。要注意的是，这里的前提是发生了“网络分区”，如果系统没有发生“网络分区”的情况下，节点间的网络连接通信时正常的，也就不存在 **分区容错性** 这一说了。此时系统是可以同时保证 **一致性** 和 **可用性** 的。

总结：`如果系统发生了“网络分区”，我们要考虑选择 CP 还是 AP。如果系统没有发生“网络分区”的话，我们就要思考如何去保证 CA。`

> 摘自 JavaGuide [点击此处查看原文](https://snailclimb.gitee.io/javaguide/#/docs/system-design/distributed-system/CAP%E7%90%86%E8%AE%BA)
