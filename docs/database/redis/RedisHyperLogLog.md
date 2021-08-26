---
title: Redis HyperLogLog
sidebar: auto
date: 2021-03-03
categories:
 - 数据库
tags:
 - Redis
---

Redis 在 2.8.9 版本添加了 HyperLogLog 结构。

Redis HyperLogLog 是用来做基数统计的算法，HyperLogLog 的优点是，`在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定的、并且是很小的`。

在 Redis 里面，每个 HyperLogLog 键只需要花费 `12 KB` 内存，就可以计算接近 `2^64` 个不同元素的基数。这和计算基数时，元素越多耗费内存就越多的集合形成鲜明对比。

但是，因为 HyperLogLog 只会根据输入元素来计算基数，而不会储存输入元素本身，所以 HyperLogLog 不能像集合那样，返回输入的各个元素。

::: tip
## 什么是基数？

比如数据集 {1, 3, 5, 7, 5, 7, 8}， 那么这个数据集的基数集为 {1, 3, 5 ,7, 8}, 基数(不重复元素)为5。 基数估计就是在误差可接受的范围内，快速计算基数。
:::

## Redis HyperLogLog 命令

1. 添加指定元素到 HyperLogLog 中。

**格式：pfadd key element [element ...]**

``` shell script
127.0.0.1:6379> pfadd num_1 1
(integer) 1
127.0.0.1:6379> pfadd num_1 2
(integer) 1
127.0.0.1:6379> pfadd num_1 2
(integer) 0
127.0.0.1:6379> pfadd num_1 4
(integer) 1
127.0.0.1:6379> pfadd num_1 4
(integer) 0
127.0.0.1:6379> pfadd num_1 8
(integer) 1
127.0.0.1:6379> pfadd num_1 5
(integer) 1
127.0.0.1:6379> pfadd num_1 5
(integer) 0
```

2. 返回给定 HyperLogLog 的基数估算值。

**格式：pfcount key [key ...]**

``` shell script
127.0.0.1:6379> pfcount num_1
(integer) 5
```

3. 将多个 HyperLogLog 合并为一个 HyperLogLog。

**格式：pfmerge destkey sourcekey [sourcekey ...]**

``` shell script
127.0.0.1:6379> pfadd num_2 4   # 新创建一个 HyperLogLog num_2
(integer) 1
127.0.0.1:6379> pfadd num_2 2
(integer) 1
127.0.0.1:6379> pfadd num_2 9
(integer) 1
127.0.0.1:6379> pfadd num_2 11
(integer) 1
127.0.0.1:6379> pfadd num_2 14
(integer) 1
127.0.0.1:6379> pfcount num_1 num_2 # 获取 num_1 与 num_2 两个数据集中的基数，注意这里是将两个数据集合并之后的基数
(integer) 8
127.0.0.1:6379> pfmerge num_total num_1 num_2 # 将 num_1 和 num_2 合并为一个 num_total
OK
127.0.0.1:6379> pfcount num_total
(integer) 8
```
