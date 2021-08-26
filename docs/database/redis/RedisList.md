---
title: Redis 列表(List)
sidebar: auto
date: 2021-03-07
categories:
 - 数据库
tags:
 - Redis
---

Redis 列表是简单的字符串列表，按照插入顺序排序。可以在列表头部和尾部随意添加元素。
一个列表最多可以包含`2^32 - 1`个元素。

## Redis 列表命令

1、将一个或多个值插入到列表头部。

**格式：lpush key element [element ...]**

``` bash
127.0.0.1:6379> lpush names tom tony downey
(integer) 3
127.0.0.1:6379> lrange names 0 10
1) "downey"
2) "tony"
3) "tom"
```

2、与`plush`命令一样，不一样的是，如果 key 不存在，则不会添加

**格式：lpushx key element [element ...]**

``` bash
127.0.0.1:6379> lpushx names you
(integer) 4
127.0.0.1:6379> lrange names 0 10
1) "you"
2) "downey"
3) "tony"
4) "tom"
```

3、获取列表指定范围内的元素

**格式：lrange key start stop**

``` bash
127.0.0.1:6379> lrange names 0 10
1) "you"
2) "downey"
3) "tony"
4) "tom"
```

4、根据 count 的值，移除列表中与参数 element 相等的元素

**格式：lrem key count element**

* count > 0：从列表头部向尾部搜索，移除与 element 相等的元素，数量为 count
* count < 0：从列表尾部向头部搜索，移除与 element 相等的元素，数量为 count
* count = 0：移除表中所有与 element 相等的元素

``` bash
127.0.0.1:6379> lrem names 0 tom
(integer) 1
127.0.0.1:6379> lrange names 0 19
1) "you"
2) "downey"
3) "tony"
```

5、通过 index 索引，将该位置的元素替换为 element

**格式：lset key index element**

``` bash
127.0.0.1:6379> lset names 3 mam    # 报错，超出了列表长度
(error) ERR index out of range
127.0.0.1:6379> lrange names 0 10
1) "you"
2) "downey"
3) "tony"
127.0.0.1:6379> lset names 1 mam
OK
127.0.0.1:6379> lrange names 0 10
1) "you"
2) "mam"
3) "tony"
```

6、对一个列表进行修剪，也就是说，让列表只保留指定区域内的元素（start - stop），不在指定区域之内的元素都将被删除

**格式：ltrim key start stop**

``` bash
127.0.0.1:6379> lrange names 0 10
1) "you"
2) "mam"
3) "tony"
127.0.0.1:6379> ltrim names 0 1    # 修剪
OK
127.0.0.1:6379> lrange names 0 10
1) "you"
2) "mam"
```

7、移除列表最后一个元素，并且将其返回

**格式：rpop key**

``` bash
127.0.0.1:6379> rpop names
"mam"
127.0.0.1:6379> lrange names 0 10
1) "you"
```

8、移除列表头部元素，并将其返回

**格式：lpop key**

``` bash
127.0.0.1:6379> lrange names 0 10
1) "roles"
2) "jock"
3) "tony"
4) "you"
127.0.0.1:6379> lpop names
"roles"
```

9、将 source 最后一个元素 rpop，然后 lpush 到 destination 列表中（出栈然后又跑到了另一个栈里面去了）

**格式：rpoplpush source destination**

``` bash
127.0.0.1:6379> rpoplpush names nicknames
"you"
127.0.0.1:6379> lrange nicknames 0 10
1) "you"
127.0.0.1:6379> lrange names 0 10
1) "jock"
2) "tony"
```

10、在列表末尾添加一个或多个元素

**格式：rpush key element [element ...]**

``` bash
127.0.0.1:6379> rpush names aa ss cc bb
(integer) 6
127.0.0.1:6379> lrange names 0 10
1) "jock"
2) "tony"
3) "aa"
4) "ss"
5) "cc"
6) "bb"
```

11、与`rpush`一样，不一样的是，如果 key 不存在，则不会添加

**格式：rpushx key element [element ...]**

``` bash
127.0.0.1:6379> rpushx names ii oo pp
(integer) 9
127.0.0.1:6379> lrange names 0 10
1) "jock"
2) "tony"
3) "aa"
4) "ss"
5) "cc"
6) "bb"
7) "ii"
8) "oo"
9) "pp"
```

12、获取列表长度

**格式：llen key**

``` bash
127.0.0.1:6379> llen names
(integer) 9
```

13、通过索引获取列表中的元素

**格式：lindex key index**

``` bash
127.0.0.1:6379> lindex names 3
"ss"
```

14、往列表指定元素(`pivot`)前(`before`)或后(`after`)插入元素，当指定元素不存在时，不执行操作。如果 key 不是一个列表类型，返回一个错误

**格式：linsert key BEFORE|AFTER pivot element**

> 当没有找到指定元素(`pivot`)时，返回-1，如果 key 不存在或是一个空列表，返回 0

``` bash
127.0.0.1:6379> lrange names 0 10
1) "jock"
2) "tony"
3) "aa"
4) "ss"
5) "cc"
6) "bb"
7) "ii"
8) "oo"
9) "pp"
127.0.0.1:6379> linsert names after aa bb
(integer) 10
127.0.0.1:6379> lrange names 0 10
 1) "jock"
 2) "tony"
 3) "aa"
 4) "bb"
 5) "ss"
 6) "cc"
 7) "bb"
 8) "ii"
 9) "oo"
10) "pp"
127.0.0.1:6379> linsert names before aa 00
(integer) 11
127.0.0.1:6379> lrange names 0 10
 1) "jock"
 2) "tony"
 3) "00"
 4) "aa"
 5) "bb"
 6) "ss"
 7) "cc"
 8) "bb"
 9) "ii"
10) "oo"
11) "pp"
```

15、移除并获取列表得第一个元素，如果列表中没有元素会阻塞列表直到等待超时或发现可弹出元素为止

**格式：blpop key [key ...] timeout**

* timeout：等待超时（单位：秒）

``` bash
127.0.0.1:6379> lpush names tom tony
(integer) 2
127.0.0.1:6379> blpop names 1
1) "names"
2) "tony"
127.0.0.1:6379> blpop names 1
1) "names"
2) "tom"
127.0.0.1:6379> blpop names 1    # 列表已经为空
(nil)
(1.06s)
```

16、将一个值插入到已存在的列表头部

**格式： LPUSHX key value**

``` bash
127.0.0.1:6379> lpush names tom tony downey
(integer) 3
127.0.0.1:6379> brpop names 1
1) "names"
2) "tom"
127.0.0.1:6379> brpop names 1
1) "names"
2) "tony"
127.0.0.1:6379> brpop names 1
1) "names"
2) "downey"
127.0.0.1:6379> brpop names 1
(nil)
(1.03s)
```

17、从列表中弹出一个值，将弹出的元素插入到另外一个列表中并返回它； 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。

**格式：brpoplpush source destination timeout**

``` bash
127.0.0.1:6379> lpush names tom tony
(integer) 2
127.0.0.1:6379> brpoplpush names names1 1
"tom"
127.0.0.1:6379> brpoplpush names names1 1
"tony"
127.0.0.1:6379> brpoplpush names names1 1
(nil)
(1.05s)
127.0.0.1:6379> lrange names1 0 10
1) "tony"
2) "tom"
127.0.0.1:6379> lrange names 0 10
(empty array)
```
