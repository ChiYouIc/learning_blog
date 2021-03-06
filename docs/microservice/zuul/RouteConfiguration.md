---
title: 路由配置
sidebar: auto
date: 2021-07-20
categories:
 - 微服务
tags:
 - SpringCloud
---

通过 zuul 服务代理实现服务访问。

## 搭建项目

创建模块 `microservice-netflix-zuul-gateway`

## pom.xml

添加 Eureka 与 Zuul 依赖。

``` xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Eureka -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-eureka</artifactId>
</dependency>

<!-- Zuul 网关 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-zuul</artifactId>
</dependency>
```

## application.yml

将 zuul 服务注册到 Eureka 服务中。

```yml
server:
  port: 9527

spring:
  application:
    name: zuul-gateway

# 配置 Eureka
eureka:
  instance:
    # 向 Eureka Server 注册时的实例名称
    instance-id: zuul-gateway-service
    # 访问路径直接显示 Eureka Client 的服务 IP
    prefer-ip-address: true
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      # 集群配置方式
      defaultZone: http://eurekaClusterServer01.com:8011/eureka/,http://eurekaClusterServer02.com:8012/eureka/,http://eurekaClusterServer03.com:8013/eureka/
```

## ZuulGatewayApplication

使用 `@EnableEurekaClient` 开启服务发现，将自己注册到 Eureka 服务中；使用 `@EnableZuulProxy` 开始 zuul 服务网关代理功能，后续访问服务提供者时，统一由 zuul 网关代理访问。

```java
@EnableZuulProxy
@EnableEurekaClient
@SpringBootApplication
public class ZuulGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZuulGatewayApplication.class, args);
    }
}
```

## 启动项目

分别启动项目中的服务提供者`microservice-provider-*` 以及 Eureka 服务集群 `microservice-netflix-eureka-cluster-server-*`，
首先访问 <a href='http://eurekaclusterserver01.com:8011/'>http://eurekaclusterserver01.com:8011/</a>，查看 Zuul 服务是否注册成功，如下：

<img :src="$withBase('/img/microservice/zuul/zuul服务.png')" alt="zuul服务">

通过 zuul 服务访问服务提供者时，我们只需要在 zuul 服务地址后面加上服务提供者的服务名称(注册到 Eureka 服务中的服务名称，注意不是 `eureka.instance.instance-id`， 而是 `spring.application.name`)和需要访问的资源 URI，
形如 `http://localhost:9527/{服务名称}/{URI}`；
访问<a href='http://localhost:9527/dept-server-provider/dept/list/'>http://localhost:9527/dept-server-provider/dept/list/</a>，
如下：

<img :src="$withBase('/img/microservice/zuul/通过zuul访问服务提供者-1.png')" alt="通过zuul访问服务提供者-1" />

通过 zuul 服务的路由代理功能，我们不需要再去关心服务提供者的位置。zuul 已经集成了 Ribbon 和 Hystrix，所以 zuul 也是具备负载均衡与服务容错的功能，并可以通过配置 Ribbon 和 Hystrix 的配置来配置 Zuul 服务；在通过 zuul 访问服务资源时已经发现，多次刷新会返现数据是来自不同的提供者(Ribbon
默认轮询负载均衡策略的作用，同样也是可以自定义负载均衡策略的)。

