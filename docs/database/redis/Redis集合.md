# Redis 集合(Set)

Redis 的 Set 是 String 类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据。
Redis 中集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是 O(1)。集合中最大的成员数量为 `2^32 - 1` (4294967295，每个集合可存储 40 多亿个成员)。

# Redis 集合命令

1、向集合添加一个或多个元素

**格式：sadd key member [member ...]**

``` bash
127.0.0.1:6379> sadd names tom roles jock tom
(integer) 3
```

2、获取集合成员个数
**格式：scard key**
``` bash
127.0.0.1:6379> scard names
(integer) 3
```

3、获取第一个集合与其它集合之间的差异

**格式：sdiff key [key ...]**

``` bash
127.0.0.1:6379> sscan names 0
1) "0"
2) 1) "tom"
   2) "roles"
   3) "jock"
127.0.0.1:6379> sscan names0 0
1) "0"
2) 1) "tom"
   2) "fang"
   3) "you"
   4) "chi"
   5) "jock"
127.0.0.1:6379> sdiff names names0
1) "roles"
127.0.0.1:6379> sdiff names0 names
1) "you"
2) "chi"
3) "fang"
```

4、获取给定所有集合的差集并存储在 destination 中

**格式：sdiffstore destination key [key ...]**

``` bash
127.0.0.1:6379> sdiffstore namedistination names names0
(integer) 1
127.0.0.1:6379> sscan namedistination 0
1) "0"
2) 1) "roles"
127.0.0.1:6379> sscan names 0
1) "0"
2) 1) "jock"
   2) "tom"
   3) "roles"
127.0.0.1:6379> sscan names0 0
1) "0"
2) 1) "jock"
   2) "you"
   3) "fang"
   4) "chi"
   5) "tom"
```

5、获取所有集合的交集

**格式：sinter key [key ...]**

``` bash
127.0.0.1:6379> sinter names names0
1) "jock"
2) "tom"
```

6、获取所有集合的交集并存储到 destionation 中

**格式：sinterstore destination key [key ...]**

``` bash
127.0.0.1:6379> sinterstore namesinterstore names names0
(integer) 2
127.0.0.1:6379> sscan namesinterstore 0
1) "0"
2) 1) "jock"
   2) "tom"
127.0.0.1:6379> sscan names 0
1) "0"
2) 1) "jock"
   2) "tom"
   3) "roles"
127.0.0.1:6379> sscan names0 0
1) "0"
2) 1) "jock"
   2) "you"
   3) "fang"
   4) "chi"
   5) "tom"
```

7、判断元素 member 是否为 key 的一个子元素

**格式：sismember key member**

``` bash
127.0.0.1:6379> sismember names tom
(integer) 1
127.0.0.1:6379> sismember names cc
(integer) 0
```

8、返回集合中的所有元素

**格式：smembers key**

``` bash
127.0.0.1:6379> smembers names
1) "jock"
2) "tom"
3) "roles"
```

9、将元素 member 从 source 移动到 destination 集合中

**格式：smove source destination member**

``` bash
127.0.0.1:6379> smove names names2 tom
(integer) 1
127.0.0.1:6379> smembers names
1) "jock"
2) "roles"
127.0.0.1:6379> smembers names2
1) "tom"
```

10、从集合中随机移除并返回 count 个元素，count 默认值为 1

**格式：spop key [count]**

``` bash
127.0.0.1:6379> smembers names
1) "jock"
2) "chi"
3) "tom"
4) "roles"
5) "you"
127.0.0.1:6379> spop names
"roles"
127.0.0.1:6379> spop names 2
1) "tom"
2) "chi"
127.0.0.1:6379> smembers names
1) "you"
2) "jock"
```

11、从集合中随机返回 count 个元素，count 默认值为 1

**格式：srandmember key [count]**

``` bash
127.0.0.1:6379> smembers names
1) "you"
2) "jock"
127.0.0.1:6379> srandmember names
"jock"
127.0.0.1:6379> srandmember names 2
1) "jock"
2) "you"
```

12、随机移除集合中的一个或多个元素

**格式：srem key member [member ...]**

``` bash
127.0.0.1:6379> smembers names
1) "you"
2) "jock"
127.0.0.1:6379> srem names tom jock oo
(integer) 1
127.0.0.1:6379> smembers names
1) "you"
```

13、获取所有给定集合的并集

**格式：sunion key [key ...]**

``` bash
127.0.0.1:6379> smembers names
1) "you"
127.0.0.1:6379> smembers names0
1) "you"
2) "jock"
3) "chi"
4) "tom"
5) "fang"
127.0.0.1:6379> smembers names2
1) "tom"
127.0.0.1:6379> sunion names names
1) "you"
127.0.0.1:6379> sunion names names0
1) "jock"
2) "tom"
3) "chi"
4) "you"
5) "fang"
127.0.0.1:6379> sunion names names0 names2
1) "tom"
2) "chi"
3) "you"
4) "jock"
5) "fang"
```

14、获取给定集合的并集并将其存储在 destionation 集合中

**格式：sunionstore destination key [key ...]**

``` bash
127.0.0.1:6379> sunionstore sunionstore names names0
(integer) 5
127.0.0.1:6379> smembers sunionstore
1) "jock"
2) "tom"
3) "chi"
4) "you"
5) "fang"
```

15、迭代集合中的元素，返回值第一个表示 cursor 游标，即下一个元素迭代的游标

**格式：sscan key cursor [MATCH pattern] [COUNT count]**

* cursor：游标，表示从何处开始
* MATCH pattern：匹配模式
* COUNT count：返回元素数量

``` bash
127.0.0.1:6379> sscan names0 0 match * count 1
1) "2"
2) 1) "jock"
```