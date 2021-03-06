---
title: Eureka 服务注册与发现
sidebar: auto
date: 2021-08-01
categories:
 - 微服务
tags:
 - SpringCloud
---

Eureka 是基于 REST（代表性状态转移）的服务，主要在 AWS 云中用于定位服务，以实现负载均衡和中间层服务器的故障转移。我们称此服务为 Eureka 服务器。Eureka 还带有一个基于 Java 的客户端组件 Eureka Client，它使得客户端与 Eureka 服务器交互变得更加容易。客户端还具有一个内置的负载均衡器，还可以执行基本的循环负载均衡。在 Netflix，使用了更复杂的负载均衡器将 Eureka 进行包装，以实现基于流量、资源使用、错误条件等多种因素提供加权负载均衡，提供更为出色的弹性。


Eureka 作为一款服务发现框架，他是如何去发现服务的呢？

**服务发现**：服务发现的整个过程可以理解为网购，在这个过程主要涉及到三个角色：服务提供者（某电商商家）、服务消费者（消费者）、服务中介（某电商）。

**服务提供者**：主要提供一些自己能对外暴露的功能与服务接口给外界使用。

**服务消费者**：需要使用功能与服务的一方。

**服务中介**：作为服务提供者与消费者之间的“桥梁”，服务提供者可以把自己注册到服务中介那里，服务消费者通过询问服务中介，在服务中介的服务注册表中获取自己需要的服务提供者，进行服务的消费。（这不就是商家入住平台，对外展示自己的商品，消费者通过平台找到自己需要的商品，然后与商家进行交易）。


Eureka 不是唯一一款可以充当服务发现的框架，可以充当服务发现的框架还有很多，例如：`Zookeeper`、`Consul`、`Nacos` 等。

## Eureka 基础概念

* **服务注册 Register**：当 Eureka Client 向 Eureka Server 注册时，它会提供自身的元数据，比如`IP地址`、`服务端口`、`运行状态`、`URL`、`主页等信息`。

* **服务续约 Renew**：Eureka Client 会每隔 `30 秒`（默认情况）发送一次心跳来续约。通过续约来告知 Eureka Server 该 Eureka Client 仍然存活，可以通讯。`正常情况下，如果 Eureka Server 在 90 秒没有收到 Eureka Client 的续约消息，它会将实例从其注册表中删除。`

* **获取注册表信息 Fetch Registries**：
	* Eureka Client 从 Eureka Server 获取注册表信息，并将其缓存在本地。客户端会使用该信息查找其他服务，从而进行远程调用；

	* 该注册列表信息定期（每 30 秒）更新一次；

	* 每次从 Eureka Server 获取的注册列表信息可能与 Eureka Client 的缓存信息不同，此时 Eureka Client 会自动处理更新；

	* 如果由于某种原因导致注册列表信息不能及时匹配更新，Eureka Client 则会重新获取整个注册表信息；

	* Eureka Server 会对注册表以及每个应用程序的信息进行压缩存储，以便于信息的交互传输；Eureka Client 与 Eureka Server 可以用使用 JSON \ XML 格式进行通讯，默认情况下，服务端会使用压缩 JSON 格式的数据发送给客户端使用。

* **服务下线 Cancel**：Eureka Client 在程序关闭时会主动向 Eureka Server 发送取消请求。发送请求后，该客户端实例信息将从服务器的实例注册表中删除。该下线请求不会自动完成，他需要调用一下内容：`DiscoveryManager.getInstance().shutdownComponent();`

* **服务剔除 Eviction**：在默认情况下，当 Eureka Client 连续 90 秒（3个续约周期）没有向 Eureka Server 发送服务续约时（服务端检测不到客户端的心跳），Eureka Server 会将该服务实例从服务注册列表中删除，即服务剔除。

我们可以这么理解，转换为现实中的问题就是 房屋中介问题 。

**服务注册**： 房东或者房屋的主人 (提供者`Eureka Client Provider`)在中介 (服务器`Eureka Server`) 那里登记房屋的信息，比如面积，价格，地段等等(元数据`metaData`)。

**服务续约**： 房东或者房屋的主人 (提供者 `Eureka Client Provider`) 定期告诉中介 (服务器`Eureka Server`) 我的房子还租或者还卖 (续约) ，中介 (服务器`Eureka Server`) 收到之后继续保留房屋的信息。

**获取注册列表信息**：租客或者买主(消费者`Eureka Client Consumer`) 去中介 (服务器 Eureka Server) 那里获取所有的房屋信息列表 (客户端列表`Eureka Client List`) ，而且租客或者买主为了获取最新的信息会定期向中介 (服务器`Eureka Server`) 那里获取并更新本地列表。

**服务下线**：房东或者房屋的主人 (提供者`Eureka Client Provider`) 告诉中介  (服务器`Eureka Server`) 我的房子不卖了不租了，中介之后就将注册的房屋信息从列表中剔除。

**服务剔除**：房东或者房屋的主人 (提供者`Eureka Client Provider`) 会定期联系中介 (服务器`Eureka Server`) 告诉他我的房子还租还卖(续约)，如果中介  (服务器`Eureka Server`) 长时间没收到提供者的信息，那么中介会将他的房屋信息给下架(服务剔除)。

> 原文：https://juejin.cn/post/6844904001444511758

## Eureka 架构

<img :src="$withBase('/img/microservice/eureka/Eureka架构图.png')" alt="Eureka架构图">

蓝色的 `Eureka Server` 是 Eureka 服务器，这三个代表的是集群，而且他们是去中心化的。

绿色的 `Application Client` 是 Eureka 客户端，其中可以是消费者和提供者，最左边的就是典型的提供者，它需要向 Eureka 服务器注册自己和发送心跳包进行续约，而其他消费者则通过 Eureka 服务器来获取提供者的信息以调用他们。

## Eureka 自我保护机制

默认情况下，如果 Eureka Server 在一定时间内没有接收到某个微服务实例的心跳，Eureka Server 将会注销该实例（默认90秒）。但是当网络分区故障发生时，Eureka Client 与 Eureka Server 之间无法正常通信，以上行为可能变得非常危险了—— 因为 Eureka Client 本身其实是健康的，此时本不应该注销这个 Eureka Client 。Eureka 通过“自我保护模式”来解决这个问题——当 Eureka Server 节点在短时间内丢失过多客户端时（可能发生了网络分区故障），那么这个节点就会进入自我保护模式。一旦进入该模式，Eureka Server 就会保护服务注册表中的信息，不再删除服务注册表中的数据（也就是不会注销任何 Eureka Client ）。当网络故障恢复后，该 Eureka Server节点会自动退出自我保护模式。
 
在自我保护模式中，Eureka Server 会保护服务注册表中的信息，不再注销任何服务实例。当它收到的心跳数重新恢复到阈值以上时，该 Eureka Server 节点就会自动退出自我保护模式。它的设计哲学就是宁可保留错误的服务注册信息，也不盲目注销任何可能健康的服务实例。
 
综上，自我保护模式是一种应对网络异常的安全保护措施。它的架构哲学是宁可同时保留所有微服务（健康的 Eureka Client 和不健康的 Eureka Client 都会保留），也不盲目注销任何健康的 Eureka Client 。使用自我保护模式，可以让 Eureka 集群更加的健壮、稳定。
 
在 Eureka Server 的配置中，可以使用 `eureka.server.enable-self-preservation = false` 禁用自我保护模式。

## Eureka 与 Zookeeper 对比

Eureka 与 Zookeeper 的差异结合 `CAP（Consistency 一致性、Availability 可用性、Partition tolerance 分区容错性）` 理论去分析。

### Eureka 保证 AP
Eureka 优先保证可用性。在 Eureka 平台中，如果某台服务器宕机，Eureka 不会有类似于 ZooKeeper 的选举 leader 的过程（Eureka 是去中心化的）；客户端请求会自动切换 到新的 Eureka 节点；当宕机的服务器重新恢复后，Eureka 会再次将其纳入到服务器集群管理之中；而对于它来说，所有要做的无非是同步一些新的服务 注册信息而已。所以，再也不用担心有“掉队”的服务器恢复以后，会从 Eureka 服务器集群中剔除出去的风险了。Eureka 甚至被设计用来应付范围更广的`网络分割故障`，并实现`“0”宕机维护`需求。当网络分割故障发生时，每个 Eureka 节点，会持续的对外提供服务（注：ZooKeeper不会）：接收新的服务注册同时将它们提供给下游的服务发现请求。这样一来，就可以实现在同一个`子网中（same side of partition）`，新发布的服务仍然可以被发现与访问。Eureka 各个节点都是平等的，几个节点挂掉不会影响正常节点的工作，剩余的节点依然可以提供注册和查询服务。而 Eureka 的客户端在向某个 Eureka 注册或时如果发现连接失败，则会自动切换至其它节点，只要有一台 Eureka 还在，就能保证注册服务可用(保证可用性)，只不过查到的信息可能不是最新的(不保证强一致性)。除此之外，Eureka 还有一种自我保护机制，如果在`15分钟内`超过`85%的节点`都没有正常的心跳，那么 Eureka 就认为客户端与注册中心出现了网络故障，此时会出现以下几种情况：

1. Eureka 不再从注册列表中移除因为长时间没收到心跳而应该过期的服务
Eureka 仍然能够接受新服务的注册和查询请求，但是不会被同步到其它节点上(即保证当前节点依然可用)；

2. 当网络稳定时，当前实例新的注册信息会被同步到其它节点中；

3. Eureka 还有客户端缓存功能（注：Eureka 分为客户端程序与服务器端程序两个部分，客户端程序负责向外提供注册与发现服务接口）。 所以即便 Eureka 集群中所有节点都失效，或者发生网络分割故障导致客户端不能访问任何一台 Eureka 服务器；Eureka 服务的消费者仍然可以通过 Eureka 客户端缓存来获取现有的服务注册信息。甚至最极端的环境下，所有正常的 Eureka 节点都不对请求产生响应，也没有更好的服务器解决方案来解决这种问题时；得益于 Eureka 的客户端缓存技术，消费者服务仍然可以通过 Eureka 客户端查询与获取注册服务信息。


### Zookeeper 保证 CP

作为一个分布式协同服务，ZooKeeper 非常好，但是最为`服务发现`使用来说就不合适了；因为对于服务发现来说就算是服务端返回了`包含不真实的信息的结果`也比`什么都不返回`要好；再者，对于服务发现而言，宁可返回某服务 5 分钟之前在哪几个服务器上可用的信息，也`不能因为暂时的网络故障而找不到可用的服务器，而不返回任何结果`。所以说，用 ZooKeeper 来做`服务发现`是不太合适的。
当向注册中心查询服务列表时，我们可以容忍注册中心返回的是几分钟以前的注册信息，但不能接受服务直接 down 掉不可用的结果。也就是说，`服务注册功能对可用性的要求要高于一致性`。但是 ZooKeeper 会出现这样一种情况，当 master 节点因为网络故障与其他节点失去联系时，剩余节点会重新进行 leader 选举。问题在于，选举 leader 的时间太长`30 ~ 120s`, 且选举期间整个 ZooKeeper 集群都是不可用的，这就导致在选举期间注册服务瘫痪。在云部署的环境下，因网络问题使得 ZooKeeper 集群失去 master 节点是较大概率会发生的事，虽然服务能够最终恢复，但是漫长的选举时间导致的注册长期不可用是不能容忍的。

### 综上所述

Eureka 可以很好的应对因网络故障导致部分节点失去联系的情况，而不会像 zookeeper 那样使整个注册服务瘫痪。Eureka 作为单纯的服务注册中心来说要比 zookeeper 更加可靠，因为注册服务更重要的是可用性，我们可以接受短期内达不到一致性的状况。

作为一个分布式协同服务，ZooKeeper非常好，但是对于Service发现服务来说就不合适了；因为对于Service发现服务来说就算是 返回了包含不实的信息的结果也比什么都不返回要好；再者，对于Service发现服务而言，宁可返回某服务5分钟之前在哪几个服务器上可用的信息，也不能 因为暂时的网络故障而找不到可用的服务器，而不返回任何结果。所以说，用ZooKeeper来做Service发现服务是肯定错误的。

当向注册中心查询服务列表时，我们可以容忍注册中心返回的是几分钟以前的注册信息，但不能接受服务直接down掉不可用。也就是说，服务注册功能对可用性的要求要高于一致性。但是zk会出现这样一种情况，当master节点因为网络故障与其他节点失去联系时，剩余节点会重新进行leader选举。问题在于，选举leader的时间太长，30 ~ 120s, 且选举期间整个zk集群都是不可用的，这就导致在选举期间注册服务瘫痪。在云部署的环境下，因网络问题使得zk集群失去master节点是较大概率会发生的事，虽然服务能够最终恢复，但是漫长的选举时间导致的注册长期不可用是不能容忍的。

> 原文：https://juejin.cn/post/6844904185381519374
