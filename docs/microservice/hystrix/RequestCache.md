---
title: 请求缓存
sidebar: auto
date: 2021-07-24
categories:
 - 微服务
tags:
 - SpringCloud
---

> 当系统并发量越来越大时，就需要使用缓存来优化系统，达到减轻并发请求线程数，提供响应速度的效果。

## 相关注解

* `@CacheResult`：开器缓存，默认所有参数作为缓存的 key，`cacheKeyMethod` 可以通过返回 String 类型的方法指定 key；

* `@CacheKey`：指定缓存的 key，可以指定参数或指定参数中的属性值为缓存 key，`cacheKeyMethod` 还可以通过返回String类型的方法指定；

* `@CacheRemove`：移除缓存，需要指定 commandKey。

## 使用缓存

> 在 DeptController 中添加使用缓存的测试接口，直接在这里连续调用三次 `getDeptByCache` 方法：

```java 
@GetMapping("/testCache/{id}")
public Dept getDeptByCache(@PathVariable String id) {
    deptService.getDeptByCache(id);
    deptService.getDeptByCache(id);
    return deptService.getDeptByCache(id);
}
```

> 在 DeptServiceImpl 中添加具有缓存功能的 `getDeptByCache` 方法

```java 
@Override
@CacheResult(cacheKeyMethod = "getCacheKey")
@HystrixCommand(fallbackMethod = "defaultGetById", commandKey = "getDeptByCache")
public Dept getDeptByCache(String id) {
    LOGGER.info("getDeptByCache id: {}", id);
    return restTemplate.getForObject(REST_URL_PREFIX.concat("/dept/{1}"), Dept.class, id);
}

/**
 * 为缓存生成 key 的方法
 */
public String getCacheKey(String id) {
    return id;
}
```

> 调用接口 <a href='http:\\localhost:8080\consumer\dept\testCache\1'>http:\\localhost:8080\consumer\dept\testCache\1</a>
> 这个接口中调用了三次 `getDeptByCache` 方法，但是只打印了一次日志，说明有两次走的是缓存：

<img :src="$withBase('/img/microservice/hystrix/接口缓存.png')" alt="接口缓存" >

## 移除缓存

> 在 DeptController 中添加移除缓存的测试接口，调用一次 `removeCache` 方法

```java
@GetMapping("/testRemoveCache/{id}")
public Dept removeCache(@PathVariable String id) {
    deptService.getDeptByCache(id);
    deptService.removeCache(id);
    return deptService.getDeptByCache(id);
}
```

> 在 DeptServiceImpl 中添加具有移除缓存功能的 `removeCache` 方法：

```java 
@Override
@CacheRemove(commandKey = "getDeptByCache",cacheKeyMethod = "getCacheKey")
@HystrixCommand
public Dept removeCache(String id) {
    LOGGER.info("remove cache id: {}", id);
    return restTemplate.getForObject(REST_URL_PREFIX.concat("/dept/{1}"), Dept.class, id);
}
```

> 调用接口测试 <a href='http:\\localhost:8080\consumer\dept\testRemoveCache\1'>http:\\localhost:8080\consumer\dept\testRemoveCache\1</a>，
> 可以发现三次都是走的远程调用：

<img :src="$withBase('/img/microservice/hystrix/移除缓存.png')" alt="移除缓存" >

::: warning 缓存使用过程中的问题 

在缓存使用过程中，需要在每次使用缓存的请求前后对 HystrixRequestContext 进行初始化和关闭，否则会出现一下异常：

```shell
java.lang.IllegalStateException: Request caching is not available. Maybe you need to initialize the HystrixRequestContext?
	at com.netflix.hystrix.HystrixRequestCache.get(HystrixRequestCache.java:104) ~[hystrix-core-1.5.12.jar:1.5.12]
	at com.netflix.hystrix.AbstractCommand$7.call(AbstractCommand.java:478) ~[hystrix-core-1.5.12.jar:1.5.12]
	at com.netflix.hystrix.AbstractCommand$7.call(AbstractCommand.java:454) ~[hystrix-core-1.5.12.jar:1.5.12]
```

这里通过使用过滤器的方式，在每个请求前后初始化和关闭 HystrixRequestContext 来解决该问题：

```java
@Component
@WebFilter(urlPatterns = "/*", asyncSupported = true)
public class HystrixRequestContextFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        try (HystrixRequestContext ignored = HystrixRequestContext.initializeContext()) {
            filterChain.doFilter(servletRequest, servletResponse);
        }
    }

    @Override
    public void destroy() {

    }
}
```

:::

