---
title: GO 接口
sidebar: auto
date: 2021-08-12
categories:
 - Go
tags:
 - Go
---

# GO 接口

在一些面向对象的编程语言中，接口可以定义对象的行为，只用于指定或规范对象的行为，行为的具体实现取决于对象。

在 Go 语言中，接口是一组方法的集合，但不包含方法的实现、是抽象的，接口中也不能包含变量。当一个类型 T 提供了接口中所有的方法定义时，就说 T 实现了接口。接口指定类型应该有那些方法，类型决定如何去实现这些方法。



## 接口声明

接口的声明与结构体很相似，使用类型别名与关键字 interface 就可以声明一个接口，语法如下：

``` go
type name_type interface {
    Method1(param_list) return_type
    ...
    methodn(param_list) return_type
}
```

真实的接口定义例子：

``` go
type Shape interface {
    Area() float32
}
```

上述代码中，声明一个名为 Shape 的接口，接口中包含了一个不带参数且返回为 floa32 的方法 Area() 。如果存在一个类型 T 实现了 Area()，则称类型 T 实现了接口 Shape。

``` go
type Shape interface {
	Area() float32
}

func main() {
	var shape Shape
	fmt.Println("shape 的值: ", shape)
	fmt.Printf("shape 的类型: %T\n", shape)
}
```

输出：

``` shell
shape 的值:  <nil>
shape 的类型: <nil>
```



## 接口类型值

### 静态类型和动态类型

变量的类型在声明时指定、且不能改变，称为静态类型。接口类型的静态类型是接口本身。接口没有静态值，它指向的是动态值。接口类型的变量存的是实现接口的类型的值。该值就是接口的动态值，实现接口的类型就是接口的动态类型。

``` go
type Shape interface {
	Area() float32
}

type Rect struct {
	width  float32
	height float32
}

func (rect Rect) Area() float32 {
	return rect.width * rect.height
}

type Square struct {
	width float32
}

func (square Square) Area() float32 {
	return square.width * square.width
}

func main() {
	var shape Shape = Rect{width: 12, height: 24}
	fmt.Printf("shape 类型: %T\n", shape)
	fmt.Printf("shape 的值: %v\n", shape)
	shape = Square{width: 10}
	fmt.Printf("shape 类型: %T\n", shape)
	fmt.Printf("shape 的值: %v\n", shape)
}
```

输出：

``` shell
shape 类型: main.Rect
shape 的值: {12 24}
shape 类型: main.Square
shape 的值: {10}
```

上述代码中，变量 shape 的静态类型是 Shape，是不能改变的。动态类型确实不固定的，第一次赋值，shape 的动态类型是 Rect，第二次赋值之后，其动态类型变为 Square。

有时候，我们也会称接口的动态类型为 **具体类型**，当我们访问接口类型的时候，获取的是底层动态值的类型。



### nil 接口值

首先先看一个例子：

``` go
type Shape interface {
	Area() 
}

type Triangle struct {}

func (t Triangle) Area() {}

func main() {

	var t *Triangle

	fmt.Printf("t == nil: %v\n", t == nil)

	var shape Shape = t

	fmt.Printf("shape 类型: %T\n", shape)
    fmt.Printf("shape 的值: %v\n", shape)
	fmt.Printf("shape == nil: %v\n", shape == nil)
	fmt.Printf("shape == nil: %v\n", shape == (*Triangle)(nil))
}
```

输出：

``` shell
t == nil: true
shape 类型: *main.Triangle
shape 的值: <nil>
shape == nil: false
shape == nil: true
```

上述代码中，我们声明了一个指针标量 t，t 的 value 值是 nil，动态类型是 *Triangle；所以将 t 的值赋给变量 shape 时，shape 的动态类型变为是 *Triangle，但为什么 t 等于 nil，但 shape 不等于 nil 呢？因为 t 的静态类型就是指针，是一个（ *Triangle）类型，它的值就是 nil 指针（空指针），所以与 nil 相等；而 shape 的静态类型是 Shape，赋值过后，其值是 nil 指针，但其动态类型是（ *Triangle），所以是不等于 nil 的，只有**当且仅当动态值和动态类型都为 nil 时，接口类型值才为 nil**，否则不成立。

这也解释了第一个代码案例中，变量 shape 的值与类型为什么都为 nil，shape 声明时，其动态类型就是 nil。

::: tip Go 语言规范

``` go
var x interface{} // x is nil and has static type interface{}
 var v *T      // v has value nil, static type *T
 x = 42       // x has value 42 and dynamic type int
 x = v       // x has value (*T)(nil) and dynamic type *T
```

:::



## 实现接口

直接上代码

``` go
type Shape interface {
	Area() float32
}

type Rect struct {
	width  float32
	height float32
}

func (rect Rect) Area() float32 {
	return rect.width * rect.height
}

func main() {

	var shape Shape

	shape = Rect{20, 10}

	rect := Rect{20, 10}

	fmt.Printf("shape 的类型: %T\n", shape)
	fmt.Printf("shape 的值: %v\n", shape)
	fmt.Printf("shape 的 Area(): %v\n", shape.Area())
	fmt.Printf("shape == rect: %v\n", shape == rect)
}
```

输出：

``` shell
shape 的类型: main.Rect
shape 的值: {5 4}
shape 的 Area(): 20
shape == rect: true
```

上述代码中，我们创建了一个接口 Shape、一个结构体 Rect 以及方法 Area()，由于是 Rect 实现了方法 Area()，所以我们称 Rect 实现了接口 Shape。

在主函数中，shape 的静态类型为  Shape，经赋值之后，其动态类型为 Rect，所以我们可以直接通过 `.` 的方式直接调用 Area() 方法。



## 空接口

一个不包含任何方法的接口，称之为空接口，形如：interface{}。因为空接口不包含任何的方法，所以任何类型都默认实现了空接口。

其实在 fmt 包中的 Println() 函数就应用到了空接口，以至于这个函数可以接收任意类型的参数，比如：int、string、array 等等。

``` go
func Println(a ...interface{}) (n int, err error) {}
```



## 实现多个接口

一个类型可以实现多个接口，如下案例：

``` go
type Shape interface {
	Area() float32
}

type Plane interface {
	Perimeter() float32
}

type Square struct {
	width float32
}

func (s Square) Area() float32 {
	return s.width * s.width
}

func (s Square) Perimeter() float32 {
	return s.width * 4
}

func main() {

	s := Square{4}
	var shape Shape = s
	var plane Plane = s

	fmt.Printf("面积: %v\n", shape.Area())
	fmt.Printf("周长: %v\n", plane.Perimeter())

}
```

输出：

``` shell
面积: 16
周长: 16
```

上述代码中，类型 Square 实现了接口 Shape 和 Plane，所以在 main 方法中，可以将变量 s 分别赋值给 shape 和 plane，并分别访问自己接口的方法；虽然 shape 和 plane 的动态类型都是 Square，但 shape 不能调用 Perimeter()，plane 不能调用 Area()，因为调用类型方法时，只允许调用变量静态类型中所定义的方法。



## 类型断言

类型断言可以用来获取接口的底层值，通常的语法：`i.(Type)`，其中 i 是接口，Type 是类型或接口。**当 Type 是类型，编译时会自动检测 i 的动态类型与 Type 是否一致；当 Type 是接口，编译时会自动检测 i 的动态类型是否实现了接口 Type**。

``` go
type Shape interface {
	Area() float32
}

type Plane interface {
	Perimeter() float32
}

type Square struct {
	width float32
}

func (s Square) Area() float32 {
	return s.width * s.width
}

func (s Square) Perimeter() float32 {
	return s.width * 4
}

func main() {

	var shape Shape = Square{4}
	s := shape.(Square)

	fmt.Printf("s 的类型: %T\n", s)
	fmt.Printf("s 的值: %v\n", s)
	fmt.Printf("面积: %v\n", s.Area())
	fmt.Printf("周长: %v\n", s.Perimeter())
}
```

输出：

``` shell
s 的类型: main.Square
s 的值: {4}
面积: 16
周长: 16
```

在语法 i.(Type) 中，如果 Type 没有实现 i 所属的接口，编译时会报错；或者说 i 的动态值不是 Type，则会报 panic 错误。我们可以使用以下语法解决：

``` go
value, ok := i.(Type)
```

使用上述的语法，GO 会自动检测上面提到的两种情况，我们只需要通过变量 ok 判断结果是否正确即可。如果正确，ok 为 true，否则为 false，value 为 Type 对应的零值。



## 类型选择

类型选择用于将接口的具体类型与各种 case 语句中指定的多种类型进行匹配比较，优点类似于 switch case 语句，不同的是 case 中指定是类型。

类型选择的语法有点类似于类型断言的语法：i.(type)，其中 i 是接口，type 是固定关键字，使用这种方式可以获取接口的具体类型而不是值，每一个 case 中的类型必须实现了 i 接口。

``` go
func switchType(i interface{}) {
	switch i.(type) {
	case string:
		fmt.Printf("string 类型，值: %v\n", i.(string))
	case int:
		fmt.Printf("int 类型，值: %v\n", i.(int))
	default:
		fmt.Printf("未知类型\n")
	}
}

func main() {
	switchType("你好")
	switchType(22)
	switchType(false)
}
```

输出：

``` shell
string 类型，值: 你好
int 类型，值: 22
为知类型
```

上面的代码很好理解，i 的类型匹配到哪个 case，就会执行相应的输出语句。**注意：只有接口类型才可以进行类型选择**。其他类型，例如 int、string 等是不能的：

``` go
i := 1
switch i.(type) {
    case int:
    println("int type")
    default:
    println("unknown type")
}
```

报错：

``` shell
cannot type switch on non-interface value i (type int)
```



## 接口嵌套

GO 语言中，接口不能去实现别的接口，同时也不能继承，但是可以通过嵌套接口创新接口。

``` go
type Math interface {
	Shape
	Plane
}

type Shape interface {
	Area() float32
}

type Plane interface {
	Perimeter() float32
}

type Square struct {
	width float32
}

func (s Square) Area() float32 {
	return s.width * s.width
}

func (s Square) Perimeter() float32 {
	return s.width * 4
}

func main() {

	s := Square{4}
	var math Math = s

	fmt.Printf("s 的类型: %T\n", math)
	fmt.Printf("s 的值: %v\n", math)
	fmt.Printf("面积: %v\n", math.Area())
	fmt.Printf("周长: %v\n", math.Perimeter())
}

```

输出：

``` shell
s 的类型: main.Square
s 的值: {4}
面积: 16
周长: 16
```

上述代码中，通过嵌套接口 Shape 和 Plane，创建了新的接口 Math。



## 使用指针接收者和值接收者实现接口

前面我们都是通过值接收者去实现接口的，其实还可以通过指针接收者实现接口。实现过程中还是有需要注意的地方，如下：

``` go
type Shape interface {
	Area() float32
}

type Square struct {
	side float32
}

type Circle struct {
	radius float32
}

func (c Circle) Area() float32 {
	return math.Pi * (c.radius * c.radius)
}

func (s *Square) Area() float32 {
	return s.side * s.side
}

func main() {

	var s Shape
	c1 := Circle{3}
	s = c1
	fmt.Printf("面积: %v\n", s.Area())

	c2 := Circle{4}
	s = &c2
	fmt.Printf("面积: %v\n", s.Area())

	c3 := Square{3}
	//s = c3
	s = &c3
	fmt.Printf("面积: %v\n", s.Area())
}
```

输出：

``` shell
面积: 28.274334
面积: 50.265484
面积: 9
```

上述代码中，结构体 Circle 通过值接收者实现了接口 Shape，由于值接收者的方法可以使用值或者指针调用，所以在 main 方法中 c1 和 c2 的调用方式是合法的。

结构体 Square 通过指针接收者实现了接口 Shape。如果将上述代码中注释部分打开，会报编译错误：

``` shell
cannot use c3 (type Square) as type Shape in assignment:
Square does not implement Shape (Area method has pointer receiver)
```

从报错提示信息可以清除看出，此时我们尝试将值类型 c3 分配给 s，但 c3 并没有实现接口 Shape。这可能会令我们惊讶，因为在方法中，我们可以直接通过值类型或指针类型调用指针接收方法。

但请记住一点：**对于指针接收者的方法，用一个指针或者一个可取得地址的值来调用都是合法的**。但接口存储的具体值是不可寻址的，对于编译器无法自动获取 c3 的地址，于是程序就报错了。
