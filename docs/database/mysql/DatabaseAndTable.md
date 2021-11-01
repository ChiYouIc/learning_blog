---
title: 数据库和数据表
sidebar: auto
date: 2021-10-29
categories:
 - 数据库
tags:
 - MySQL
---

## 数据库

创建数据库语句

``` sql
create databse database_name;
```

查看数据库

``` sql
show databases;
```

使用数据库

```sql
use database_name;
```

删除数据库

```sql
drop database database_name;
```



## 数据表

创建数据表

``` sql
create table table_name (
	column_name 类型 [索引 comment '字段描述' after column_name],
    ...
    column_name 类型 [索引 comment '字段描述' after column_name],
	primary key(column_name, ...)
) comment '表信息描述';
```

创建数据时，字段属性的声明：

- crement_auto：字段自增，通常使用在整数类型的字段上；
- primary key：表示该字段为主键，通常字段类型是整数类型，用于表示某一行数据的唯一性，该字段列不可出现重复值和不能为空值；
- default  vlaue：用于设置数据行字段的默认值，在一行数据被创建时，如果没有给到初始值，那么该字段默认使用 value 进行填充；
- null | not null：用于表示该字段是否可为 null，这数据创建时会进行校验，一旦插入空值或没有设定默认值时，插入和更新语句都会报错；
- comment 描述：用于描述该字段；
- unique  index_name：表示该字段的值是唯一的，可为空值，但是不能重复。 



查看数据表

``` sql
show tables;
```

删除数据表

``` sql
drop table table_name;
```

修改数据表

``` sql
# 新增一列
alter table table_name add column_name 类型 [索引 comment '字段描述' after column_name];

# 删除一列
alter table table_name drop column_name;

# 修改字段
alter table table_name change old_column new_column 类型;
# or
alter table table_name modify column_name 新类型;

# 修改表名
alter table old_table_name rename new_table_name;
```

对于 `modify` 与 `change` 的使用是有区别的，modify 只能用于修改现有字段的类型等属性，不可以直接修改字段名称；但是 change 可以修改字段名称，包括修改后的字段类型等属性。总结就是：modify 只能在现有字段上做修改，而 change 可以将现有字段进行完全修改。

