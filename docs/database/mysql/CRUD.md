---
title: 数据表操作
sidebar: auto
date: 2021-11-06
categories:
 - 数据库
tags:
 - MySQL
---

## 新增表数据

``` sql
# 单条新增
insert into table_name(column1, column2, column3...) values (value1, value2, value3...);

insert into table_name values(value1, value2, ...); 

# 批量新增
insert into table_name(column1, column2, column3...) values (value1, value2, value3...),(value1, value2, value3...)...;

insert into table_nameA(column1, column2,...) select value1, value2,... from table_nameB;
```



## 删除表数据

``` sql
# 无论什么时候删除数据，都应该检查 condition 是否明确，避免造成不必要的麻烦
delete from table_name where condition;
```



## 更新表数据

``` sql
# 更新数据时，都应该检查 condition 是否明确
update table_name set column1 = value1, column2 = value2 where condition;

# update 更新语句，也支持多表关联
update table_nameA a,
	   table_nameB b
	set a.column1 = b.column1,
		a.column2 = b.column2
where condition;

```



## 查询表数据

``` sql
select column1, column2... from table_nameA
[left/right/inner]join tbale_nameB on condition # 左/右/全 连接
where condition  # 条件过滤子句
group by column	 # 分组子句	
having condition # 条件过滤子句
order by column  # 排序子句
limit n;		 # 查询偏移子句	
```



### where 子句

where 子句作为查询一条 SQL 的查询条件，即查询满足指定条件的数据行。**它是一个约束声明，用于约束数据，在返回结果集之前起作用**。例如：

``` sql
select name, age, address from consumer where age > 20;
```

上述 SQL 语句表示在  consumer 数据表中，查询年龄 age 大于 20 岁以上的用户的 姓名 name，年龄 age 和 住址 address。

where 子句其实就是一个类似编程语言的布尔表达式，所以它也有与或，通过 and 和 or 来连接多个条件子句。



### group by 分组

mysql 为我们提供 group by 关键词用于数据分组，可以根据一个或多个列对结果集进行分组，再结合集聚函数 sum、avg、count 可以很方便的对数据集进行各种统计、计算处理。例如：

``` sql
select address, count(*) as total, sum(age), avg(age) from consumer group by address;
```

上述 SQL 语句表示在 consumer 数据表中，统计每个地区有多少人（total），人口总年龄 （sum(age)），人均年龄（avg(age)）。

::: warning 注意

在使用 group by 语句的时候，需要注意非分组列都需要使用聚集函数包裹，在 MySQL 早期版本的时候并没有强要求，但是在 8.0 之后的版中，这是必须的。并且在其它的例如 Oracle 数据库中，一旦非分组列出现在查询目标列中时，是会报 SQL 语法错的。其实这种语法要求是很合理的且很有必要，因为分组后，数据会被合并，每一个分组里，除了被分组列是确定的，其它非分组列的值都是散乱的，如果不使用聚集函数进行包裹，那么这些列查询出来的数据是没有意义的。   

:::

WITH ROLLUP 可以实现在分组统计数据基础上再进行相同的统计（SUM,AVG,COUNT…）。



### having 子句

由于 where 子句无法使用聚集函数，having 子句可以让我们筛选分组后的各组数据。

``` sql
select address from consumer group by address having avg(age) > 50;
```

上述 SQL 语句表示在 consumer 数据表中，统计平均年龄大于 50 周岁有哪些地区。



### order by 排序

``` sql
# 按 age 降序
select * from consumer order by age desc;

# 按 age 升序
select * from consumer order by age asc;
```



### limit n offset m

``` sql
# 查询 consumer 表中前 10 条数据
select * from consumer limit 10;

# 查询 consumer 表中第 5 条数据后的 10 条数据，也就是序号 6 - 15 的数据
select * from consumer limit 5 offset 10;
# 上述可简写
select * from consumer limit 5, 10;
```

limit n offset m 常用于实现分页查询，例如，现有页码 pageNum = 2，页大小 pageSize = 10。查询语句如下：

``` sql
# m = (pageNum - 1) * 10
# n = pageSize
select * from consumer limit 10, 10;
```



### like 模糊查询

``` sql
# 查询 user_name 包含 tom 字符串的数据
select * from consumer where user_name like '%tom%';

# 查询 user_name 以 tom 字符串开头的数据
select * from consumer where user_name like 'tom%';

# 查询 user_name 包含 tom 字符串结尾的数据
select * from consumer where user_name like '%tom';
```



### union 操作符

**union**：连接两个以上的 select 语句的结果组合到一个结果集合中。

``` sql
select * from consumer where user_name = 'tom'
union
select * from consumer where age > 10;
```

上述 SQL 会将 user_name 是 tom 的数据与  age 大于 10 的数据汇总成一个数据集，默认去重，即两个 select 语句结果集中相同的数据只会出现一次。

**union all**：连接所有的数据集，包含重复值。

**union distinct**：删除结果集中重复的数据。默认情况下 union 操作符已经删除了重复数据，所以 distinct 修饰符对结果没啥影响。











