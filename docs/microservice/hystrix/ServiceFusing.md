---
title: 服务熔断
sidebar: auto
date: 2021-07-21
categories:
 - 微服务
tags:
 - SpringCloud
---

## 创建项目

创建模块`microservice-consumer-hystrix`（这里使用的是基于前面介绍 Eureka、Ribbon 的项目，直接复用里面的 Eureka集群和部门服务提供者模块）。

### pom.xml

``` xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Eureka -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-eureka</artifactId>
</dependency>

<!-- hystrix -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-hystrix</artifactId>
</dependency>

<dependency>
    <groupId>com.ic.learning</groupId>
    <artifactId>microservice-common-api</artifactId>
</dependency>
</dependencies>
```

### application.yml

``` yml
server:
  port: 8080

spring:
  application:
    name: consumer-hystrix-service

# 服务配置
service-url:
  dept-service: http://DEPT-SERVER-PROVIDER

# hystrix
hystrix:
  metrics:
    enabled: true

# Eureka 配置
eureka:
  client:
    register-with-eureka: false   # 不向 Eureka Server 注册自己
    service-url:
      defaultZone: http://eurekaClusterServer01.com:8011/eureka/,http://eurekaClusterServer02.com:8012/eureka/,http://eurekaClusterServer03.com:8013/eureka/

# 配置日志打印
logging:
  level:
    com.ic.learning.service.IDeptService: debug


```

### ConsumerHystrixApplication

在启动类上添加 `@EnableCircuitBreaker` 来开启 Hystrix 的断路器功能

``` java
@EnableCircuitBreaker   // 开启 Hystrix 断路器
@EnableDiscoveryClient  // 开启服务发现
@SpringBootApplication
public class ConsumerHystrixApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerHystrixApplication.class, args);
    }
}
```

### AutoConfig

``` java
@Configuration
public class AutoConfig {
    @Bean
    @LoadBalanced // Spring Cloud Ribbon 是基于 Netflix Ribbon 实现的一套客户端负载均衡工具
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

### DeptController

``` java
@RestController
@RequestMapping("/consumer/dept")
public class DeptController {

    @Resource
    private IDeptService deptService;

    @GetMapping("/list")
    public List<Dept> list() {
       return deptService.list();
    }
}
```

### IDeptService

``` java
public interface IDeptService {
    List<Dept> list();
}
```

### DeptServiceImpl

在服务调用方法上使用注解 `@HystrixCommand` 来声明该服务接口熔断处理方式，其中 `fallbackMethod` 的值表示服务熔断时调用的方法名。当服务调用失败时，就会调用 `fallbackMethod` 指定的方法代替接口处理请求内容。

``` java
@Service
public class DeptServiceImpl implements IDeptService {

    @Resource
    private RestTemplate restTemplate;

    @Value("${service-url.dept-service}")
    private String REST_URL_PREFIX;

    @Override
    @HystrixCommand(fallbackMethod = "defaultList") // fallbackMethod 服务降级方法声明
    public List<Dept> list() {
        List<Dept> list = restTemplate.getForObject(REST_URL_PREFIX.concat("/dept/list"), ArrayList.class);
        return list;
    }

    /** 服务降级处理方法 */
    public List<Dept> defaultList() {
        List<Dept> list = new ArrayList<>();
        list.add(new Dept().setDname("人事部").setDeptno("123456").setDbSource("NoDbSource"));
        return list;
    }
}
```

## 启动服务

分别启动我们的 Eureka 集群服务、服务提供者和本模块 `microservice-consumer-hystrix`，访问 <a href="http://eurekaClusterServer01.com:8011">http://eurekaClusterServer01.com:8011</a>
查看服务是否注册完毕，然后调用接口 <a href="http:\\localhost:8080\consumer\dept\list">http:\\localhost:8080\consumer\dept\list</a> 测试，结果如下：

<img :src="$withBase('/img/microservice/hystrix/服务正常.png')" alt="服务正常">

然后关闭服务提供者 `microservice-provider-*`，再次调用接口，会发现服务被降级，运行了 `defaultService`方法，如下：

<img :src="$withBase('/img/microservice/hystrix/服务熔断.png')" alt="服务熔断">

## @HystrixCommand详解

> @HystrixCommand中的常用参数
>
> * fallbackMethod：指定服务降级处理方法；
> * ignoreExceptions：忽略某些异常，不发生服务降级；
> * commandKey：命令名称，用于区分不同的命令；
> * groupKey：分组名称，Hystrix 会根据不同的分组来统计命令的告警及仪表盘信息；
> * threadPoolKey：线程池名称，用于划分线程池。

### 设置命令、分组及线程池名称

#### 在 DeptController 中添加 `getById` 方法

``` java
@GetMapping("/{id}")
public Dept getById(@PathVariable String id) {
    return deptService.getById(id);
}
```

#### 在 IDeptService 中声明方法，并实现

``` java
Dept getById(String id);
```

``` java
@Override
@HystrixCommand(
        fallbackMethod = "defaultGetById",  // 服务熔断处理方法
        commandKey = "getDeptCommand",      // 命令名称
        groupKey = "getDeptGroup",          // 分组名称
        threadPoolKey = "getDeptThreadPoll" // 线程池名称
)
public Dept getById(String id) {
    return restTemplate.getForObject(REST_URL_PREFIX.concat("/dept/{1}"), Dept.class, id);
}
```

### ignoreExceptions忽略某些异常降级

#### 在 DeptController 中添加 `getDeptException` 方法

``` java
@GetMapping("/exception/{id}")
public Dept getDeptException(@PathVariable String id){
    return deptService.getDeptException(id);
}
```

#### 在 IDeptService 接口中声明，并实现

``` java
Dept getDeptException(String id);
```

``` java
@Override
@HystrixCommand(
        fallbackMethod = "defaultGetDeptException",
        // 忽略异常,这里的忽略异常的意思是，当该方法抛出了 ignoreExceptions 中声明的异常，那么该服务不会被熔断，也就是不执行 fallback 声明的方法
        ignoreExceptions = {NullPointerException.class} 
)
public Dept getDeptException(String id) {
    if ("1000".equals(id)) {
        throw new IndexOutOfBoundsException("id index out of bound...");
    }

    Dept dept = restTemplate.getForObject(REST_URL_PREFIX.concat("/dept/{1}"), Dept.class, id);

    if (dept == null) {
        throw new NullPointerException("result is null...");
    }

    return dept;
}
```

``` java
public Dept defaultGetDeptException(String id, Throwable e) {
    if (e != null) {
        e.printStackTrace();
    }
    return new Dept().setDname("人事部").setDeptno("123456").setDbSource("NoDbSource");
```

当我们访问 <a href="http:\\localhost:8080\consumer\dept\exception\1000">http:\\localhost:8080\consumer\dept\exception\1000</a> 时，服务会被熔断，如下：

<img :src="$withBase('/img/microservice/hystrix/异常忽略-1.png')" alt="异常忽略-1">

当我们访问 <a href="http:\\localhost:8080\consumer\dept\exception\100">http:\\localhost:8080\consumer\dept\exception\100</a> 时，服务不会被熔断，接口会将异常抛出，如下：

<img :src="$withBase('/img/microservice/hystrix/异常忽略-2.png')" alt="异常忽略-2">
