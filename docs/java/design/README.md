# 设计模式

## UML 类图

类图分为三层：

* `第一层是类的名称`，如果是抽象类或接口，就用斜体表示，其中接口名称的上部会用\<\<interface\>\>修饰；

* `第二层是类的成员变量`，通常是字段和属性；

* `第三层是类的成员方法`,类的成员变量和成员方法的修饰符分为`+`、`#`、`-`，分别表示 `public`、`protected`、`private`。

<img :src="$withBase('/img/java/design/类的表示.png')" alt="类的表示">

## 类之间的关系

> 类之间的关系有`泛化（Generalize）`、`实现（Realize）`、`关联（Associate）`、`聚合（Aggregate）`、`组合(Compose)`、`依赖(Dependency)`。

### 泛化（Generalize）

<img :src="$withBase('/img/java/design/泛化.png')" alt="泛化">

**关系**：泛化是一种继承关系，用来表示`类与类`、`类与抽象类`、`抽象类与抽象类`、`接口与接口`之间的关系。

**箭线**：用空心三角形 + 实线表示，`箭头指向父类`。

### 实现（Realize）

<img :src="$withBase('/img/java/design/实现.png')" alt="实现">

**关系**：实现用来表示`类与接口`、`抽象类与接口`之间的关系。

**箭线**：用空心三角形 + 虚线表示，`箭头指向接口`。

### 关联（Associate）

<img :src="$withBase('/img/java/design/关联.png')" alt="关联">

**关系**：关联可以是双向的，也可以是单向的；关联关系可以进一步划分为`聚合`及`组合关系`。

**箭线**：用实线箭头表示，双向的关联可以有两个箭头或者没有箭头，单向的关联有一个箭头。

比如，荷花受季节影响，箭头指向季节。

### 聚合（Aggregate）

<img :src="$withBase('/img/java/design/聚合.png')" alt="聚合">

**关系**：聚合用来表示`整体与部分的关系，是一种弱的关联关系`，体现为 A 可以包含 B，但 B 不一定是 A 的一部分。

**箭线**：用空心的菱形 + 实线箭头表示，菱形指向整体。

### 组合(Compose)

<img :src="$withBase('/img/java/design/组合.png')" alt="组合">

**关系**：组合用来表示`整体与部分的关系，是一种强的关联关系，体现了严格的整体和部分的关系，整体和部分的生命周期一样`。

**箭线**：用实心的菱形 + 实线箭头表示，菱形指向整体。

### 依赖(Dependency)

<img :src="$withBase('/img/java/design/依赖.png')" alt="依赖">

**关系**：依赖用来表示两者之间的依从关系。

**箭线**：用虚线箭头表示，箭头指向被依赖的对象。

比如，陆生植物依赖土壤，而水生植物依赖水，当然了，陆生植物也依赖水，这里只是为了更直观地体现陆生和水生的本质区别。比如，陆生植物依赖土壤，而水生植物依赖水，当然了，陆生植物也依赖水，这里只是为了更直观地体现陆生和水生的本质区别。

### 完整类图

<img :src="$withBase('/img/java/design/完整类图.png')" alt="完整类图">

> 参考文章：
> * <a href='https://www.cnblogs.com/zhou-yi/p/5311160.html' target='_blank'>https://www.cnblogs.com/zhou-yi/p/5311160.html</a>
> * <a href='https://blog.csdn.net/zhengzhb/article/details/7187278' target='_blank'>https://blog.csdn.net/zhengzhb/article/details/7187278</a>
