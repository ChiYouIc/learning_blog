---
title: 请求合并
sidebar: auto
date: 2021-07-23
categories:
 - 微服务
tags:
 - SpringCloud
---

> 微服务系统中的服务间通信，需要通过远程调用来实现，随着调用次数越来越多，占用的线程资源也会越来越多。
> Hystrix 中提供了 `@hystrixCollapser` 用于合并请求，从而达到减少通信消耗及线程数量的效果。

## @hystrixCollapser 的属性
> * batchMethod：用于设置请求合并的方法；
>
> * collapserProperties：请求合并属性，用于控制实例属性，有很多；
>
> * timerDelayInMilliseconds：collapserProperties中的属性，用于控制每隔多少时间合并一次请求。

## 演示

> 在 DeptController 中添加 testCollapser 方法，这里先进行两次服务调用，再间隔 200ms 以后进行第三次服务调用：

```java 
@GetMapping("/testCollaper")
public String testCollapser() throws ExecutionException, InterruptedException {
    Future<Dept> future1 = deptService.getDeptFuture("1");
    Future<Dept> future2 = deptService.getDeptFuture("2");

    future1.get();
    future2.get();

    Thread.sleep(200);
    
    Future<Dept> future3 = deptService.getDeptFuture("3");
    future3.get();

    return "OK";
}
```

> 使用 `@HystrixCollapser` 实现请求合并，所有对 getDeptFuture 的多次调用都会转化为 getDeptByIds 的单次调用：

```java 
@HystrixCollapser(batchMethod = "getDeptByIds", collapserProperties = {
        @HystrixProperty(name = "timerDelayInMilliseconds", value = "100")
})
@Override
public Future<Dept> getDeptFuture(String id) {
    return new AsyncResult<Dept>() {
        @Override
        public Dept invoke() {
            LOGGER.info("getDeptById id: {}", id);
            return restTemplate.getForObject(REST_URL_PREFIX.concat("/dept/{1}"), Dept.class, id);
        }
    };
}

@HystrixCommand
public List<Dept> getDeptByIds(List<String> ids) {
    LOGGER.info("getDeptByIds ids: {}", ids);
    return restTemplate.getForObject(REST_URL_PREFIX.concat("/deptByIds&ids={1}"), List.class, String.join(",", ids));
}
```

> 访问测试接口 <a href='http:\\localhost:8080\consumer\dept\testCollaper'>http:\\localhost:8080\consumer\dept\testCollaper</a>，
> 由于设置了 100 毫秒进行一次请求合并，请两次被合并，最后一次单独合并了。

<img :src="$withBase('/img/microservice/hystrix/请求合并.png')" alt="请求合并" >

