---
title: 索引失效
sidebar: auto
date: 2022-04-16
categories:
 - 数据库
tags:
 - MySQL
---

## 索引失效 10 种场景

- [不满足最左匹配原则](#index1)

- [使用 select *](#index2)

- [索引列上有计算](#index3)

- [索引列用了函数](#index4)

- [索引类型不同](#index5)

- [like 左边包含 %](#index6)

- [列对比](#index7)

- [使用 or 关键字](#index8)

- [范围查询、(not) in 和 (not) exists](#index9)

- [order by 语句](#index10)

## 准备数据表

```sql
CREATE TABLE `user`
(
    `id`      int NOT NULL AUTO_INCREMENT,
    `code`    varchar(20) COLLATE utf8mb4_bin DEFAULT NULL,
    `age`     int                             DEFAULT '0',
    `name`    varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
    `height`  int                             DEFAULT '0',
    `address` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
    PRIMARY KEY (`id`), # 主键
    KEY `idx_code_age_name` (`code`, `age`, `name`), # 联合索引
    KEY `idx_height` (`height`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 4
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;
```

## 不满足最左匹配原则<a name='index1'></a>

在使用联合索引的时候，需要注意一个点，就是最左匹配原则；索引列的匹配规则始终是从联合索引从左至右匹配，上述 user 表中，建立了一个联合索引 `idx_code_age_name(code, age, name)`，在使用时，where 子句后面的条件列必须先匹配 code 才能匹配 age、name（允许中间断开，如只匹配 code 和 name），如果说 code 都没有匹配上，就算 where  子句种匹配到了 age 或者 name 索引都不会生效，下面给索引有效与失效案例：

### 联合索引中索引有效

```sql
explain select * from user where code = '101';
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref   | rows | filtered | Extra |
|:--- |:------------ |:----- |:---------- |:---- |:-------------------- |:-------------------- |:-------- |:----- |:---- |:-------- |:----- |
| 1   | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 83       | const | 1    | 100      | NULL  |

```sql
explain select * from user where code = '101' and age = 21;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref         | rows | filtered | Extra |
|:--- |:------------ |:----- |:---------- |:---- |:-------------------- |:-------------------- |:-------- |:----------- |:---- |:-------- |:----- |
| 1   | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 88       | const,const | 1    | 100      | NULL  |

```sql
explain select * from user where code = '101' and age = 21 and name = '张三1';
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref               | rows | filtered | Extra |
|:--- |:------------ |:----- |:---------- |:---- |:-------------------- |:-------------------- |:-------- |:----------------- |:---- |:-------- |:----- |
| 1   | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 211      | const,const,const | 1    | 100      | NULL  |

```sql
select * from user where code = '101' and name = '李四';
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref   | rows | filtered | Extra                 |
|:--- |:------------ |:----- |:---------- |:---- |:-------------------- |:-------------------- |:-------- |:----- |:---- |:-------- |:--------------------- |
| 1   | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 83       | const | 1    | 33.33    | Using index condition |

查询条件原本的顺序是：`code、age、name`，但这里只有 `code` 和 `name` 中间断层了，掉了 `age` 字段，这种情况页能走 `code` 字段上的索引。

这 4 条 sql 中都有 `code` 字段，它是索引字段中的第一个字段，也就是最左边的字段。只要有这个字段，该 sql 就能走索引，这就是 `最左匹配原则`。

### 联合索引中索引失效

```sql
select * from user where age = 21;

select * from user where name = '李四';

select * from user where age = 21 and name = '张三1';
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra       |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:---- |:-------- |:---- |:---- |:-------- |:----------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 33.33    | Using where |

上述 3 条 sql 都没有使用到索引，原因就是没有满足最走匹配原则，即查询条件中，没有包含给定字段最左边的索引字段。上述 3 条 sql 中，要满足最左匹配原则关键点在于 code 列，有了 code 列就能满足，因为 code 是联合索引列中的第一个索引列。

::: warning 注意

在数据库开发中，创建索引和使用索引时，需要注意最左匹配原则，不是 where 里面用到了索引列，索引就一定能生效。

:::

## 使用 Select *<a name='index2'></a>

```sql
select * from user where name = '李四';
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra       |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:---- |:-------- |:---- |:---- |:-------- |:----------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 33.33    | Using where |

上述 sql 中使用了 select \*，从执行计划中可以看出，走了全表扫描，并没有使用到索引。

将 sql 进行修改，不使用 select \*，而是明确需要查询的列，如下：

```sql
select name from user where name = '李四';

select code, name from user where name = '李四';

select code, name, age from user where name = '李四';
```

执行计划：

| id  | select\_type | table | partitions | type  | possible\_keys       | key                  | key\_len | ref  | rows | filtered | Extra                    |
|:--- |:------------ |:----- |:---------- |:----- |:-------------------- |:-------------------- |:-------- |:---- |:---- |:-------- |:------------------------ |
| 1   | SIMPLE       | user  | NULL       | index | idx\_code\_age\_name | idx\_code\_age\_name | 211      | NULL | 3    | 33.33    | Using where; Using index |

由执行计划可以看出，上述三条 sql 使用到了索引扫描，没有执行全表扫描（索引扫描的效率高于全表扫描）。这种查询方式还有一个名字叫：`覆盖索引`；

::: top 覆盖索引

如果一个索引包含（或者说覆盖）所有需要查询的字段的值，我们就称之为 **覆盖索引**。也就是说当 select 查询的列都是索引列，那么此时就用到了覆盖索引。

:::

::: warning 注意
在数据库开发中，不要使用 select \* 这种查询方式，尽可能的明确待查询列，避免索引失效。

:::

## 索引列上有计算 <a name="index3"></a>

```sql
select * from user where id + 1 = 1;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra       |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:---- |:-------- |:---- |:---- |:-------- |:----------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 100      | Using where |

修改一下 sql：

```sql
select * from user where id = 1;
```

执行计划

| id  | select\_type | table | partitions | type  | possible\_keys | key     | key\_len | ref   | rows | filtered | Extra |
|:--- |:------------ |:----- |:---------- |:----- |:-------------- |:------- |:-------- |:----- |:---- |:-------- |:----- |
| 1   | SIMPLE       | user  | NULL       | const | PRIMARY        | PRIMARY | 4        | const | 1    | 100      | NULL  |

根据两条 sql 的执行计划可知，如果 where 语句中，对索引列进行计算操作，会导致索引失效。

::: warning 注意

在数据库开发中，应尽量不要在 where 语句中对列计算处理，避免索引失效。如果业务中确实有这样的需求，请在业务代码中处理，不建议在 sql 中处理。

:::

## 索引列使用了函数<a name="index4"></a>

```sql
select * from user where height = 175;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key         | key\_len | ref   | rows | filtered | Extra |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:----------- |:-------- |:----- |:---- |:-------- |:----- |
| 1   | SIMPLE       | user  | NULL       | ref  | idx\_height    | idx\_height | 5        | const | 1    | 100      | NULL  |

修改 sql，在 height 列上使用 substr 函数：

```sql
select * from user where substr(height, 1, 2) = 175;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra       |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:---- |:-------- |:---- |:---- |:-------- |:----------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 100      | Using where |

索引列使用了函数与索引列上有计算得到的效果是一样的，函数的背后就是在做计算处理，所以在开发中都应该避免。

::: warning 注意

在数据库开发中，应尽量不要在 where 语句中对列使用函数，避免索引失效。如果业务中确实有这样的需求，请在业务代码中处理，不建议在 sql 中处理。

:::

## 索引类型不同 <a name="index5"></a>

```sql
select * from user where code = '101';
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref   | rows | filtered | Extra |
|:--- |:------------ |:----- |:---------- |:---- |:-------------------- |:-------------------- |:-------- |:----- |:---- |:-------- |:----- |
| 1   | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 83       | const | 1    | 100      | NULL  |

从执行计划中可知，sql 满足最左匹配原则，故查询可使用到索引。

修改一下 sql，将 code 的查询参数变为整数值：

```sql
select * from user where code = 101;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys       | key  | key\_len | ref  | rows | filtered | Extra       |
|:--- |:------------ |:----- |:---------- |:---- |:-------------------- |:---- |:-------- |:---- |:---- |:-------- |:----------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | idx\_code\_age\_name | NULL | NULL     | NULL | 3    | 33.33    | Using where |

从执行计划中可知，sql 并没有使用到事先创建的索引。为什么字符串类型的字段，传入了 int 类型的参数时索引会失效呢？MySQL 官方解释，字符串 '1'、' 1 '、'1a' 都能转换成 int 类型的 1，也就是说可能会出现多个字符串，对应一个 int 类型参数的情况。那么，mysql 怎么知道该把 int 类型的 1 转换成哪种字符串，用哪个索引快速查值？

::: warning 注意

字符串类型的字段，如果传入 int 类型参数，索引会失效。但是如果是 int 类型字段，传入的参数是 varchar 类型，则参数不会失效，因为 MySQL 会将传入的参数进行隐式转换，同一转换为字符串。

:::

## like 左边包含 %<a name="index6"></a>

首先测试一下右边使用 % 的情况：

```sql
select * from user where code like '10%';
```

执行计划：

| id  | select\_type | table | partitions | type  | possible\_keys       | key                  | key\_len | ref  | rows | filtered | Extra                 |
|:--- |:------------ |:----- |:---------- |:----- |:-------------------- |:-------------------- |:-------- |:---- |:---- |:-------- |:--------------------- |
| 1   | SIMPLE       | user  | NULL       | range | idx\_code\_age\_name | idx\_code\_age\_name | 83       | NULL | 3    | 100      | Using index condition |

修改一下 sql，将 % 放在左边：

```sql
select * from user where code like '%01';
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra       |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:---- |:-------- |:---- |:---- |:-------- |:----------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 33.33    | Using where |

此时，索引失效了。

::: warning 注意

在数据库开发中，当 like 语句中的 % 出现在查询条件的左边时，索引会失效。

:::

## 列对比<a name="index7"></a>

```sql
select * from user where id = height;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra       |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:---- |:-------- |:---- |:---- |:-------- |:----------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 100      | Using where |

虽然表中 id 有主键索引，height 有普通索引，但是在 where 语句里面使用列对比，会造成索引的失效。

::: warning 注意

列对比会导致索引失效，避免在 sql 中出现多个列对比的情况。

:::

## 使用 or 关键字<a name="index8"></a>

```sql
select * from user where id = 1 or height = 171;
```

执行计划：

| id  | select\_type | table | partitions | type         | possible\_keys      | key                 | key\_len | ref  | rows | filtered | Extra                                           |
|:--- |:------------ |:----- |:---------- |:------------ |:------------------- |:------------------- |:-------- |:---- |:---- |:-------- |:----------------------------------------------- |
| 1   | SIMPLE       | user  | NULL       | index\_merge | PRIMARY,idx\_height | PRIMARY,idx\_height | 4,5      | NULL | 2    | 100      | Using union\(PRIMARY,idx\_height\); Using where |

此时索引正常生效，修改一下 sql，新增一个 or，加入字段 address 的查询：

```sql
select * from user where id = 1 or height = 171 or address = '北京';
```

| id  | select\_type | table | partitions | type | possible\_keys      | key  | key\_len | ref  | rows | filtered | Extra       |
|:--- |:------------ |:----- |:---------- |:---- |:------------------- |:---- |:-------- |:---- |:---- |:-------- |:----------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | PRIMARY,idx\_height | NULL | NULL     | NULL | 3    | 83.33    | Using where |

修改后的 sql 添加了 address 的条件查询，由于 address 不是索引列，导致 id 和 height 字段的索引都失效。

::: warning 注意

or 使用会导致其它字段的索引失效，在使用当中需要注意；如果实际开发中，一定要使用到 or 关键字，那么就需要将所有的 or 字段都加上索引。

:::

## 范围查询、(not) in 和 (not) exists<a name="index9"></a>

日常开发中，常用到的范围查询：

- in

- not in

- exists

- not exists

- between and

### in 关键字

```sql
select * from user where height in (192, 171, 195);
```

执行计划：

| id  | select\_type | table | partitions | type  | possible\_keys | key         | key\_len | ref  | rows | filtered | Extra                 |
|:--- |:------------ |:----- |:---------- |:----- |:-------------- |:----------- |:-------- |:---- |:---- |:-------- |:--------------------- |
| 1   | SIMPLE       | user  | NULL       | range | idx\_height    | idx\_height | 5        | NULL | 3    | 100      | Using index condition |

使用 in 关键字时，索引依然有效。

### not in 关键字

使用主键索引字段 id 进行 not in 查询：

```sql
select * from user where id not in (1, 2, 3);
```

执行计划：

| id  | select\_type | table | partitions | type  | possible\_keys | key     | key\_len | ref  | rows | filtered | Extra       |
|:--- |:------------ |:----- |:---------- |:----- |:-------------- |:------- |:-------- |:---- |:---- |:-------- |:----------- |
| 1   | SIMPLE       | user  | NULL       | range | PRIMARY        | PRIMARY | 4        | NULL | 4    | 100      | Using where |

使用普通索引字段 height 进行 not in 查询：

```sql
select * from user where height not in (192, 171, 195);
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra       |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:---- |:-------- |:---- |:---- |:-------- |:----------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | idx\_height    | NULL | NULL     | NULL | 3    | 100      | Using where |

**主键字段使用 not in 关键字范围查询，索引依然有效。但普通索引字段使用 not in 范围查询会导致索引失效。**

### exists 关键字

```sql
select * from user u1 where exists(select * from user u2 where u2.height = 175 and u1.id = u2.id);
```

执行计划：

| id  | select\_type | table | partitions | type    | possible\_keys      | key         | key\_len | ref   | rows | filtered | Extra       |
|:--- |:------------ |:----- |:---------- |:------- |:------------------- |:----------- |:-------- |:----- |:---- |:-------- |:----------- |
| 1   | SIMPLE       | u2    | NULL       | ref     | PRIMARY,idx\_height | idx\_height | 5        | const | 1    | 100      | Using index |
| 1   | SIMPLE       | u1    | NULL       | eq\_ref | PRIMARY             | PRIMARY     | 4        | u2.id | 1    | 100      | NULL        |

使用 exists 关键字，索引依然有效。

### not exists 关键字

```sql
select * from user u1 where not exists(select * from user u2 where u2.height = 175 and u1.id = u2.id);
```

执行计划：

| id  | select\_type | table | partitions | type    | possible\_keys      | key     | key\_len | ref   | rows | filtered | Extra                   |
|:--- |:------------ |:----- |:---------- |:------- |:------------------- |:------- |:-------- |:----- |:---- |:-------- |:----------------------- |
| 1   | SIMPLE       | u1    | NULL       | ALL     | NULL                | NULL    | NULL     | NULL  | 3    | 100      | NULL                    |
| 1   | SIMPLE       | u2    | NULL       | eq\_ref | PRIMARY,idx\_height | PRIMARY | 4        | u1.id | 1    | 100      | Using where; Not exists |

使用 not exists 关键字时，索引失效。

::: warning 注意

- 使用 in 关键字范围查询时，索引有效；

- 使用 not in 关键字范围查询时，主键字段索引依然有效，但非主键索引字段，索引失效；

- 使用 exists 关键字范围查询时，索引有效；

- 使用 not exists 关键字范围查询时，索引失效。

:::

## order by 语句<a name="index10"></a>

### 哪些情况走索引？

#### 满足最左匹配原则

order by 后面的条件，也要遵循联合索引的最左匹配原则。如下：

```sql
select * from user order by code limit 1;

select * from user order by code, age limit 1;

select * from user order by code, age, name limit 1;
```

执行计划：

| id  | select\_type | table | partitions | type  | possible\_keys | key                  | key\_len | ref  | rows | filtered | Extra |
|:--- |:------------ |:----- |:---------- |:----- |:-------------- |:-------------------- |:-------- |:---- |:---- |:-------- |:----- |
| 1   | SIMPLE       | user  | NULL       | index | NULL           | idx\_code\_age\_name | 211      | NULL | 1    | 100      | NULL  |

::: warning 注意

除了需要遵循最左匹配原则之外，有个非常关键的地方时，后面还要加上 limit 关键字，如果不加它索引会失效。limit 的查询数据条数如果过大，也会导致索引失效。

:::

#### 配合 where 一起使用

order by 还能配合 where 一起遵循最左匹配原则。

```sql
select * from user where code = '101' order by age;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref   | rows | filtered | Extra |
|:--- |:------------ |:----- |:---------- |:---- |:-------------------- |:-------------------- |:-------- |:----- |:---- |:-------- |:----- |
| 1   | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 83       | const | 1    | 100      | NULL  |

code 是联合索引的第一个字段，在 where 中使用，而 age 是联合索引的第二个字段，在 order by 中接着使用。

修改一下 sql，根据 name 进行排序：

```sql
select * from user where code = '101' order by name
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref   | rows | filtered | Extra          |
|:--- |:------------ |:----- |:---------- |:---- |:-------------------- |:-------------------- |:-------- |:----- |:---- |:-------- |:-------------- |
| 1   | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 83       | const | 1    | 100      | Using filesort |

::: warning 注意

虽说 name 是联合索引的第三个字段，但根据最左匹配原则，该 sql 语句依然能走索引，因为最左边的第一个字段 code，在 where 中使用了，只不过 order by 的时候，排序的效率比较低，需要走一次 filesort 排序。

:::

#### 相同的排序

order by 后面如果包含了联合索引的多个排序字段，只要它们的排序规律是相同的（要么同时升序，要么同时降序），也可以走索引。

```sql
select * from user order by code desc, age desc limit 1;
```

执行计划：

| id  | select\_type | table | partitions | type  | possible\_keys | key                  | key\_len | ref  | rows | filtered | Extra               |
|:--- |:------------ |:----- |:---------- |:----- |:-------------- |:-------------------- |:-------- |:---- |:---- |:-------- |:------------------- |
| 1   | SIMPLE       | user  | NULL       | index | NULL           | idx\_code\_age\_name | 211      | NULL | 1    | 100      | Backward index scan |

::: warning 注意

该示例中 order by 后面的 code 和 age 字段都用了降序，所以索引依然有效。

:::

#### where 与 order by 都有

```sql
select * from user where code = '101' order by code, name;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref   | rows | filtered | Extra          |
|:--- |:------------ |:----- |:---------- |:---- |:-------------------- |:-------------------- |:-------- |:----- |:---- |:-------- |:-------------- |
| 1   | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 83       | const | 1    | 100      | Using filesort |

::: warning 注意

code 字段在 where 和 order by 中都有，对于这种情况，从执行计划中得知索引依然有效。

:::

### 哪种情况不走索引？

#### 没加 where 和 limit 关键字

```sql
select * from user order by code, name;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra          |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:---- |:-------- |:---- |:---- |:-------- |:-------------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 100      | Using filesort |

::: warning 注意

如果 order by 语句中没有 where 和 limit 关键字，该 sql 的索引失效。

:::

#### 对不同的索引做 order by

```sql
select * from user order by code, height limit 1;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra          |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:---- |:-------- |:---- |:---- |:-------- |:-------------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 100      | Using filesort |

::: warning 注意

当对多个不同的索引列进行 order by，索引失效。

:::

#### 不满足最左匹配原则

```sql
select * from user order by name limit 1;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra          |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:---- |:-------- |:---- |:---- |:-------- |:-------------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 100      | Using filesort |

::: warning 注意

name 字段是联合索引的第三个字段，所以该 order by 不满足最左匹配原则，索引失效。

:::

#### 不同的排序

```sql
select * from user order by code asc, age desc limit 1;
```

执行计划：

| id  | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra          |
|:--- |:------------ |:----- |:---------- |:---- |:-------------- |:---- |:-------- |:---- |:---- |:-------- |:-------------- |
| 1   | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 100      | Using filesort |

::: warning 注意

尽管 order by 后面的 code 和 age 字段遵循了最左匹配原则，但由于一个字段是用的升序，另一个字段用的降序，最终会导致索引失效。

:::
