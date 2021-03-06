---
title: Explain 命令介绍
sidebar: auto
date: 2022-01-13
categories:
 - 数据库
tags:
 - MySQL
---

Explain 是日常 SQL 优化的一个重要命令，我们可以使用 explain 命令来查看 SQL 语句的执行计划，查看该 SQL 有没有使用上索引，有没有做全表扫描。

``` sql
mysql> explain select * from servers;
+----+-------------+---------+------+---------------+------+---------+------+------+-------+
| id | select_type | table   | type | possible_keys | key  | key_len | ref  | rows | Extra |
+----+-------------+---------+------+---------------+------+---------+------+------+-------+
|  1 | SIMPLE      | servers | ALL  | NULL          | NULL | NULL    | NULL |    1 | NULL  |
+----+-------------+---------+------+---------------+------+---------+------+------+-------+
1 row in set (0.03 sec)
```

explain 执行后出来的表格有 10 列，分别是 id、select_type、table、type、possible_keys、key、key_len、ref、rows、Extra。

## Explain 输出列

| 列名          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| id            | 执行编号，标识 select 所属的行。如果在语句中没有子查询或关联查询，只有唯一的 select，每行都将显示 1。否则，内层的 select 语句一般会顺序编号，对应于其在原始语句中的位置。 |
| select_type   | 显示本行是简单或复杂 select。如果查询没有任何复杂的子查询，则是外层标记为 PRIMARY（DERIVED、UNION、UNION RESULT） |
| table         | 访问引用哪个表（引用某个查询，如“derived3”）                 |
| type          | 数据访问 / 读取操作类型（ALL、index、range、ref、eq_ref、const / system、NULL） |
| possible_keys | 揭示哪一些索引可能有利于高效的查找                           |
| key           | 显示 mysql 决定采用哪个索引来优化查询                        |
| key_len       | 显示 mysql 在索引里使用的字节数                              |
| ref           | 显示了之前的表在 key 列记录的索引中查找值所用的列或常量      |
| rows          | 为了找到所需的行而需要读取的行数，估算值，不精确。通过把所有 rows 列值做乘法，可粗略估算整个查询会检查的行数 |
| Extra         | 额外信息，如 using index、filesort 等                        |

### id

id 是用来顺序标识整个查询中 SELECT 语句的，在嵌套查询中 id 越大的语句越先执行。该值可能为 NULL，如果这一行为 NULL 则表示该行是其他行联合查询的结果。

- id 相同，按 table 列由上至下顺序执行
- id 不同，如果是子查询，id 的序好会递增，id 的值越大优先级越高，越先被执行
- id 存在相同与不同时，相同 id 为一组，从上往下顺序执行，在所有组中，id 越大，优先级越高，优先被执行
- 当使用 union 时，id 会出现 null 值，同时 table 列会出现 \<union M,N\> 的值，其表示 id 的值为 M 和 N 的行的联合

### select_type

表示查询的类型

| 类型                 | 说明                                                         |
| -------------------- | ------------------------------------------------------------ |
| simple               | 简单子查询，不包含子查询和 union                             |
| primary              | 包含 union 或者子查询，最外层的 select 标记为 primary        |
| subquery             | 一般子查询中的子查询，也就是位于 select 列表中的查询，子查询中首个 select （如果存在多个子查询） |
| derived              | 派生表，该临时表时从子查询派生出来的，位于 from 中的子查询，是被驱动的 select 子查询 |
| union                | 位于 union 中第二个及其以后的子查询（查询处于内层的 select），第一个标记为 primary，如果 union 位于 from 中则标记为 derived |
| union result         | 用来从匿名临时表中检索结果的 select，union 操作的结果，id 通常为 null |
| dependent union      | 顾名思义，首先需要满足 union 的条件，及 union 中第二个以及后面的 select 语句，同时该语句依赖外部的查询 |
| dependent subquery   | 子查询中首个SELECT，但依赖于外层的表（如果有多个子查询存在） |
| materialized         | 被物化的子查询                                               |
| uncacheable subquery | 对于外层的主表，子查询不可被物化，每次都需要计算（耗时操作） |
| uncacheable union    | union 操作中，内层的不可被物化的子查询（类似于 uncacheable subquery） |

::: warning 注意 dependent subquery

**特别关注 dependent subquery**

- 会严重消耗性能
- 不会进行子查询，会先进行外部查询，生成结果集，再在内部进行关联查询
- 子查询的执行效率受制于外层查询的记录数
- 可以尝试改成 jion 查询

:::

### table

对应行正在访问哪一个表，表明或者别名

- 关联优化器会为查询选择关联顺序，左侧深度优先
- 当 from 中有子查询的时候，表名是 derivedN 的形式，N 指向子查询，也就是 explain 结果中的下一列
- 当有 unoin result 的时候，表名是 union 1，2 等形式，1，2 表示参与 unoin 的 query id

::: warning 注意

MySQL 对待这些表和普通表一样，但是这些“临时表”是没有任何索引的。

:::

### type

type 显示的是访问类型，是较为重要的一个指标，结果值从好到坏依次是：system \> const \> eq_ref \> ref \> fulltext \> ref_or_null \> index_merge \> unique_subquery \> index_subquery \> range \> index \> ALL，一般来说，得保证查询至少达到 range 级别，最好能达到 ref。

| 类型   | 说明                                                         |
| ------ | ------------------------------------------------------------ |
| ALL    | 最坏的情况，全表扫描                                         |
| index  | 和全表扫描一样。只是扫描表的时候按照索引次序进行而不是行。主要优点就是避免了排序，但是开销仍然非常大。如在 Extra 列看到 Using index，说明正在使用覆盖索引，只扫描索引的数据，它比按索引次序全表扫描的开销要小很多。 |
| range  | 范围扫描，一个有限制的索引扫描。key 列显示使用了哪个索引。当使用 =、<>、>、>=、<、<=、IS NULL、<=>、BETWEEN AND 或者 IN 操作符，用常量比较关键字列时，可以使用 range。 |
| ref    | 一种索引访问，它返回所有匹配某个单个值的行。此类索引访问只有当使用非唯一性索引或唯一性索引非唯一性前缀时才会生效。这个类型跟 eq_ref 不同的是，它用在关联操作只使用了索引的最左前缀，或者索引不是 UNIQUE 和 PRIMARY KEY。ref 可以用于使用 = 或 <=> 操作的带索引的列。 |
| eq_ref | 最多只返回一条符合条件的记录。使用唯一性索引或主键查找时会发生（高效） |
| const  | 当确定最多只会有一行匹配的时候，MySQL 优化器会在查询前读取它而且只读取一次，因此非常快。当主键放入 where 子句时，MySQL 把这个查询转为一个常量（高效）。 |
| system | 这是 const 连接类型的一种特例，表仅有一行满足条件。          |
| Null   | 意味着 MySQL 能在优化阶段分解查询语句，在执行阶段甚至用不到访问表或索引（高效） |



### possible_keys

显示查询使用了哪些索引，表示该索引可以进行高效地查找，但是列出来的索引对于后续优化过程可能是没有用的。

### key

key 列显示 MySQL 实际决定使用的键（索引）。如果没有选择索引，键是 null。要想强制 MySQL 使用或忽视 possible_keys 列中的索引，在查询中使用 FORCE INDEX、USE INDEX 或者 IGNORE INDEX。

### key_len

key_len 列显示 MySQL 决定使用的键长度。如果键是 null，则长度为 null。使用的索引的长度。在不损失精确性的情况下，长度越短越好。

### ref

ref 列显示使用哪个列或常熟与 key 一起从表中选择行。

### rows

rows 列显示 MySQL 认为它执行查询时必须检查的行数。注意这是一个预估值。

### Extra

Extra 是 explain 输出中另外一个很重要的列，该列显示 MySQL 在查询过程中的一些详细信息，MySQL 查询优化器执行查询的过程中对查询计划的重要补充信息。

| 类型                         | 说明                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| Using filesort               | MySQL 有两种方式可以生成有序的结果，通过排序操作或者使用索引，当 Extra 中出现了 Using filesort 说明 MySQL 使用了后者，但注意虽然叫 filesort 但并不是说明就是用了文件来进行排序的，只要排序都是在内存里完成的。大部分情况下利用索引排序更快，所以一般这时也要考虑优化查询了。使用文件完成排序操作，这可能是使用了 order by、group by 语句，可以通过选择合适的索引来改进性能，用索引来为查询结果排序。 |
| Using temporary              | 用临时表保存中间结果，常用于 group by 和 order by 操作中，一般看到它说明查询需要优化了，就算避免不了临时表的使用也要尽量避免硬盘临时表的使用。 |
| Not exists                   | MySQL 优化了 left jion，一旦它找到了匹配 left join 标准的行，就不再搜索了。 |
| Using index                  | 说明查询是覆盖了索引的，不需要读取数据文件，从索引树（索引文件）中即可获得信息。如果同时出现 Using where，表明索引被用来执行索引键值的查找，没有 Using where，表明索引用来读取数据而非执行查找动作。这是 MySQL 服务层完成的，但无需再回表查询记录。 |
| Using index condition        | 这是 MySQL 5.6 出来的新特性，叫做“索引条件推送”。简单说就是 MySQL 原来在索引上是不能执行如 like 这样的操作的，但是现在可以了，这样减少了不必要的 IO 操作，但是只要用在二级索引上。 |
| Using where                  | 使用了 where 从句来限制哪些行将与下一张表匹配或者是返回给用户。注意：Extra 列出现 Using where 表示 MySQL 服务器将存储引擎返回服务层以后再应用 where 条件过滤。 |
| Using join buffer            | 使用了连接缓存：Block Nested Loop，连接算法是块嵌套循环连接：Batched Key Access，连接算法是批量索引连接。 |
| impossible where             | where 子句的值总是 false，不能用来获取任何元组。             |
| select tables optimized away | 在没有 group by 子句的情况下，基于索引优化 min / max 操作，或者对于 MyISAM 存储引擎优化 COUNT(*) 操作，不必等到执行阶段再进行计算，查询执行计划生成的阶段即完成优化。 |
| distinct                     | 优化 distinct 操作，在找到第一匹配的元组后即停止找同样值的动作。 |

>  https://dev.mysql.com/doc/refman/5.7/en/explain-output.html