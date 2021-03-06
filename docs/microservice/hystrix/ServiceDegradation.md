---
title: 服务降级
sidebar: auto
date: 2021-07-22
categories:
 - 微服务
tags:
 - SpringCloud
---

## 创建项目

直接修改 `microservice-consumer-hystrix` 模块

### pom.xml

在 pom.xml 中添加 Feign 依赖

``` xml
<!-- feign -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-feign</artifactId>
</dependency>
```

### 创建对应的 fallback 对象

这里不再使用 Hystrix 的 `@HystrixCommand` 注解的方式去配置服务降级处理，而是直接将 Feign 与 Hystrix 整合在一起，直接使用 `@FeignClent` 注解中的 `fallback` 属性或 `fallbackFactory` 去配置。

#### 修改 IDeptService

``` java
@FeignClient(name = "DEPT-SERVER-PROVIDER", fallbackFactory = MyFallbackFactory.class)
//@FeignClient(name = "DEPT-SERVER-PROVIDER", fallback = DeptFallbackService.class)
public interface IDeptService {

    @GetMapping("/dept/list")
    List<Dept> list();

    @GetMapping("/dept/{id}")
    Dept getById(@PathVariable("id") String id);

    @GetMapping("/dept/exception/{id}")
    Dept getDeptException(@PathVariable("id") String id);
}
```

#### 创建服务降级处理对象

如果我们使用的 fallback 属性配置，也就是 `@FeignClient(name = "DEPT-SERVER-PROVIDER", fallback = DeptFallbackService.class)`，可以如下配置：

``` java
@Component // 这个注解必须有，fallback 对应的处理实例，依赖 spring 的对象管理
public class DeptFallbackService implements IDeptService {
    @Override
    public List<Dept> list() {
        List<Dept> list = new ArrayList<>();
        list.add(new Dept().setDname("人事部").setDeptno("123456").setDbSource("NoDbSource"));
        return list;
    }

    @Override
    public Dept getById(String id) {
        return new Dept().setDname("人事部").setDeptno("123456").setDbSource("NoDbSource");
    }

    @Override
    public Dept getDeptException(String id) {
        return new Dept().setDname("人事部").setDeptno("123456").setDbSource("NoDbSource");
    }
}
```

如果需要更加灵活的处理，可以使用 fallbackFactory，这需要我们去创建一个`FallbackFactory` 接口的实现类，如下：

``` java
@Slf4j
@Component
public class MyFallbackFactory implements FallbackFactory<IDeptService> {
    @Override
    public IDeptService create(Throwable throwable) {
        log.error(throwable.toString());
        return new DeptFallbackService();
    }
}
```

重写 `public T create(Throwable throwable)`方法，并返回一个服务接口（IDeptService）的实现类。注意这里 throwable 参数就是服务调用发生的异常，可以在这里捕获到，并进行处理。

### 启动类

``` java
@EnableDiscoveryClient  // 开启服务发现
@SpringBootApplication
@EnableFeignClients(basePackages = {"com.ic.learning"})     // 开启 Feign 客户端
public class ConsumerHystrixApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerHystrixApplication.class, args);
    }
}
```

### application.yml

feign 默认是关闭 hystrix 的，需要手动开启

``` yml
# feign 配置
feign:
  hystrix:
    enabled: true
```

## 启动服务

分别启动我们的 Eureka 集群服务、服务提供者和本模块 `microservice-consumer-hystrix`，访问 <a href="http://eurekaClusterServer01.com:8011">http://eurekaClusterServer01.com:8011</a> 查看服务是否注册完毕，然后调用接口 <a href="http:\\localhost:8080\consumer\dept\list">http:\\localhost:8080\consumer\dept\list</a> 测试，结果如下：

<img :src="$withBase('/img/microservice/hystrix/服务正常.png')" alt="服务正常">

当我们将服务提供者关闭时（模拟下游服务异常），再访问：

<img :src="$withBase('/img/microservice/hystrix/关闭下游服务.png')" alt="关闭下游服务">

<img :src="$withBase('/img/microservice/hystrix/服务熔断.png')" alt="服务熔断">
