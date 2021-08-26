---
title: MySQL基础
sidebar: auto
date: 2021-08-12
categories:
 - 数据库
tags:
 - MySQL
---

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

1. **是否支持行级锁**

   MyISAM 只有表级锁（table-level locking），而 InnoDB 支持行级锁（row-level locking）和表级锁，默认为行级锁。也就是说，MyISAM 一锁就是锁住整张表，这在并发写的情况下是很慢的，这也是为什么 InnoDB 在并发写的时候，性能更好的原因。

2. **是否支持事务**

   MyISAM 不提供事务支持。

   InnoDB 提供事务支持，具有提交（commit）和回滚（rollback）事务的能力。

3. **是否支持外键**

   MyISAM 不支持，而 InnoDB 支持。

::: tip 扩展一下

一般我们也是不建议在数据库层面使用外键的，应用层面可以解决。不过，这样会对数据的一致性造成威胁。具体要不要使用外键还是要根据你的项目来决定的。

:::

 4. **是否支持数据库异常崩溃后的安全恢复**

    MyISAM 不支持，而 InnoDB 支持。

    使用 InnoDB 的数据库在异常崩溃后，数据库重新启动的时候会保证数据库恢复到崩溃的状态。这个恢复的过程依赖于 `redo log`。

::: tip 扩展一下

* MySQL InnoDB 引擎使用 **redo log（重做日志）** 保证事务的 **持久性**，使用 **undo log（回滚日志）** 来保证事务的 **原子性**。
* MySQL InnoDB 引擎通过 **锁机制、MVCC** 等手段来保证事务的隔离性（默认支持的隔离级别是 `REPEATABLE_READ`）。
* 保证了事务的持久性、原子性、隔离性之后，一致性才能得到保障。

:::

5. **是否支持 MVCC**

   MyISAM 不支持，而 InnoDB 支持。

   讲真，这个对比有点废话，毕竟 MyISAM 连行级锁都不支持。MVCC 可以看作是行级锁的一个升级，可以有效减少加锁操作，提供性能。

::: tip 什么是 MVCC ？
MVCC（Multi-version concurrency control），多版本并发控制，主要是通过在每一行记录中增加三个字段，与 `undo log` 中相关记录配合使用，同时加上可见性算法，
使得各个事务可以在不加锁的情况下能够同时地读取到某行记录上的准确值（这个值对不同的事务而言可能是不同的）。使用 MVCC，在不加锁的情况下也能读取到准确的数据，
大大提高了并发效率。
:::

## 关于 MyISAM 和 InnoDB 的选择问题

大多数时候我们使用的都是 InnoDB 存储引擎，在某些读密集的情况，使用 MyISAM 也是合适的。不过，前提是你的项目不介意 MyISAM 不支持事务、崩溃恢复等缺点。

《MySQL 高性能》上面有一句话这样写道：

> 不要轻易相信“MyISAM 比 InnoDB 快”之类的经验，这个结论往往不是绝对的。在很多我们已知场景中，InnoDB 的速度都可以让 MyISAM 望尘莫及，尤其是用到了聚簇索引，或者需要访问的数据都可以放入内存的应用。

一般情况下我们选择 InnoDB 都是没有问题的，但是某些情况下你并不在乎可扩展能力和并发能力，也不需要事务支持，也不在乎崩溃后的安全恢复问题的话，选择 MyISAM 也是一个不错的选择。但是一般情况下，我们都是需要考虑到这些问题的。

因此，对于我们日常开发的业务系统来说，你几乎找不到什么理由再使用 MyLSAM 作为自己的 MySQL 数据库的存储引擎。

## 锁机制与 InnoDB 锁算法

**MyISAM 和 InnoDB 存储引擎使用的锁：**

* MyISAM 采用表级锁（table-level locking）。
* InnoDB 支持行级锁（row-level locking）和表级锁，默认为行级锁。

**表级锁和行级锁对比：**

* **表级锁**：MySQL 中锁定 **粒度最大** 的一种锁，对当前操作的整张表加锁，实现简单，资源消耗也比较少，加锁快，不会出现死锁。其锁粒度最大，触发锁冲突的概率最高，并发度最低，MyISAM 和 InnoDB 引擎都支持表级锁。
* **行级锁**：MySQL 中锁定 **粒度最小** 的一种锁，只针对当前操作的行进行加锁。行级锁能大大减少数据库操作的冲突。其加锁粒度最小，并发度高，但加锁的开销也最大，加锁慢，会出现死锁。

**InnoDB 存储引擎的锁算法有三种**：

* Record lock：记录锁，单个行记录上的锁；
* Gap lock：间隙锁，锁定一个范围，不包括记录本身；
* Next-key lock：record + gap 临键锁，锁定一个范围，包含记录本身。

## 查询存储

执行查询语句的时候，会先查询缓存。不过，MySQL 8.0 版本后移动，因为这个功能不太使用，`my.cnf` 加入一下配置，重启 MySQL 开启查询缓存。

``` properties
query_cache_type=1
query_cache_size=600000
```

MySQL 执行一下命令也可以开启查询缓存

``` properties
set global  query_cache_type=1;
set global  query_cache_size=600000;
```

如何，**开启查询缓存后在同样的查询条件以及数据情况下，会直接在缓存中返回结果**。这里的查询条件包括查询本身、当前要查询的数据库、客户端协议版本号等一些可能影响结果的信息。因此任何两个查询在任何字符上的不同都会导致缓存不命中。此外，如果查询中包含任何用户自定义函数、存储函数、用户变量、临时表、MySQL 库中的系统表，其查询结果也不会被缓存。

缓存建立之后，MySQL 的查询缓存系统会跟踪查询中涉及的每张表，如果这些表（数据或结构）发生变化，那么和这张表相关的所有缓存数据都将失效。

**缓存虽然能够提升数据的查询性能，但是缓存同时也带来了额外的开销，每次查询都要做一次缓存操作，失效后还要销毁**。因此，开启查询缓存要谨慎，尤其对于写密集的应用来说更是如此。如果开启，要注意合理控制缓存空间大小，一般来说其大小设置为`几十 MB` 比较合适。此外，**还可以通过 sql_cache 和 sql_no_cache 来控制某个查询语句是否需要缓存：**

``` sql
select sql_no_cache count(*) from usr;
```

## 事务

### 何为事务？

**事务是逻辑上的一组操作，要么都执行，要么都不执行。**

举一个事务最经典的例子**转账**。假如小明要给小红转账 1000 元，这个转账会涉及到两个关键操作就是：

1. 将小明的余额减少 1000 元；
2. 将小红的余额增加 1000 元。

事务会把这两个操作当作一个逻辑上的一个整体处理，这个整体里的所有操作要么都成功，要么都失败，这样就可以避免出现小明的余额减少了，但小红的余额没有增加的情况。

### 何为数据库事务？

数据库事务在我们日常开发中接触的最多的。如果你的项目属于单体架构的话，你接触到的往往就是数据库事务了（分布式应用环境中，需要考虑的是分布式事务处理）。

**数据库事务的作用**：数据库事务可以保证多个对数据库的操作（也就是 SQL 语句）构成一个逻辑上的整体。构成这个逻辑上的整体的这些数据库操作需要遵循：**要么全部执行成功，要么全部不执行**。

``` sql
# 开启一个事务
START TRANSACTION;
# 多条 SQL 语句
SQL1,SQL2...
# 提交事务
COMMIT;
```

<img :src="$withBase('/img/database/mysql/transaction.png')" alt="transaction">

另外，关系型数据库（例如：MySQL、SQL Server、Oracle等）事务都有 ACID 特性：

<img :src="$withBase('/img/database/mysql/事务特性.png')" alt="事务特性">

### ACID

1. **原子性**（`Atomicity`）：事务是最小的执行单位，不允许分割。事务的原子性确保数据库操作要么全部完成，要么全都失效；
2. **一致性**（`Consistency`）：执行事务前后，数据保持一致，例如转账业务中，无论事务是否成功，转账者和收款人的总额应该是不变的；
3. **隔离性**（`Isolation`）：并发访问数据库时，一个用户的事务不被其他事务锁干扰，并发事务之间数据是独立的；
4. **持久性**（`Durability`）：一个事务被提交之后，它对数据库中数据的改变是持久的，即使数据库发生故障也不应该对其有任何影响。

::: tip 数据事务的实现原理

这里以 MySQL 的 InnoDB 引擎为例简单的说一下。

MySQL InnoDB 引擎使用 **redo log（重做日志）** 保证事务的 **持久性**，使用 **undo log（回滚日志）** 来保证事务的 **原子性**。MySQL InnoDB 引擎通过 **锁机制、MVCC** 等手段来保证事务的隔离性（默认支持的隔离级别是 `REPEATABLE-READ`）。保证了事务的持久性、原子性、隔离性之后，一致性才能得到保障。

:::

### 并发事务带来的问题

在典型的应用程序中，多个事务并发运行，经常会操作相同的数据来完成各自的任务（多个用户对同一数据进行操作）。并发虽然是必须的，但可能会导致一下的问题。

* **脏读**（Dirty read）：当一个事务正在访问数据并且对数据进行了修改，而这种操作还没有提交到数据中，这时另外一个事务也访问了这个数据，然后使用了这个数据。因为这个数据是还没有提交的数据，那么另外一个事务读到的这个数据是“脏数据”，依据“脏数据”所作的操作可能是不正确的。
* **丢失修改**（lost to modify）：指在一个事务读取一个数据时，另外一个事务也访问了该数据，那么在第一个事务中修改了这个数据后，第二事务也修改了这个数据。这样第一个事务内的修改结果就被丢失了，因此被称为 **丢失修改**。例如：事务 1 读取某表的数据 A = 20，事务 2 也读取 A = 20，事务 1 修改 A = A - 1，事务 2 也修改 A = A - 1，最终事务 1 和事务 2 都提交之后，结果 A = 19，事务 1 的修改就被丢失了。
* **不可重复读**（Unrepea table read）：指在一个事务内多次读取同一数据。在这个事务还没有结束时，另一个事务也访问该数据。那么，在第一个事务中的两次读数据之间，由于第二个事务的修改，可能会导致第一个事务的两次读取到的数据不一致。这就会导致一个事务内两次读取到的数据不一致的情况，因此被称为 **不可重复读**。
* **幻读**（Phantom read）：幻读与不可重复读类似。第一个事务读取了几行数据，接着第二个事务插入了一些数据。如果第一个事务后续有进行该数据的查询，它就会发现多了一些原本不存在的记录，就好像发生了幻觉一样，所以被称为幻读。

::: tip 不可重读读与幻读的区别

不可重读的重点是修改，比如在一个事务里多次读取某一条记录发现其中的某些列的值被修改；幻读的重点在于新增或者删除，比如在一个事务里多次读取到某些记录增多或减少了。

:::

### 事务隔离级别

SQL 标准定义了四个隔离级别：

* **READ-UNCOMMITTED(读取未提交)：** 最低的隔离级别，允许读取尚未提交的数据变更，**可能会导致脏读、幻读或不可重复读**。

* **READ-COMMITTED(读取已提交)：** 允许读取并发事务已经提交的数据，**可以阻止脏读，但是幻读或不可重复读仍有可能发生**。

* **REPEATABLE-READ(可重复读)：** 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，**可以阻止脏读和不可重复读，但幻读仍有可能发生**。

* **SERIALIZABLE(可串行化)：** 最高的隔离级别，完全服从 ACID 的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，**该级别可以防止脏读、不可重复读以及幻读**。

| 隔离级别         | 脏读 | 不可重复读 | 幻读 |
| ---------------- | ---- | ---------- | ---- |
| READ-UNCOMMITTED | √    | √          | √    |
| READ-COMMITTED   | ×    | √          | √    |
| REPEATABLE-READ  | ×    | ×          | √    |
| SERIALIZABLE     | ×    | ×          | ×    |

### MySQL 的默认隔离级别

MySQL InnoDB 存储引擎的默认支持的隔离级别时  **REPEATABLE-READ（可重读）**。我们可以用通过以下命令来查看：

``` sql
# 查看默认事务隔离级别(MySQL 5.7)
SELECT @@tx_isolation;

# 查看默认事务隔离级别(MySQL 8.0)
select @@transaction_isolation;
```

| @@tx_isolation  |
| --------------- |
| REPEATABLE-READ |

**MySQL InnoDB 的 REPEATABLE-READ（可重复读）并不保证避免幻读，需要应用使用加锁读来保证。而这个加锁使用到的机制就是 Next-Key Locks**。

因为隔离级别越低，事务请求的锁越少，所以大部分数据库系统的隔离级别都是 **READ-COMMITTED（读取提交内容）**，但是你要知道的是 InnoDB 存储引擎默认使用 **REPEATABLE-READ（可重复读）** 并不会有任何性能损失。InnoDB 存储引擎在 **分布式事务** 的情况下一般会用到 **SERIALIZEABLE（可串行化）** 隔离级别。

::: tip 扩展一下

InnoDB 存储引擎提供了对 XA 事务的支持，并通过 XA 事务来支持分布式事务的实现。分布式事务指的是允许多个独立的事务资源（transactional resources）参与到一个全局的事务中。事务资源通常是关系型数据库系统，但也可以是其他类型的资源。全局事务要求在其中的所有参与的事务要么都提交，要么都回滚，这对于事务原有的 ACID 要求又有了提高。另外，在使用分布式事务时，InnoDB 存储引擎的事务隔离级别必须设置为 SERIALIZABLE。

> 摘自《MySQL 技术内幕：InnoDB 存储引擎(第 2 版)》7.7 章)

:::

> 摘自 JavaGuide [点击此处查看原文](https://snailclimb.gitee.io/javaguide/#/docs/database/MySQL)

