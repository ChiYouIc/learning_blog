---
title: 服务监控
sidebar: auto
date: 2021-07-20
categories:
 - 微服务
tags:
 - SpringCloud
---

Hystrix 除了隔离依赖服务的调用以外，Hystrix 还提供了准确实时的调用监控（Hystrix Dashboard），
Hystrix 会持续记录所有通过 Hystrix 发起的请求的执行信息，并以统计报表和图形的形式展示给用户，
包括每秒执行多少请求、多少成功、多少失败等等。Netflix 通过 hystrix-metrics-event-stream 项目实现了对
以上指标的监控，Spring Cloud 也提供了 Hystrix Dashboard 的整合，对监控内容转化成可视化界面。

## 创建项目

直接修改 `microservice-consumer-hystrix` 模块

### pom.xml

