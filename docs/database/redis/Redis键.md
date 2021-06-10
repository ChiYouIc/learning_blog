# Redis 键(Key)

Redis 键命令用管理 redis 的键。

## Redis keys 命令

1、设置一个键，键名：name 键值：tom

**格式：set key value [EX seconds|PX milliseconds|KEEPTTL] [NX|XX]**

``` bash
127.0.0.1:6379> set name tom
OK
```

2、获取一个键对应的值，name 即为键名

**格式：get key**

``` bash
127.0.0.1:6379> get name
"tom"
```

3、为给定 key 设置过期时间，以秒计。

**格式：expire key seconds**

``` bash
127.0.0.1:6379> expire name 15
(integer) 1
```

4、EXPIREAT 的作用和 EXPIRE 类似，都用于为 key 设置过期时间。 不同在于 EXPIREAT 命令接受的时间参数是 UNIX 时间戳(unix timestamp)。

**格式：expireat key timestamp**

``` bash
127.0.0.1:6379> expireat name 4000
(integer) 1
```

5、设置 key 的过期时间以毫秒计。

**格式：pexpire key milliseconds**

``` bash
127.0.0.1:6379> pexpire name 33
(integer) 1
```

6、设置 key 过期时间的时间戳(unix timestamp) 以毫秒计

**格式：pexpireat key milliseconds-timestamp**

``` bash
127.0.0.1:6379> pexpireat name 444
(integer) 0
```

7、判断 key 是否存在

**格式：exists key [key ...]**

``` bash
127.0.0.1:6379> exists name
(integer) 1
```

8、删除一个 key

**格式：del key [key ...]**

``` bash
127.0.0.1:6379> del name
(integer) 1
```

9、序列化给定的 key，并返回被序列化的值

**格式：dump key**

``` bash
127.0.0.1:6379> dump name
"\x00\x03tom\t\x00\xd5\x87\xe7\xb7B:\b\xa2"
```

10、查找所有符合 pattern 的 key

**格式：keys pattern**

``` bash
127.0.0.1:6379> keys *
1) "name"
```

11、将指定的 key 从当前数据移动到指定的数据库中中

**格式：move key db**

``` bash
127.0.0.1:6379> move name 1
(integer) 1
127.0.0.1:6379> get name
(nil)
127.0.0.1:6379> select 1    # 切换数据库
OK
127.0.0.1:6379[1]> get name
"tom"
127.0.0.1:6379[1]>        
```

12、移除 key 的过期时间设置，key 将永久保存

**格式：persist key**

``` bash
127.0.0.1:6379> expire name 60
(integer) 1
127.0.0.1:6379> persist name
(integer) 1
127.0.0.1:6379> get name
"tom"
```

13、显示 key 剩余存活时间，单位：毫秒

**格式：pttl key**

``` bash
127.0.0.1:6379> expire name 60
(integer) 1
127.0.0.1:6379> pttl name
(integer) 55535
127.0.0.1:6379> pttl name
(integer) 53776
127.0.0.1:6379> pttl name
(integer) 53160
127.0.0.1:6379> pttl name
(integer) 52631
127.0.0.1:6379> pttl name
(integer) 51544
```


14、显示 key 的剩余存活时间，单位：秒

**格式：ttl key**

``` bash
127.0.0.1:6379> expire name 60
(integer) 1
127.0.0.1:6379> ttl name
(integer) 57
127.0.0.1:6379> ttl name
(integer) 50
127.0.0.1:6379> ttl name
(integer) 47
127.0.0.1:6379>
```

15、从当前数据随机返回一个 key

**格式：randomkey**

``` bash
127.0.0.1:6379> randomkey
"name"
```

16、修改指定key的名称

**格式：rename key newkey**

``` bash
127.0.0.1:6379> keys *
1) "name"
127.0.0.1:6379> rename name nickname # 如果新的 key 名已存在，会直接覆盖已存在的 key
OK
127.0.0.1:6379> keys *
1) "nickname"
```

16、仅当 newkey 不存在时，更改 key 的名称

**格式：renamenx key newkey**

``` bash
127.0.0.1:6379> rename nickname name
OK
127.0.0.1:6379> set nickname tony
OK
127.0.0.1:6379> keys *
1) "nickname"
2) "name"
127.0.0.1:6379> renamenx name nickname
(integer) 0
127.0.0.1:6379> keys *
1) "nickname"
2) "name"
127.0.0.1:6379> renamenx name username
(integer) 1
127.0.0.1:6379> keys *
1) "username"
2) "nickname"
```

16、迭代数据库中的数据库键。

**格式：scan cursor [MATCH pattern] [COUNT count] [TYPE type]**
*   cursor - 游标。
*   pattern - 匹配的模式。
*   count - 指定从数据集里返回多少元素，默认值为 10

``` bash
127.0.0.1:6379> scan 0
1) "0"
2) 1) "ha"
   2) "tom"
   3) "tony"
   4) "nickname"
```

17、返回 key 所储存的值的类型。

**格式：type key**

``` bash
127.0.0.1:6379> type name
string
```