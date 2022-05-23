---
title: 批量新增技巧
sidebar: auto
date: 2022-05-23
categories:
 - 数据库
tags:
 - MySQL
---

# 数据表

```sql
create table user
(
    id       bigint auto_increment primary key comment '主键ID',
    userId   varchar(32) not null comment '账号',
    userName varchar(64) not null comment '姓名',
    age      int         not null comment '年龄',
    sex      varchar(8)  not null comment '性别',
    birth    date        not null comment '出生日期',
    unique (userId, userName)
);
```

# insert ignore into

当插入数据时，出现错误时，如重复数据，将不返回错误，只以警告形式返回。所以使用 `ignore`，但请确保语句本身没有问题，否则也会被忽略掉。例如：

```sql
insert ignore into user(nameName) values ('telami');
```

# on duplicate key update

在进行 MySQL 数据批量新增，遇到重复数据需要进行更新时，可以使用 `on duplicate key update` 对数据进行更新。例如：

```sql
insert into user(userId, userName, age, sex, birth)
values ('1', '张三', 12, '男', '2021-12-10'),
       ('2', '李老二', 12, '男', '2021-08-10'),
       ('3', '张麻子', 13, '女', '2022-12-10'),
       ('4', '王五', 22, '男', '2021-01-10'),
       ('5', '里斯', 11, '女', '2021-02-10')
on duplicate key update age   = values(age),
                        sex   = values(sex),
                        birth = values(birth);
```

使用这种方式进行批量新增有一个前提条件，数据表中需要存在一个唯一性索引（`unique`），在新增数据时，是根据这个唯一性索引去鉴别哪些数据可以新增，哪些数据需要进行更新。另外，待更新字段一定要出现在 insert 的字段里面，不然更新是无效的。