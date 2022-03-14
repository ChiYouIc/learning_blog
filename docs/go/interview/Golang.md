---
title: Golang 面试题
sidebar: auto
date: 2022-02-21
categories:
 - Go
tags:
 - 面试
---



## gRPC为什么高效

- 采用 protobuf 的二进制数据流通信，相比 json 数据，体积更小（无需分隔符、空字段省略、tag二进制表示），解码速度更快；
- 采用 http 2.0 协议通信（http 2.0 与 http1 和 http 1.1 对比）。
