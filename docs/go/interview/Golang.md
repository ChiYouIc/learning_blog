---
title: Golang 面试题
sidebar: auto
date: 2022-02-21
categories:
 - Go
tags:
 - 面试
---



## gRPC为什么高效

- 采用 protobuf 的二进制数据流通信，相比 json 数据，体积更小（无需分隔符、空字段省略、tag二进制表示），解码速度更快；
- 采用 http 2.0 协议通信（http 2.0 与 http1 和 http 1.1 对比）。

## struct 能不能比较

因为 go 是强类型语言，所以不同类型的结构不能做比较，但是同一类型的实例值是可以比较的，对于实例是指针类型是不可以作比较的。

## defer

defer 是先进后出，后进先出。

## select 可以用什么

select 是 golang 中的一个控制结构，类似于用于 IO 的 switch 语句，每一个 case 语句都是一个 IO 操作。select 的 case 语句是随机执行的，如果当前没有可执行的 case，那么它将阻塞，知道有可运行的 case，所以在使用 select 时，需要编写一个默认（default）可以运行的字句。

## 主协程如何等待其余协程完再操作

- 可以使用 channel 通道实现生产消费模式处理
- 使用 context
- 使用 select 语句

## 切片如何扩容

切片（slice）底层的数据结构是由数组、len、cap 组成，在使用 append 函数进行扩容时，会先查看数组后面还有没有连续内存块，如果有，则直接在后面添加，没有就重新创建一个大的数组。

## 切片与数组的区别

切片是一个动态数组，切片的长度和容量是可以根据需要进行调整的（使用 append() 方法），而数组的长度是固定的。

## map 如何实现顺序读取

map 本身是不能顺序读取的，因为它是无序的，如果想要进行有序遍历，可以通过将 map 中的所有 key 存到一个数组或者切片中，在数组中对 key 进行排序，通过遍历切片中的 key 遍历 map 即可实现顺序读取 map。

## 实现消息队列（多生产者、多消费者）

- 使用切片 + 锁的方式可实现

- 使用 channel 通道实现
``` go
package main
import (
	"fmt"
	"time"
)

func main() {
	intChan := make(chan int, 2)
	defer close(intChan)

	go producer(intChan)
	go consumer(intChan)

	time.Sleep(20 * time.Second)
}

// producer 生产者
func producer(q chan<- int) {
	for i := 0; i < 10; i++ {
		time.Sleep(1 * time.Second)
		q <- i
		fmt.Println("生产:", i)
	}
}

// consumer 消费者
func consumer(q <-chan int) {
	for i := range q {
		time.Sleep(2 * time.Second)
		fmt.Println("消费:", i)
	}
}
```


## go的值传递和引用传递

go 函数默认是值传递，如果需要使用引用传递，需要通过指针进行传递参数。

## go 语言中的接口

go 语言中的接口是一种数据结构，它将所有的具有共性的方法定义在一起，任何其它类型只要实现了这些方法就是实现了这个接口。

## channel 是有缓冲还是无缓冲通道

使用 make 函数创建通道，不指定通道大小时创建的是无缓冲通道，指定大小创建出来的是有缓冲通道。
