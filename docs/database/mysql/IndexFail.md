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
- 索引列上有计算
- 索引列用了函数
- 索引类型不同
- like 左边包含 %
- 列对比
- 使用 or 关键字
- not in 和 not exists
- order by 语句



## 准备数据表

``` sql
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

``` sql
explain select * from user where code = '101';
```

执行计划：

| id   | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref   | rows | filtered | Extra |
| :--- | :----------- | :---- | :--------- | :--- | :------------------- | :------------------- | :------- | :---- | :--- | :------- | :---- |
| 1    | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 83       | const | 1    | 100      | NULL  |

``` sql
explain select * from user where code = '101' and age = 21;
```

执行计划：

| id   | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref         | rows | filtered | Extra |
| :--- | :----------- | :---- | :--------- | :--- | :------------------- | :------------------- | :------- | :---------- | :--- | :------- | :---- |
| 1    | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 88       | const,const | 1    | 100      | NULL  |

``` sql
explain select * from user where code = '101' and age = 21 and name = '张三1';
```

执行计划：

| id   | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref               | rows | filtered | Extra |
| :--- | :----------- | :---- | :--------- | :--- | :------------------- | :------------------- | :------- | :---------------- | :--- | :------- | :---- |
| 1    | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 211      | const,const,const | 1    | 100      | NULL  |

``` sql
select * from user where code = '101' and name = '李四';
```

执行计划：

| id   | select\_type | table | partitions | type | possible\_keys       | key                  | key\_len | ref   | rows | filtered | Extra                 |
| :--- | :----------- | :---- | :--------- | :--- | :------------------- | :------------------- | :------- | :---- | :--- | :------- | :-------------------- |
| 1    | SIMPLE       | user  | NULL       | ref  | idx\_code\_age\_name | idx\_code\_age\_name | 83       | const | 1    | 33.33    | Using index condition |

查询条件原本的顺序是：`code、age、name`，但这里只有 `code` 和 `name` 中间断层了，掉了 `age` 字段，这种情况页能走 `code` 字段上的索引。

这 4 条 sql 中都有 `code` 字段，它是索引字段中的第一个字段，也就是最左边的字段。只要有这个字段，该 sql 就能走索引，这就是 `最左匹配原则`。



### 联合索引中索引失效

``` sql
select * from user where age = 21;

select * from user where name = '李四';

select * from user where age = 21 and name = '张三1';
```

执行计划：

| id   | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra       |
| :--- | :----------- | :---- | :--------- | :--- | :------------- | :--- | :------- | :--- | :--- | :------- | :---------- |
| 1    | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 33.33    | Using where |

上述 3 条 sql 都没有使用到索引，原因就是没有满足最走匹配原则，即查询条件中，没有包含给定字段最左边的索引字段。上述 3 条 sql 中，要满足最左匹配原则关键点在于 code 列，有了 code 列就能满足，因为 code 是联合索引列中的第一个索引列。



## 使用 Select *<a name='index2'></a>

``` sql
select * from user where name = '李四';
```

执行计划：

| id   | select\_type | table | partitions | type | possible\_keys | key  | key\_len | ref  | rows | filtered | Extra       |
| :--- | :----------- | :---- | :--------- | :--- | :------------- | :--- | :------- | :--- | :--- | :------- | :---------- |
| 1    | SIMPLE       | user  | NULL       | ALL  | NULL           | NULL | NULL     | NULL | 3    | 33.33    | Using where |

上述 sql 中使用了 select *，从执行计划中可以看出，走了全表扫描，并没有使用到索引。

将 sql 进行修改，不适用 select *，而是明确需要查询的列，如下：

``` sql
select name from user where name = '李四';

select code, name from user where name = '李四';

select code, name, age from user where name = '李四';
```

执行计划：

| id   | select\_type | table | partitions | type  | possible\_keys       | key                  | key\_len | ref  | rows | filtered | Extra                    |
| :--- | :----------- | :---- | :--------- | :---- | :------------------- | :------------------- | :------- | :--- | :--- | :------- | :----------------------- |
| 1    | SIMPLE       | user  | NULL       | index | idx\_code\_age\_name | idx\_code\_age\_name | 211      | NULL | 3    | 33.33    | Using where; Using index |

如果待查询列是联合
