# Redis 字符串(String)

Redis 字符串数据类型的相关命令用于管理 redis 字符串值。

# Redis 字符串命令

Redis 字符串操作包含 set 和 get 命令操作，我们在上一节 键(key) 中已经使用过，这里就不再累述。

1、返回 key 中指定起始位置的字串。

**格式：getrange key start end**

``` bash
127.0.0.1:6379> get name
"tom"
127.0.0.1:6379> getrange name 1 1
"o"
```

2、将给定的 key 的值设置为 value，并将旧的 value 值返回

**格式：getset key value**

``` bash
127.0.0.1:6379> get name
"tom"
127.0.0.1:6379> getset name downey you
(error) ERR wrong number of arguments for 'getset' command
127.0.0.1:6379> getset name downey_you
"tom"
127.0.0.1:6379> get name
"downey_you"
```

3、对 key 所储存的字符串值，获取指定偏移量上的位(bit)。(本意就是获取key对应value二进制表示中，从左至右第offset位的值)

**格式：getbit key offset**

``` bash
127.0.0.1:6379> get name
"downey_you"
127.0.0.1:6379> getbit name 1
(integer) 1
127.0.0.1:6379> getbit name 7
(integer) 0
127.0.0.1:6379> getbit name 3
(integer) 0
127.0.0.1:6379> getbit name 2
(integer) 1
127.0.0.1:6379> getbit name 1
(integer) 1
```

4、获取所有(一个或多个)给定 key 的值

**格式：mget key [key ...]**

``` bash
127.0.0.1:6379> mget name tony
1) "downey_you"
2) "true"
```

5、对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)

**格式： setbit key offset value**

``` bash
127.0.0.1:6379> set name tom
OK
127.0.0.1:6379> get name
"tom"
127.0.0.1:6379> getbit name 1
(integer) 1
127.0.0.1:6379> setbit name 1 0
(integer) 1
127.0.0.1:6379> getbit name 1
(integer) 0
127.0.0.1:6379> get name
"4om"
```

6、将值 value 关联到 key ，并将 key 的过期时间设为 seconds (以秒为单位)

**格式：setex key seconds value**

``` bash
127.0.0.1:6379> setex age 60 12
OK
127.0.0.1:6379> get age
"12"
127.0.0.1:6379> ttl age
(integer) 52
```

7、只有在 key 不存在时设置 key 的值

**格式：setnx key value**

``` bash
127.0.0.1:6379> keys *
1) "address"
2) "name"
127.0.0.1:6379> setnx name tony
(integer) 0
127.0.0.1:6379> setnx age 12
(integer) 1
```

8、用 value 参数覆写给定 key 所储存的字符串值，从偏移量 offset 开始

**格式：setrange key offset value**

``` bash
127.0.0.1:6379> setrange name 1 8
(integer) 3
127.0.0.1:6379> get name
"48m"
127.0.0.1:6379> get name
"48m"
127.0.0.1:6379> setrange name 0 t
(integer) 3
127.0.0.1:6379> get name
"t8m"
127.0.0.1:6379> setrange name 1 o
(integer) 3
127.0.0.1:6379> get name
"tom"
```

9、获取指定 key 对应的 value 的长度

**格式：strlen key**

``` bash
127.0.0.1:6379> strlen name
(integer) 3
127.0.0.1:6379> get name
"tom"
```

10、同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在

**格式：mset key value [key value ...]**

``` bash
127.0.0.1:6379> mset name tony age 12 address chongqing
OK
127.0.0.1:6379> keys *
1) "address"
2) "age"
3) "name"
127.0.0.1:6379> get name
"tony"
127.0.0.1:6379> get age
"12"
127.0.0.1:6379> get address
"chongqing"
```

11、这个命令和 SETEX 命令相似，但它以毫秒为单位设置 key 的生存时间，而不是像 SETEX 命令那样，以秒为单位

**格式：psetex key milliseconds value**

``` bash
127.0.0.1:6379> psetex cardId 6000 123456
OK
127.0.0.1:6379> get cardId
"123456"
127.0.0.1:6379> ttl cardId
(integer) -2
127.0.0.1:6379> get cardId
(nil)
```

12、将 key 中储存的数字值增一

**格式：incr key**

``` bash
127.0.0.1:6379> incr age
(integer) 13
127.0.0.1:6379> get age
"13"
127.0.0.1:6379> incr age
(integer) 14
127.0.0.1:6379> get age
"14"
127.0.0.1:6379> incr name    # 报错，name 对应的 value 不是一个 integer 数值
(error) ERR value is not an integer or out of range
127.0.0.1:6379> get name
"tony"
```

13、将 key 所储存的值加上给定的增量值（increment）

**格式：incrby key increment**

``` bash
127.0.0.1:6379> incrby age 12
(integer) 26
127.0.0.1:6379> get age
"26"
```

14、将 key 所储存的值加上给定的浮点增量值（increment）

**格式：incrbyfloat key increment**

``` bash
127.0.0.1:6379> incrbyfloat age 12.12
"38.12"
127.0.0.1:6379> get age
"38.12"
```

15、将 key 中储存的数字值减一

**格式：decr key**

``` bash
127.0.0.1:6379> decr age    # 报错，因为我们的 age 存储的是一个浮点数
(error) ERR value is not an integer or out of range
127.0.0.1:6379> get age
"38.12"
127.0.0.1:6379> set age 12    # 重新 set 新的 value
OK
127.0.0.1:6379> decr age
(integer) 11
127.0.0.1:6379> get age
"11"
```

16、key 所储存的值减去给定的减量值（decrement）

**格式：decrby key decrement**

``` bash
127.0.0.1:6379> decrby age 13
(integer) -2
127.0.0.1:6379> get age
"-2"
```

17、如果 key 已经存在并且是一个字符串， APPEND 命令将指定的 value 追加到该 key 原来值（value）的末尾

**格式：append key value**

``` bash
127.0.0.1:6379> get name
"tony"
127.0.0.1:6379> append name i am
(error) ERR wrong number of arguments for 'append' command
127.0.0.1:6379> append name  'i am'
(integer) 8
127.0.0.1:6379> get name
"tonyi am"
```
