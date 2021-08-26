---
title: Redis 有序集合
sidebar: auto
date: 2021-03-15
categories:
 - 数据库
tags:
 - Redis
---

Redis 有序集合（sorted set）与集合（set）一样也是 string 类型元素的集合，且不允许重复的成员。不同的是每个元素都会关联一个 double 类型的分数。redis 正是通过分数来为集合中的成员从小到大排序的。
有序集合的成员是唯一的，单分数（score）却可以重复。
集合是通过哈希表实现的，所以添加、删除、查找的复杂度是O(1)。集合中的最大成员数为 2^32 - 1 (4294967295, 每个集合可存储40多亿个成员)。

## Redis 有序集合命令

1、Redis Zadd 命令用于将一个或多个成员元素及其分数值加入到有序集当中。如果某个成员已经是有序集的成员，那么更新这个成员的分数值，并通过重新插入这个成员元素，来保证该成员在正确的位置上。分数值可以是整数值或双精度浮点数。如果有序集合 key 不存在，则创建一个空的有序集并执行 ZADD 操作。当 key 存在但不是有序集类型时，返回一个错误。

**格式：zadd key [NX|XX] [CH] [INCR] score member [score member ...]**

``` bash
127.0.0.1:6379> zadd namesSortedSet 1 tom 2.1 jsck 3.3 chi 4.5 fang 1.2 xin
(integer) 5
127.0.0.1:6379> zscan namesSortedSet 10
1) "0"
2)  1) "tom"
    2) "1"
    3) "xin"
    4) "1.2"
    5) "jsck"
    6) "2.1000000000000001"
    7) "chi"
    8) "3.2999999999999998"
    9) "fang"
   10) "4.5"
```

2、获取集合中元素的数量。

**格式：zcard key**

``` bash
127.0.0.1:6379> zcard namesSortedSet
(integer) 5
```

3、获取有序集合在指定分数区间(min - max)的成员个数。

**格式：zcount key min max**

``` bash
127.0.0.1:6379> zcount namesSortedSet 0 10
(integer) 5
127.0.0.1:6379> zcount namesSortedSet 2 10
(integer) 3
```

4、对有序集合中元素 member 的分数加上增量 increment

**格式：zincrby key increment member**

``` bash
127.0.0.1:6379> zscan namesSortedSet 10
1) "0"
2)  1) "tom"
    2) "1"
    3) "xin"
    4) "1.2"
    5) "jsck"
    6) "2.1000000000000001"
    7) "chi"
    8) "3.2999999999999998"
    9) "fang"
   10) "4.5"
127.0.0.1:6379> zincrby namesSortedSet 1 tom
"2"
127.0.0.1:6379> zscan namesSortedSet 10
1) "0"
2)  1) "xin"
    2) "1.2"
    3) "tom"
    4) "2"
    5) "jsck"
    6) "2.1000000000000001"
    7) "chi"
    8) "3.2999999999999998"
    9) "fang"
   10) "4.5"
```

5、Redis Zinterstore 命令计算给定的一个或多个有序集的交集，其中给定 key 的数量必须以 numkeys 参数指定，并将该交集(结果集)储存到 destination 。默认情况下，结果集中某个成员的分数值是所有给定集下该成员分数值之和。

**格式：zinterstore destination numkeys key [key ...] [WEIGHTS weight] [AGGREGATE SUM|MIN|MAX]**

``` bash
127.0.0.1:6379> zadd names1 1 tom 2 susan 3 jack 4 roles 5 mack
(integer) 5
127.0.0.1:6379> zscan names1 10
1) "0"
2)  1) "tom"
    2) "1"
    3) "susan"
    4) "2"
    5) "jack"
    6) "3"
    7) "roles"
    8) "4"
    9) "mack"
   10) "5"
127.0.0.1:6379> zinterstore names1_ 2 namesSortedSet names1
(integer) 1
127.0.0.1:6379> zscan names1_ 10
1) "0"
2) 1) "tom"
   2) "3"
127.0.0.1:6379> zscan namesSortedSet 10
1) "0"
2)  1) "xin"
    2) "1.2"
    3) "tom"
    4) "2"
    5) "jsck"
    6) "2.1000000000000001"
    7) "chi"
    8) "3.2999999999999998"
    9) "fang"
   10) "4.5"
```

6、计算有序集合中指定字典区间内成员数量

**格式：zlexcount key min max**

``` bash
127.0.0.1:6379> zlexcount names1 - +
(integer) 5
127.0.0.1:6379> zlexcount names1 [tom [jock
(integer) 0
```

7、Redis Zrange 返回有序集中，指定区间内的成员。其中成员的位置按分数值递增(从小到大)来排序。具有相同分数值的成员按字典序(lexicographical order )来排列。如果你需要成员按值递减(从大到小)来排列，请使用 `ZREVRANGE` 命令。下标参数 start 和 stop 都以 0 为底，也就是说，以 0 表示有序集第一个成员，以 1 表示有序集第二个成员，以此类推。你也可以使用负数下标，以 -1 表示最后一个成员， -2 表示倒数第二个成员，以此类推。

**格式：zrange key start stop [WITHSCORES]**

``` bash
127.0.0.1:6379> zrange names1 0 10
1) "tom"
2) "susan"
3) "jack"
4) "roles"
5) "mack"
127.0.0.1:6379> zrange names1 -1 12
1) "mack"
```

8、通过给定的字典区间返回有序集合的成员

**格式：zrangebylex key min max [LIMIT offset count]**

``` bash
127.0.0.1:6379> zrangebylex names1 [tom [susan
(empty array)
127.0.0.1:6379> zrangebylex names1 - +
1) "tom"
2) "susan"
3) "jack"
4) "roles"
5) "mack"
```

9、Redis Zrangebyscore 返回有序集合中指定分数区间的成员列表。有序集成员按分数值递增(从小到大)次序排列。具有相同分数值的成员按字典序来排列(该属性是有序集提供的，不需要额外的计算)。默认情况下，区间的取值使用闭区间 (小于等于或大于等于)，你也可以通过给参数前增加 ( 符号来使用可选的开区间 (小于或大于)。

**格式：zrangebyscore names1 0 2.1 [WITHSCORES] [LIMIT offset count]**

``` bash
127.0.0.1:6379> zrangebyscore names1 0 10
1) "tom"
2) "susan"
3) "jack"
4) "roles"
5) "mack"
127.0.0.1:6379> zrangebyscore names1 0 2.1
1) "tom"
2) "susan"
```

10、Redis Zrank 返回有序集中指定成员的排名。其中有序集成员按分数值递增(从小到大)顺序排列。

**格式：zrank key member**

``` bash
127.0.0.1:6379> zrank names1 tom
(integer) 0
127.0.0.1:6379> zrank names1 jack
(integer) 2
127.0.0.1:6379> zscan names1 10
1) "0"
2)  1) "tom"
    2) "1"
    3) "susan"
    4) "2"
    5) "jack"
    6) "3"
    7) "roles"
    8) "4"
    9) "mack"
   10) "5"
```

11、Redis Zrem 命令用于移除有序集中的一个或多个成员，不存在的成员将被忽略。当 key 存在但不是有序集类型时，返回一个错误。（在 Redis 2.4 版本以前， ZREM 每次只能删除一个元素。）

**格式：zrem key member [member ...]**

``` bash
127.0.0.1:6379> zscan names1 10
1) "0"
2)  1) "tom"
    2) "1"
    3) "susan"
    4) "2"
    5) "jack"
    6) "3"
    7) "roles"
    8) "4"
    9) "mack"
   10) "5"
127.0.0.1:6379> zrem names1 tom jack 111
(integer) 2
127.0.0.1:6379> zscan names1 10
1) "0"
2) 1) "susan"
   2) "2"
   3) "roles"
   4) "4"
   5) "mack"
   6) "5"
```

12、移除有序集合中给定的字典区间的所有成员

**格式：zremrangebylex key min max**

``` bash
127.0.0.1:6379> zremrangebylex names1 [tom [jakc
(integer) 0
```

13、移除有序集中，指定排名(rank)区间内的所有成员。

**格式：zremrangebyrank key start stop**

``` bash
127.0.0.1:6379> zscan namesSortedSet 10
1) "0"
2)  1) "xin"
    2) "1.2"
    3) "tom"
    4) "2"
    5) "jsck"
    6) "2.1000000000000001"
    7) "chi"
    8) "3.2999999999999998"
    9) "fang"
   10) "4.5"
127.0.0.1:6379> zremrangebyrank namesSortedSet 1 10
(integer) 4
127.0.0.1:6379> zscan namesSortedSet 10
1) "0"
2) 1) "xin"
   2) "1.2"
```

14、移除有序集中，指定分数（score）区间内的所有成员。

**格式：zremrangebyscore key min max**

``` bash
127.0.0.1:6379> zscan names1_ 10
1) "0"
2)  1) "jj"
    2) "0"
    3) "ss"
    4) "2"
    5) "ssdd"
    6) "3"
    7) "tom"
    8) "3"
    9) "sss"
   10) "9"
127.0.0.1:6379> clear
127.0.0.1:6379> zremrangebyscore names1_ 2 3
(integer) 3
127.0.0.1:6379> zscan names1_ 10
1) "0"
2) 1) "jj"
   2) "0"
   3) "sss"
   4) "9"
```

15、Redis Zrevrange 命令返回有序集中，指定区间内的成员。其中成员的位置按分数值递减(从大到小)来排列。具有相同分数值的成员按字典序的逆序(reverse lexicographical order)排列。除了成员按分数值递减的次序排列这一点外， `ZREVRANGE` 命令的其他方面和 `ZRANGE` 命令一样。

**格式：zrevrange key start stop [WITHSCORES]**

``` bash
127.0.0.1:6379> zrevrange names1 0 10
1) "mack"
2) "roles"
3) "susan"
127.0.0.1:6379> zrange names1 0 10
1) "susan"
2) "roles"
3) "mack"
```

16、Redis Zrevrangebyscore 返回有序集中指定分数区间内的所有的成员。有序集成员按分数值递减(从大到小)的次序排列。具有相同分数值的成员按字典序的逆序(reverse lexicographical order )排列。除了成员按分数值递减的次序排列这一点外，`ZREVRANGEBYSCORE` 命令的其他方面和 `ZRANGEBYSCORE` 命令一样。

**格式：zrevrangebyscore key max min [WITHSCORES] [LIMIT offset count]**

``` bash
127.0.0.1:6379> zrevrangebyscore names1 0 10
(empty array)
127.0.0.1:6379> zrangebyscore names1 0 10
1) "susan"
2) "roles"
3) "mack"
```

17、Redis Zrevrank 命令返回有序集中成员的排名。其中有序集成员按分数值递减(从大到小)排序。排名以 0 为底，也就是说，分数值最大的成员排名为 0 。使用 `ZRANK` 命令可以获得成员按分数值递增(从小到大)排列的排名。

**格式：zrevrank key member**

``` bash
127.0.0.1:6379> zrangebyscore names1 0 10
1) "susan"
2) "roles"
3) "mack"
127.0.0.1:6379> zrevrank names1 mack
(integer) 0
```

18、获取有序集中，成员的分数值。如果成员元素不是有序集 key 的成员，或 key 不存在，返回 nil 。

**格式：zscore key member**

``` bash
127.0.0.1:6379> zscore names1 susan
"2"
127.0.0.1:6379> zscan names1 10
1) "0"
2) 1) "susan"
   2) "2"
   3) "roles"
   4) "4"
   5) "mack"
   6) "5"
127.0.0.1:6379> zscore names1 mack
"5"
```

19、Redis Zunionstore 命令计算给定的一个或多个有序集的并集，其中给定 key 的数量必须以 numkeys 参数指定，并将该并集(结果集)储存到 destination 。默认情况下，结果集中某个成员的分数值是所有给定集下该成员分数值之和 。

**格式：zunionstore destination numkeys key [key ...] [WEIGHTS weight] [AGGREGATE SUM|MIN|MAX]**

``` bash
127.0.0.1:6379> zunionstore names1__ 2 names1 names1_
(integer) 5
127.0.0.1:6379> zscan names1__ 10
1) "0"
2)  1) "jj"
    2) "0"
    3) "susan"
    4) "2"
    5) "roles"
    6) "4"
    7) "mack"
    8) "5"
    9) "sss"
   10) "9"
127.0.0.1:6379> zscan names1 10
1) "0"
2) 1) "susan"
   2) "2"
   3) "roles"
   4) "4"
   5) "mack"
   6) "5"
127.0.0.1:6379> zscan names1_ 10
1) "0"
2) 1) "jj"
   2) "0"
   3) "sss"
   4) "9"
```

20、迭代有序集合中的元素（包括元素成员和元素分值）

**格式：zscan key cursor [MATCH pattern] [COUNT count]**

``` bash
127.0.0.1:6379> zscan names1 10 match * count 2
1) "0"
2) 1) "susan"
   2) "2"
   3) "roles"
   4) "4"
   5) "mack"
   6) "5"
```
