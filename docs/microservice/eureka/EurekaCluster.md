---
title: Eureka 集群搭建
sidebar: auto
date: 2021-08-05
categories:
 - 微服务
tags:
 - SpringCloud
---

Eureka 是支持服务集群的，它与 Zookeeper 集群不一样，Eureka 集群是去中心化的，是没有主节点和从节点之分的，每一个 Eureka Server 都是独立开的，每一个 Eureka Server 是通过配置去发现其他 Eureka Server 的，包括 Eureka Client 也是需要通过配置才能知道往哪里注册。

## 搭建项目

这里创建了三个 Eureka Server，分别是 `microservice-netflix-eureka-cluster-server-01`、`microservice-netflix-eureka-cluster-server-02`、`microservice-netflix-eureka-cluster-server-03`，两个 Eureka Client `microservice-netflix-eureka-client` 和 `microservice-provider-01`。

<img :src="$withBase('/img/microservice/eureka/创建集群工程.png')" alt="创建集群工程">

## 添加依赖

`microservice-netflix-eureka-client` 模块与上一章节中的保持一致，包括我们另外三个 Eureka Server 中的 pom.xml 都是与上一章节中 Eureka Server 保持一致的，只是模块名不一样罢了。Eureka 服务集群的重点是在 `application.yml` 配置文件上。

## Eureka Server 配置

::: tip
在开始配置  Eureka Server 集群前，我们需要先配置本地计算机的 DNS，配置本地 DNS 转发策略是为了方便演示 Eureka Server 集群的访问，根据不用的域名访问测试会更为直观。首先打开本地路径 `C:\Windows\System32\drivers\etc`，以管理员方式打开该文件目录下的 `hosts` 文件，并在文件末尾添加如下内容
``` bash
127.0.0.1  eurekaClusterServer01.com
127.0.0.1  eurekaClusterServer02.com
127.0.0.1  eurekaClusterServer03.com
```
当本地计算机访问这些域名时，会统一转发到 127.0.0.1 这个 IP 上（其实就是访问自己的本地服务，每个域名后面还要添加上对应的服务端口号）
:::

### microservice-netflix-eureka-cluster-server-01

``` yml
server:
  port: 8011

spring:
  application:
    # 配置服务名称
    name: eureka-cluster-server-01

# Eureka 配置
eureka:
  # Eureka Server 实例配置
  instance:
    hostname: eurekaClusterServer01.com
  client:
    # 是否从注册表中获取服务（作为注册中心不需要开启）
    fetch-registry: false
    # 是否向 Eureka 注册（作为服务中心不要开启）
    register-with-eureka: false
    service-url:
      defaultZone: http://eurekaClusterServer01.com:8011/eureka/,http://eurekaClusterServer02.com:8012/eureka/,http://eurekaClusterServer03.com:8013/eureka/
  server:
    # Eureka 自我保护机制（默认开启）
    enable-self-preservation: true
    # 开启自我保护模式比例阈值，当收到心跳包占期望收到心跳包数量低于这个值，进入自我保护模式（默认 0.85）。
    renewal-percent-threshold: 0.85
```

### microservice-netflix-eureka-cluster-server-02

``` yml
server:
  port: 8012

spring:
  application:
    # 配置服务名称
    name: eureka-cluster-server-02

# Eureka 配置
eureka:
  # Eureka Server 实例配置
  instance:
    hostname: eurekaClusterServer02.com
  client:
    # 是否从注册表中获取服务（作为注册中心不需要开启）
    fetch-registry: false
    # 是否向 Eureka 注册（作为服务中心不要开启）
    register-with-eureka: false
    service-url:
      defaultZone: http://eurekaClusterServer01.com:8011/eureka/,http://eurekaClusterServer02.com:8012/eureka/,http://eurekaClusterServer03.com:8013/eureka/
  server:
    # Eureka 自我保护机制（默认开启）
    enable-self-preservation: true
    # 开启自我保护模式比例阈值，当收到心跳包占期望收到心跳包数量低于这个值，进入自我保护模式（默认 0.85）。
    renewal-percent-threshold: 0.85
```

### microservice-netflix-eureka-cluster-server-03

``` yml
server:
  port: 8013

spring:
  application:
    # 配置服务名称
    name: eureka-cluster-server-03

# Eureka 配置
eureka:
  # Eureka Server 实例配置
  instance:
    hostname: eurekaClusterServer03.com
  client:
    # 是否从注册表中获取服务（作为注册中心不需要开启）
    fetch-registry: false
    # 是否向 Eureka 注册（作为服务中心不要开启）
    register-with-eureka: false
    service-url:
      defaultZone: http://eurekaClusterServer01.com:8011/eureka/,http://eurekaClusterServer02.com:8012/eureka/,http://eurekaClusterServer03.com:8013/eureka/
  server:
    # Eureka 自我保护机制（默认开启）
    enable-self-preservation: true
    # 开启自我保护模式比例阈值，当收到心跳包占期望收到心跳包数量低于这个值，进入自我保护模式（默认 0.85）。
    renewal-percent-threshold: 0.85
```

启动类这里就不再演示，与上一章节的一样，只要在对应的启动类上添加 `@EnableEurekaServer` 注解标记为 Eureka Server 即可。

## Eureka Client 配置

### microservice-netflix-eureka-client

``` yml
server:
  port: 8080

spring:
  application:
    # 配置服务名称（作为 Eureka Client 向 Eureka Server 注册时的服务名）
    name: eureka-client

eureka:
  instance:
    # 向 Eureka Server 注册时的实例名称
    instance-id: eureka-client
    # 访问路径直接显示 Eureka Client 的服务 IP
    prefer-ip-address: true
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      # 集群配置方式
      defaultZone: http://eurekaClusterServer01.com:8011/eureka/,http://eurekaClusterServer02.com:8012/eureka/,http://eurekaClusterServer03.com:8013/eureka/
```

### microservice-provider-01

``` yml
server:
  port: 8081

spring:
  application:
    # 配置服务名称（作为 Eureka Client 向 Eureka Server 注册时的服务名）
    name: provider-01

eureka:
  instance:
    # 向 Eureka Server 注册时的实例名称
    instance-id: provider-01
    # 访问路径直接显示 Eureka Client 的服务 IP
    prefer-ip-address: true
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      # 集群配置方式
      defaultZone: http://eurekaClusterServer01.com:8011/eureka/,http://eurekaClusterServer02.com:8012/eureka/,http://eurekaClusterServer03.com:8013/eureka/
```

启动类这里就不再演示，与上一章节的一样，只要在对应的启动类上添加 `@EnableEurekaClient`、`@EnableDiscoveryClient` 注解标记为 Eureka Client 即可。

## 启动服务

分别启动 Eureka 集群服务和 Eureka Client，并分别访问 <a href="http://eurekaClusterServer01.com:8011">http://eurekaClusterServer01.com:8011</a>、<a href="http://eurekaClusterServer01.com:8012">http://eurekaClusterServer01.com:8012</a>、<a href="http://eurekaClusterServer01.com:8013">http://eurekaClusterServer01.com:8013</a>。在每个页面中的 `DS Replicas` 中可以看到另外两个 Eureka Server，并且在 `Instances currently registered with Eureka` 中可以看到注册的两个服务。

<img :src="$withBase('/img/microservice/eureka/Eureka Server 8011.png')" alt="Eureka Server 8011">

<img :src="$withBase('/img/microservice/eureka/Eureka Server 8012.png')" alt="Eureka Server 8011">

<img :src="$withBase('/img/microservice/eureka/Eureka Server 8013.png')" alt="Eureka Server 8011">
