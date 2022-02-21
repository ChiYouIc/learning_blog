(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{559:function(t,e,l){"use strict";l.r(e);var v=l(4),_=Object(v.a)({},(function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[l("h2",{attrs:{id:"数值类型"}},[t._v("数值类型")]),t._v(" "),l("p",[t._v("MySQL 支持所有标准 SQL 数值数据类型。")]),t._v(" "),l("p",[t._v("这些类型包括严格数值数据类型(INTEGER、SMALLINT、DECIMAL 和 NUMERIC)，以及近似数值数据类型(FLOAT、REAL 和 DOUBLE PRECISION)。")]),t._v(" "),l("p",[t._v("关键字 INT 是 INTEGER 的同义词，关键字 DEC 是 DECIMAL 的同义词。")]),t._v(" "),l("p",[t._v("BIT数据类型保存位字段值，并且支持 MyISAM、MEMORY、InnoDB 和 BDB表。")]),t._v(" "),l("p",[t._v("作为 SQL 标准的扩展，MySQL 也支持整数类型 TINYINT、MEDIUMINT 和 BIGINT。下面的表显示了需要的每个整数类型的存储和范围。")]),t._v(" "),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"left"}},[t._v("类型")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("大小")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("范围（有符号）")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("范围（无符号）")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("用途")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("TINYINT")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("1 Bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(-128，127)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(0，255)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("小整数值")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("SMALLINT")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("2 Bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(-32 768，32 767)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(0，65 535)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("大整数值")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("MEDIUMINT")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("3 Bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(-8 388 608，8 388 607)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(0，16 777 215)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("大整数值")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("INT 或 INTEGER")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("4 Bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(-2 147 483 648，2 147 483 647)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(0，4 294 967 295)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("大整数值")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("BIGINT")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("8 Bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(-9,223,372,036,854,775,808，9 223 372 036 854 775 807)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(0，18 446 744 073 709 551 615)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("极大整数值")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("FLOAT")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("4 Bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(-3.402 823 466 E+38，-1.175 494 351 E-38)，0，(1.175 494 351 E-38，3.402 823 466 351 E+38)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0，(1.175 494 351 E-38，3.402 823 466 E+38)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("单精度 浮点数值")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("DOUBLE")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("8 Bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("(-1.797 693 134 862 315 7 E+308，-2.225 073 858 507 201 4 E-308)，0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0，(2.225 073 858 507 201 4 E-308，1.797 693 134 862 315 7 E+308)")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("双精度 浮点数值")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("DECIMAL")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("对DECIMAL(M,D) ，如果M>D，为M+2否则为D+2")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("依赖于M和D的值")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("依赖于M和D的值")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("小数值")])])])]),t._v(" "),l("h2",{attrs:{id:"日期和时间类型"}},[t._v("日期和时间类型")]),t._v(" "),l("p",[t._v("表示时间值的日期和时间类型为DATETIME、DATE、TIMESTAMP、TIME和YEAR。")]),t._v(" "),l("p",[t._v('每个时间类型有一个有效值范围和一个"零"值，当指定不合法的MySQL不能表示的值时使用"零"值。')]),t._v(" "),l("p",[t._v("TIMESTAMP类型有专有的自动更新特性，将在后面描述。")]),t._v(" "),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"left"}},[t._v("类型")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("大小 ( bytes)")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("范围")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("格式")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("用途")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("DATE")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("3")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("1000-01-01/9999-12-31")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("YYYY-MM-DD")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("日期值")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("TIME")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("3")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("'-838:59:59'/'838:59:59'")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("HH:MM:SS")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("时间值或持续时间")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("YEAR")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("1")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("1901/2155")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("YYYY")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("年份值")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("DATETIME")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("8")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("1000-01-01 00:00:00/9999-12-31 23:59:59")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("YYYY-MM-DD HH:MM:SS")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("混合日期和时间值")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("TIMESTAMP")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("4")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("1970-01-01 00:00:00/2038结束时间是第 "),l("strong",[t._v("2147483647")]),t._v(" 秒，北京时间 "),l("strong",[t._v("2038-1-19 11:14:07")]),t._v("，格林尼治时间 2038年1月19日 凌晨 03:14:07")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("YYYYMMDD HHMMSS")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("混合日期和时间值，时间戳")])])])]),t._v(" "),l("h2",{attrs:{id:"字符串类型"}},[t._v("字符串类型")]),t._v(" "),l("p",[t._v("字符串类型指CHAR、VARCHAR、BINARY、VARBINARY、BLOB、TEXT、ENUM和SET。该节描述了这些类型如何工作以及如何在查询中使用这些类型。")]),t._v(" "),l("table",[l("thead",[l("tr",[l("th",{staticStyle:{"text-align":"left"}},[t._v("类型")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("大小")]),t._v(" "),l("th",{staticStyle:{"text-align":"left"}},[t._v("用途")])])]),t._v(" "),l("tbody",[l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("CHAR")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0-255 bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("定长字符串")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("VARCHAR")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0-65535 bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("变长字符串")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("TINYBLOB")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0-255 bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("不超过 255 个字符的二进制字符串")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("TINYTEXT")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0-255 bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("短文本字符串")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("BLOB")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0-65 535 bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("二进制形式的长文本数据")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("TEXT")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0-65 535 bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("长文本数据")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("MEDIUMBLOB")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0-16 777 215 bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("二进制形式的中等长度文本数据")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("MEDIUMTEXT")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0-16 777 215 bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("中等长度文本数据")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("LONGBLOB")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0-4 294 967 295 bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("二进制形式的极大文本数据")])]),t._v(" "),l("tr",[l("td",{staticStyle:{"text-align":"left"}},[t._v("LONGTEXT")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("0-4 294 967 295 bytes")]),t._v(" "),l("td",{staticStyle:{"text-align":"left"}},[t._v("极大文本数据")])])])]),t._v(" "),l("p",[l("strong",[t._v("注意")]),t._v("：char(n) 和 varchar(n) 中括号中 n 代表字符的个数，并不代表字节个数，比如 CHAR(30) 就可以存储 30 个字符。")]),t._v(" "),l("p",[t._v("CHAR 和 VARCHAR 类型类似，但它们保存和检索的方式不同。它们的最大长度和是否尾部空格被保留等方面也不同。在存储或检索过程中不进行大小写转换。")]),t._v(" "),l("div",{staticClass:"custom-block tip"},[l("p",{staticClass:"title"},[t._v("char 与 varchar 的区别（面试）")]),l("p",[t._v("两方面：")]),t._v(" "),l("ul",[l("li",[l("p",[t._v("存储方式不同")]),t._v(" "),l("p",[t._v("char 使用的是定长存储方式，即填充数据长度小于定义数据长度时，使用空格填充；而 varchar 使用的是可变长度存储方式，即填充数据长度小于定义数据长度时，数据长度等于填充数据长度。对于 char 的这种方式，优点在于存取速度快，缺点就是会浪费存储空间；对于 varchar 则恰好相反，它的优点就是节约存储空间，存取速度相比 char 较慢。")])]),t._v(" "),l("li",[l("p",[t._v("存储容量大小（可从上述表格中看出）")])])])]),l("p",[t._v("BINARY 和 VARBINARY 类似于 CHAR 和 VARCHAR，不同的是它们包含二进制字符串而不要非二进制字符串。也就是说，它们包含字节字符串而不是字符字符串。这说明它们没有字符集，并且排序和比较基于列值字节的数值值。")]),t._v(" "),l("p",[t._v("BLOB 是一个二进制大对象，可以容纳可变数量的数据。有 4 种 BLOB 类型：TINYBLOB、BLOB、MEDIUMBLOB 和 LONGBLOB。它们区别在于可容纳存储范围不同。")]),t._v(" "),l("p",[t._v("有 4 种 TEXT 类型：TINYTEXT、TEXT、MEDIUMTEXT 和 LONGTEXT。对应的这 4 种 BLOB 类型，可存储的最大长度不同，可根据实际情况选择。")])])}),[],!1,null,null,null);e.default=_.exports}}]);