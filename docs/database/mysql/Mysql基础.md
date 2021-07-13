# MySQL基础

## 关系型数据库介绍

顾名思义，关系型数据库就是一种建立在关系模型基础上的数据库。关系模型表明了数据库中所有存储的数据之间的联系（一对一、一对多、多对多）。

关系型数据库中，我们的数据都被存放在了各种表中，表中的每一行就存放着一条数据。

<img :src="$withBase('/img/database/mysql/relation-table.png')" alt="relation-table">

大部分关系型数据库都是用 SQL 来操作数据库中的数据。并且，大部分关系型数据都支持事务的四大特性（ACID）。

> 常见的关系型数据库：MySQL、PostgreSQL、Oracle、SQL Server、SQLite等等。

## MySQL 介绍

<img :src="$withBase('/img/database/mysql/mysql-log.png')" alt="mysql-log">

**MySQL 是一种关系型数据库，主要用于持久化我们的系统中的一些数据比如用户信息**。

由于 MySQL 是开源免费并且比较成熟的数据库，因此，MySQL 被大量使用在各种系统中。任何人都可以在 GPL（General Pulic Lincense）的许可下下载并根据个性化的需要对其进行修改。MySQL 的默认端口号是 3306。

## 存储引擎

### 存储引擎相关的命令

**查看 MySQL 提供的所有存储引擎**

``` sql
# 查看数据库所有的存储引擎
show engines;
```

| Engine | Support | Comment | Transactions | XA | Savepoints |
| :--- | :--- | :--- | :--- | :--- | :--- |
| FEDERATED | NO | Federated MySQL storage engine | NULL | NULL | NULL |
| MEMORY | YES | Hash based, stored in memory, useful for temporary tables | NO | NO | NO |
| InnoDB | DEFAULT | Supports transactions, row-level locking, and foreign keys | YES | YES | YES |
| PERFORMANCE\_SCHEMA | YES | Performance Schema | NO | NO | NO |
| MyISAM | YES | MyISAM storage engine | NO | NO | NO |
| MRG\_MYISAM | YES | Collection of identical MyISAM tables | NO | NO | NO |
| BLACKHOLE | YES | /dev/null storage engine \(anything you write to it disappears\) | NO | NO | NO |
| CSV | YES | CSV storage engine | NO | NO | NO |
| ARCHIVE | YES | Archive storage engine | NO | NO | NO |

从上面的表格中可以查看到 MySQL 当前默认的存储引擎是 InnoDB，并且在 5.7 版本所有的存储引擎只有 InnoDB 是事务性存储引擎，也就是说只有 InnoDB 支持事务。

**查看 MySQL 当前默认的存储引擎**

``` sql
# 查看默认的存储引擎
show variables like '%storage_engine%';
```

| Variable\_name                      | Value     |
| :---------------------------------- | :-------- |
| default\_storage\_engine            | InnoDB    |
| default\_tmp\_storage\_engine       | InnoDB    |
| disabled\_storage\_engines          |           |
| internal\_tmp\_mem\_storage\_engine | TempTable |

**查看表的存储引擎**

``` sql
# 表的存储引擎
show table status like 'sys_%';
```

| Name     | Engine | Version | Row\_format | Rows | Avg\_row\_length | Data\_length | Max\_data\_length | Index\_length | Data\_free | Auto\_increment | Create\_time        | Update\_time | Check\_time | Collation             | Checksum | Create\_options | Comment |
| :------- | :----- | :------ | :---------- | :--- | :--------------- | :----------- | :---------------- | :------------ | :--------- | :-------------- | :------------------ | :----------- | :---------- | :-------------------- | :------- | :-------------- | :------ |
| sys\_emp | InnoDB | 10      | Dynamic     | 2    | 8192             | 16384        | 0                 | 0             | 0          | NULL            | 2021-07-09 03:24:29 | NULL         | NULL        | utf8mb4\_0900\_ai\_ci | NULL     |                 | 员工表  |

## MyISAM 和 InnoDB 的区别

<img :src="$withBase('/img/database/mysql/MyISAM_and_InnoDB.png')" alt="MyISAM_and_InnoDB">

MySQL 5.5 之前，MyISAM 引擎是 MySQL 的默认存储引擎，可谓是风光一时。

虽然，MyISAM 的性能还行，各种特性也还不错（比如全文索引、压缩、空间函数等）。但是 MyISAM 不支持事务和行级锁，而且最大的缺陷就是崩溃后无法安全恢复。

5.5 版本之后，MySQL 引入了 InnoDB（事务性数据库引擎），MySQL 5.5 版本后默认的存储引擎为 InnoDB。

### 两者的对比

1. **是否支持行级锁：**

   MyISAM 只有表级锁（table-level locking），而 InnoDB 支持行级锁（row-level locking）和表级锁，默认为行级锁。

   也就是说，MyISAM 一锁就是锁住整张表，这在并发写的情况下是很慢的，这也是为什么 InnoDB 在并发写的时候，性能更好的原因。



