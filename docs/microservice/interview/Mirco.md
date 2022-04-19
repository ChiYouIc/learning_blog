---
title: 微服务面试题
sidebar: auto
date: 2022-02-21
categories:
 - 微服务
tags:
 - 面试
---

## SpringCloud 有那些组件？

- 注册中心（Eureka、Nacos、Zookeeper）
- 服务调用（Feign）
- 负载均衡（Ribbon）
- 服务容错与保护（hystrix）
- 服务网关（Zuul、Gateway）
- 配置中心（Nacos、Config）


## 熔断和限流怎么做？

### 熔断

在分布式应用中为了防止服务之间调用过程中出现异常，所导致整体链路故障，需要对服务应用进行熔断降级处理。熔断即在存在问题时，暂时切断内部调用，避免局部不稳定因素导致整个分布式系统的雪崩。熔断降级作为保护服务自身的手段，通常是在客户端进行规则配置和熔断识别的。

#### 三种熔断降级措施：

- **慢调用比例策略**

  在所设定的时间窗口内，慢调用的比例大于所设置的阈值，则对接下来访问的请求进行自动熔断。

- **错误比例策略**

  在所设定的时间窗口内，调用的访问错误比例大于所设置的阈值，则对接下来访问的请求进行自动熔断。

- **错误计数策略**

  在所设定的时间窗口内，调用的访问错误次数大于所设置的阈值，则对接下来访问的请求进行自动熔断。

### 限流

在分布式系统架构中，为了防止接口流量的突发性暴增导致整个服务雪崩的现象，需要对服务接口进行流量控制，防止接口流量超出系统预期承受范围。

#### 两种流程控制方式：

- **基于 QPS**

  最常用的流量控制方式是基于 QPS 来做的，在一定的时间窗口范围内按照特定的规则达到所设定的阈值则进行流量调控。

- **基于并发隔离**

  基于资源访问的并发协程数来控制对资源的访问数量，主要是控制对资源访问的最大协程数，避免因为资源的异常导致协程耗尽。



## 一致性哈希表

一致性哈希表是分布式哈希表的一种，一致性哈希表的思想：通过给系统中的每个节点分配一个随机 Token，这些 Token 构成一个哈希环。在执行数据存放操作时，先计算 key 的哈希值，然后按顺时针方向，将其存放在第一个大于等于该 key 哈希值的 Token 所在的节点上。这样一来，新增或减少节点只会影响到相邻节点，对其他节点不会产生影响，所以只会又部分的 key 失效。提高了系统的扩展性，也使得系统能够更好的适应数据的快速增长。



## 缓存雪崩、缓存穿透、缓存击穿，各自的解决办法

### 缓存处理流程：

 前台请求，后端先从缓存中取数据，取到直接返回结果，取不到时从数据库中取，数据库取到更新缓存，并返回结果，数据库也没取到，那直接返回空结果。

### 缓存穿透：

 缓存穿透是指缓存和数据库中都没有目标数据，而用户不断发起请求获取不存在的数据，这时的用户很可能是攻击者，改类攻击会导致数据库压力过大。

#### 解决方案：

- 接口层增加校验，如果用户鉴权、id 做基础校验，id <= 0 的直接拦截；

- 从缓存中取不到的数据，在数据库中也没有取到，这时也可以将 key – value 对写为 key – null，缓存有效时间可以设置短点，如 30 秒。这样可以防止攻击用户反复用同一个 id 暴力攻击。

### 缓存击穿

 缓存击穿是指缓存中没有但数据库中有的数据（一般是缓存时间到期），这时由于并发用户特别多，同时读缓存没有读到数据，又同时去数据库取数据，引起数据库压力瞬间增大，造成数据库负载。

#### 解决方案：

- 设置热点数据永远不过期；

- 在取数据库的过程中，在数据库操作中加上互斥锁。

### 缓存雪崩

 缓存雪崩是指缓存中数据大批量到过期时间，而查询数据量巨大，引起数据库压力过大甚至宕机。和缓存击穿不同的是，缓存击穿是并发获取同一数据，缓存雪崩是很多不同的数据在缓存中过期，导致都去数据库中查询数据。

#### 解决方案：

- 缓存数据的过期时间设置随机，防止同一时间大量数据过期现象发生；

- 如果缓存数据库是分布式部署，将热点数据均匀分布在不同的缓存数据库中；

- 设置热点数据永不过期。



## Kafka 消息积压问题

- 实时/消费任务挂掉导致的消费滞后；

- Kafka 分区少了；

- 由于Kafka消息 key 设置的不合理，导致分区数据不均衡。


