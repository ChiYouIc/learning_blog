---
title: MySQL 函数
sidebar: auto
date: 2021-11-21
categories:
 - 数据库
tags:
 - MySQL
---


## 字符串函数



| 函数                                  | 描述                                                         |
| :------------------------------------ | :----------------------------------------------------------- |
| ASCII(s)                              | 返回字符串 s 的第一个字符的 ASCII 码。                       |
| CHAR_LENGTH(s)                        | 返回字符串 s 的字符数                                        |
| CHARACTER_LENGTH(s)                   | 返回字符串 s 的字符数                                        |
| CONCAT(s1,s2...sn)                    | 字符串 s1,s2 等多个字符串合并为一个字符串                    |
| CONCAT_WS(x, s1,s2...sn)              | 同 CONCAT(s1,s2,...) 函数，但是每个字符串之间要加上 x，x 可以是分隔符 |
| FIELD(s,s1,s2...)                     | 返回第一个字符串 s 在字符串列表(s1,s2...)中的位置            |
| FIND_IN_SET(s1,s2)                    | 返回在字符串s2中与s1匹配的字符串的位置                       |
| FORMAT(x,n)                           | 函数可以将数字 x 进行格式化 "#,###.##", 将 x 保留到小数点后 n 位，最后一位四舍五入。 |
| INSERT(s1,x,len,s2)                   | 字符串 s2 替换 s1 的 x 位置开始长度为 len 的字符串           |
| LOCATE(s1,s)                          | 从字符串 s 中获取 s1 的开始位置                              |
| LCASE(s)                              | 将字符串 s 的所有字母变成小写字母                            |
| LEFT(s,n)                             | 返回字符串 s 的前 n 个字符                                   |
| LOWER(s)                              | 将字符串 s 的所有字母变成小写字母                            |
| LPAD(s1,len,s2)                       | 在字符串 s1 的开始处填充字符串 s2，使字符串长度达到 len      |
| LTRIM(s)                              | 去掉字符串 s 开始处的空格                                    |
| MID(s,n,len)                          | 从字符串 s 的 n 位置截取长度为 len 的子字符串，同 SUBSTRING(s,n,len) |
| POSITION(s1 IN s)                     | 从字符串 s 中获取 s1 的开始位置                              |
| REPEAT(s,n)                           | 将字符串 s 重复 n 次                                         |
| REPLACE(s,s1,s2)                      | 将字符串 s2 替代字符串 s 中的字符串 s1                       |
| REVERSE(s)                            | 将字符串s的顺序反过来                                        |
| RIGHT(s,n)                            | 返回字符串 s 的后 n 个字符                                   |
| RPAD(s1,len,s2)                       | 在字符串 s1 的结尾处添加字符串 s2，使字符串的长度达到 len    |
| RTRIM(s)                              | 去掉字符串 s 结尾处的空格                                    |
| SPACE(n)                              | 返回 n 个空格                                                |
| STRCMP(s1,s2)                         | 比较字符串 s1 和 s2，如果 s1 与 s2 相等返回 0 ，如果 s1>s2 返回 1，如果 s1<s2 返回 -1 |
| SUBSTR(s, start, length)              | 从字符串 s 的 start 位置截取长度为 length 的子字符串         |
| SUBSTRING(s, start, length)           | 从字符串 s 的 start 位置截取长度为 length 的子字符串         |
| SUBSTRING_INDEX(s, delimiter, number) | 返回从字符串 s 的第 number 个出现的分隔符 delimiter 之后的子串。 如果 number 是正数，返回第 number 个字符左边的字符串。 如果 number 是负数，返回第(number 的绝对值(从右边数))个字符右边的字符串。 |
| TRIM(s)                               | 去掉字符串 s 开始和结尾处的空格                              |
| UCASE(s)                              | 将字符串转换为大写                                           |
| UPPER(s)                              | 将字符串转换为大写                                           |



## 数字函数



| 函数名                             | 描述                                                         |
| :--------------------------------- | :----------------------------------------------------------- |
| ABS(x)                             | 返回 x 的绝对值                                              |
| ACOS(x)                            | 求 x 的反余弦值(参数是弧度)                                  |
| ASIN(x)                            | 求反正弦值(参数是弧度)                                       |
| ATAN(x)                            | 求反正切值(参数是弧度)                                       |
| ATAN2(n, m)                        | 求反正切值(参数是弧度)                                       |
| AVG(expression)                    | 返回一个表达式的平均值，expression 是一个字段                |
| CEIL(x)                            | 返回大于或等于 x 的最小整数                                  |
| CEILING(x)                         | 返回大于或等于 x 的最小整数                                  |
| COS(x)                             | 求余弦值(参数是弧度)                                         |
| COT(x)                             | 求余切值(参数是弧度)                                         |
| COUNT(expression)                  | 返回查询的记录总数，expression 参数是一个字段或者 * 号       |
| DEGREES(x)                         | 将弧度转换为角度                                             |
| n DIV m                            | 整除，n 为被除数，m 为除数                                   |
| EXP(x)                             | 返回 e 的 x 次方                                             |
| FLOOR(x)                           | 返回小于或等于 x 的最大整数                                  |
| GREATEST(expr1, expr2, expr3, ...) | 返回列表中的最大值                                           |
| LEAST(expr1, expr2, expr3, ...)    | 返回列表中的最小值                                           |
| LN                                 | 返回数字的自然对数，以 e 为底。                              |
| LOG(x) 或 LOG(base, x)             | 返回自然对数(以 e 为底的对数)，如果带有 base 参数，则 base 为指定带底数。 |
| LOG10(x)                           | 返回以 10 为底的对数                                         |
| LOG2(x)                            | 返回以 2 为底的对数                                          |
| MAX(expression)                    | 返回字段 expression 中的最大值                               |
| MIN(expression)                    | 返回字段 expression 中的最小值                               |
| MOD(x,y)                           | 返回 x 除以 y 以后的余数                                     |
| PI()                               | 返回圆周率(3.141593）                                        |
| POW(x,y)                           | 返回 x 的 y 次方                                             |
| POWER(x,y)                         | 返回 x 的 y 次方                                             |
| RADIANS(x)                         | 将角度转换为弧度                                             |
| RAND()                             | 返回 0 到 1 的随机数                                         |
| ROUND(x)                           | 返回离 x 最近的整数                                          |
| SIGN(x)                            | 返回 x 的符号，x 是负数、0、正数分别返回 -1、0 和 1          |
| SIN(x)                             | 求正弦值(参数是弧度)                                         |
| SQRT(x)                            | 返回x的平方根                                                |
| SUM(expression)                    | 返回指定字段的总和                                           |
| TAN(x)                             | 求正切值(参数是弧度)                                         |
| TRUNCATE(x,y)                      | 返回数值 x 保留到小数点后 y 位的值（与 ROUND 最大的区别是不会进行四舍五入） |



## 日期函数



| 函数名                                            | 描述                                                         |
| :------------------------------------------------ | :----------------------------------------------------------- |
| ADDDATE(d,n)                                      | 计算起始日期 d 加上 n 天的日期                               |
| ADDTIME(t,n)                                      | n 是一个时间表达式，时间 t 加上时间表达式 n                  |
| CURDATE()                                         | 返回当前日期                                                 |
| CURRENT_DATE()                                    | 返回当前日期                                                 |
| CURRENT_TIME                                      | 返回当前时间                                                 |
| CURRENT_TIMESTAMP()                               | 返回当前日期和时间                                           |
| CURTIME()                                         | 返回当前时间                                                 |
| DATE()                                            | 从日期或日期时间表达式中提取日期值                           |
| DATEDIFF(d1,d2)                                   | 计算日期 d1->d2 之间相隔的天数                               |
| DATE_ADD(d，INTERVAL expr type)                   | 计算起始日期 d 加上一个时间段后的日期，type 值可以是：<br ><ul><li>MICROSECOND</li><li>SECOND</li><li>MINUTE</li><li>HOUR</li><li>DAY</li><li>WEEK</li><li>MONTH</li><li>QUARTER</li><li>YEAR</li><li>SECOND_MICROSECOND</li><li>MINUTE_MICROSECOND</li><li>MINUTE_SECOND</li><li>HOUR_MICROSECOND</li><li>HOUR_SECOND</li><li>HOUR_MINUTE</li><li>DAY_MICROSECOND</li><li>DAY_SECOND</li><li>DAY_MINUTE</li><li>DAY_HOUR</li><li>YEAR_MONTH</li></ul>|
| DATE_FORMAT(d,f)                                  | 按表达式 f的要求显示日期 d                                   |
| DATE_SUB(date,INTERVAL expr type)                 | 函数从日期减去指定的时间间隔。                               |
| DAY(d)                                            | 返回日期值 d 的日期部分                                      |
| DAYNAME(d)                                        | 返回日期 d 是星期几，如 Monday,Tuesday                       |
| DAYOFMONTH(d)                                     | 计算日期 d 是本月的第几天                                    |
| DAYOFWEEK(d)                                      | 日期 d 今天是星期几，1 星期日，2 星期一，以此类推            |
| DAYOFYEAR(d)                                      | 计算日期 d 是本年的第几天                                    |
| EXTRACT(type FROM d)                              | 从日期 d 中获取指定的值，type 指定返回的值。 type可取值为： <ul><li>MICROSECOND</li><li>SECOND</li><li>MINUTE</li><li>HOUR</li><li>DAY</li><li>WEEK</li><li>MONTH</li><li>QUARTER</li><li>YEAR</li><li>SECOND_MICROSECOND</li><li>MINUTE_MICROSECOND</li><li>MINUTE_SECOND</li><li>HOUR_MICROSECOND</li><li>HOUR_SECOND</li><li>HOUR_MINUTE</li><li>DAY_MICROSECOND</li><li>DAY_SECOND</li><li>DAY_MINUTE</li><li>DAY_HOUR</li><li>YEAR_MONTH</li></ul>|
| FROM_DAYS(n)                                      | 计算从 0000 年 1 月 1 日开始 n 天后的日期                    |
| HOUR(t)                                           | 返回 t 中的小时值                                            |
| LAST_DAY(d)                                       | 返回给给定日期的那一月份的最后一天                           |
| LOCALTIME()                                       | 返回当前日期和时间                                           |
| LOCALTIMESTAMP()                                  | 返回当前日期和时间                                           |
| MAKEDATE(year, day-of-year)                       | 基于给定参数年份 year 和所在年中的天数序号 day-of-year 返回一个日期 |
| MAKETIME(hour, minute, second)                    | 组合时间，参数分别为小时、分钟、秒                           |
| MICROSECOND(date)                                 | 返回日期参数所对应的微秒数                                   |
| MINUTE(t)                                         | 返回 t 中的分钟值                                            |
| MONTHNAME(d)                                      | 返回日期当中的月份名称，如 November                          |
| MONTH(d)                                          | 返回日期d中的月份值，1 到 12                                 |
| NOW()                                             | 返回当前日期和时间                                           |
| PERIOD_ADD(period, number)                        | 为 年-月 组合日期添加一个时段                                |
| PERIOD_DIFF(period1, period2)                     | 返回两个时段之间的月份差值                                   |
| QUARTER(d)                                        | 返回日期d是第几季节，返回 1 到 4                             |
| SECOND(t)                                         | 返回 t 中的秒钟值                                            |
| SEC_TO_TIME(s)                                    | 将以秒为单位的时间 s 转换为时分秒的格式                      |
| STR_TO_DATE(string, format_mask)                  | 将字符串转变为日期                                           |
| SUBDATE(d,n)                                      | 日期 d 减去 n 天后的日期                                     |
| SUBTIME(t,n)                                      | 时间 t 减去 n 秒的时间                                       |
| SYSDATE()                                         | 返回当前日期和时间                                           |
| TIME(expression)                                  | 提取传入表达式的时间部分                                     |
| TIME_FORMAT(t,f)                                  | 按表达式 f 的要求显示时间 t                                  |
| TIME_TO_SEC(t)                                    | 将时间 t 转换为秒                                            |
| TIMEDIFF(time1, time2)                            | 计算时间差值                                                 |
| TIMESTAMP(expression, interval)                   | 单个参数时，函数返回日期或日期时间表达式；有2个参数时，将参数加和 |
| TIMESTAMPDIFF(unit,datetime_expr1,datetime_expr2) | 计算时间差，返回 datetime_expr2 − datetime_expr1 的时间差    |
| TO_DAYS(d)                                        | 计算日期 d 距离 0000 年 1 月 1 日的天数                      |
| WEEK(d)                                           | 计算日期 d 是本年的第几个星期，范围是 0 到 53                |
| WEEKDAY(d)                                        | 日期 d 是星期几，0 表示星期一，1 表示星期二                  |
| WEEKOFYEAR(d)                                     | 计算日期 d 是本年的第几个星期，范围是 0 到 53                |
| YEAR(d)                                           | 返回年份                                                     |
| YEARWEEK(date, mode)                              | 返回年份及第几周（0到53），mode 中 0 表示周天，1表示周一，以此类推 |

------

## 高级函数

| 函数名                                                       | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| BIN(x)                                                       | 返回 x 的二进制编码                                          |
| BINARY(s)                                                    | 将字符串 s 转换为二进制字符串                                |
| `CASE expression    WHEN condition1 THEN result1    WHEN condition2 THEN result2   ...    WHEN conditionN THEN resultN    ELSE result END` | CASE 表示函数开始，END 表示函数结束。如果 condition1 成立，则返回 result1, 如果 condition2 成立，则返回 result2，当全部不成立则返回 result，而当有一个成立之后，后面的就不执行了。 |
| CAST(x AS type)                                              | 转换数据类型                                                 |
| COALESCE(expr1, expr2, ...., expr_n)                         | 返回参数中的第一个非空表达式（从左向右）                     |
| CONNECTION_ID()                                              | 返回唯一的连接 ID                                            |
| CONV(x,f1,f2)                                                | 返回 f1 进制数变成 f2 进制数                                 |
| CONVERT(s USING cs)                                          | 函数将字符串 s 的字符集变成 cs                               |
| CURRENT_USER()                                               | 返回当前用户                                                 |
| DATABASE()                                                   | 返回当前数据库名                                             |
| IF(expr,v1,v2)                                               | 如果表达式 expr 成立，返回结果 v1；否则，返回结果 v2。       |
| IFNULL(v1,v2)                                                | 如果 v1 的值不为 NULL，则返回 v1，否则返回 v2。              |
| ISNULL(expression)                                           | 判断表达式是否为 NULL                                        |
| LAST_INSERT_ID()                                             | 返回最近生成的 AUTO_INCREMENT 值                             |
| NULLIF(expr1, expr2)                                         | 比较两个字符串，如果字符串 expr1 与 expr2 相等 返回 NULL，否则返回 expr1 |
| SESSION_USER()                                               | 返回当前用户                                                 |
| SYSTEM_USER()                                                | 返回当前用户                                                 |
| USER()                                                       | 返回当前用户                                                 |
| VERSION()                                                    | 返回数据库的版本号                                           |
