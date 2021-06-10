# Redis 哈希(Hash)

Redis hash 是一个 string 类型的 field（字段）和 value（值）的映射表，hash 特别适合用于存储对象。

Redis 中每个 hash 可以存储 2^32 - 1 键值对。

# Redis hash 命令

1、删除一个或多个哈希表字段

**格式：hdel key field [field ...]**

``` bash
127.0.0.1:6379> hget tom age
"12"
127.0.0.1:6379> hdel tom age
(integer) 1
127.0.0.1:6379> hgetall tom
1) "name"
2) "tom"
3) "addr"
4) "chongqing"
```

2、查看哈希表 key 中，指定的字段是否存在

**格式：hexists key field**

``` bash
127.0.0.1:6379> hexists tom age
(integer) 0
127.0.0.1:6379> hexists tom name
(integer) 1
127.0.0.1:6379> hexists name name    # 报错，找不到对应的key
(error) WRONGTYPE Operation against a key holding the wrong kind of value
```

3、获取存储在哈希表中指定字段的值。

**格式：hget key field**

``` bash
127.0.0.1:6379> hget tom name
"tom"
127.0.0.1:6379> hget tom age
(nil)
127.0.0.1:6379> hget tom addr
"chongqing"
```

4、获取在哈希表中指定 key 的所有字段和值

**格式：hgetall key**

``` bash
127.0.0.1:6379> hgetall tom
1) "name"
2) "tom"
3) "addr"
4) "chongqing"
127.0.0.1:6379> hgetall tony    # 不存在 tony 这样的 key 对应的 hash 表
(empty array)
```

5、为哈希表 key 中的指定字段的整数值加上增量 increment

**格式：hincrby key field increment**

``` bash
127.0.0.1:6379> hset tom age 23
(integer) 1
127.0.0.1:6379> hgetall tom
1) "name"
2) "tom"
3) "addr"
4) "chongqing"
5) "age"
6) "23"
127.0.0.1:6379> hincrby tom age 2
(integer) 25
127.0.0.1:6379> hget tom age
"25"
```

6、为哈希表 key 中的指定字段的浮点数值加上增量 increment

**格式：hincrbyfloat key field increment**

``` bash
127.0.0.1:6379> hincrbyfloat tom age 12.12112112
"37.12112112"
127.0.0.1:6379> hget tom age
"37.12112112"
```

7、获取一个 key 对应的 hash 表的所有的 field

**格式：hkeys key**

``` bash
127.0.0.1:6379> hkeys tom
1) "name"
2) "addr"
3) "age"
```

8、获取哈希表中字段数量。

**格式：hlen key**

``` bash
127.0.0.1:6379> hlen tom
(integer) 3
```

9、获取所有给定字段的值。

**格式：hmget key field [field ...]**

``` bash
127.0.0.1:6379> hmget tom name age addr
1) "tom"
2) "37.12112112"
3) "chongqing"
```

10、新增一个 hash 映射表。

**格式： hmset key field value [field value ...]**

``` bash
127.0.0.1:6379> hmset tom name tom age 12 addr chongqing
OK
127.0.0.1:6379> hmget tom name
1) "tom"
127.0.0.1:6379> hmget tom age
1) "12"
127.0.0.1:6379> hmget tom addr
1) "chongqing"
127.0.0.1:6379> hgetall tom
1) "name"
2) "tom"
3) "age"
4) "12"
5) "addr"
6) "chongqing"
```

11、静安哈希表 key 中的字段 filed 的值设置为 value

**格式：hset key field value [field value ...]**

``` bash
127.0.0.1:6379> hset tony name tony age 23 addr guangdong
(integer) 3
127.0.0.1:6379> keys tony
1) "tony"
127.0.0.1:6379> hmget tony name age addr
1) "tony"
2) "23"
3) "guangdong"
127.0.0.1:6379> hkeys tony
1) "name"
2) "age"
3) "addr"
```

12、只有字段 field 不存在时，设置哈希表字段的值才生效

**格式：hsetnx key field value**

``` bash
127.0.0.1:6379> hsetnx tony naem roles
(integer) 1
127.0.0.1:6379> hsetnx tony name roles
(integer) 0
```

13、获取哈希表中所有值

**格式：hvals key**

``` bash
127.0.0.1:6379> hvals tony
1) "tony"
2) "23"
3) "guangdong"
4) "roles"
```

14、迭代哈希表中的键值对

**格式：hscan key cursor [MATCH pattern] [COUNT count]**

*   cursor - 游标。
*   pattern - 匹配的模式。
*   count - 指定从数据集里返回多少元素，默认值为 10

``` bash
127.0.0.1:6379> hscan tony 0 match * count 10
1) "0"
2) 1) "name"
   2) "tony"
   3) "age"
   4) "23"
   5) "addr"
   6) "guangdong"
   7) "naem"
   8) "roles"
```
