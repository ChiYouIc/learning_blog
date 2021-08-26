---
title: MySQL 面试
sidebar: auto
date: 2021-08-12
categories:
 - 数据库
tags:
 - MySQL
 - 面试
---
# 

## MySQL 批量插入，如何不插入重复数据

批量插入的业务场景很常见，但是通常都是需要前置校验，根据业务场景不同，可能会遇到'如果已存在，不处理'、'已存在，需要更新'

### insert ignore into

### no duplicate key update

### insert ... select ... where not exist

### replace into
