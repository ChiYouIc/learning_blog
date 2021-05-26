# Feign 声明式服务调用

## Feign 介绍

Feign 是声明式的服务调用工具，我们只需要创建一个接口并用注解方式来配置它，就可以实现对某个服务接口的调用，简化了直接使用 `RestTemplate` 来调用接口的开发量。Feign 具备可插拔的注解支持，同时支持 Feign注解、JAX-RS注解以及 Spring MVC 注解。当使用 Feign 时，Spring Cloud 集成了 Ribbon 和 Eureka 以提供负载均衡的服务调用以及基于 Hystrix 的服务容错保护功能。

## 搭建服务

创建模块`microservice-consumer-feign`（这里使用的是基于前面介绍 Eureka、Ribbon 的项目，直接复用里面的 Eureka集群和部门服务提供者模块）。

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

<!-- feign -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-feign</artifactId>
</dependency>

<dependency>
    <groupId>com.ic.learning</groupId>
    <artifactId>microservice-common-api</artifactId>
</dependency>
```
### application.yml

``` yml
server:
  port: 8080

spring:
  application:
    name: consumer-feign-service

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

### ConsumerFeignApplication

在启动类上添加@EnableFeignClients注解来启用Feign的客户端功能

``` java
@EnableFeignClients     // 声明该服务为 Feign 客户端
@EnableDiscoveryClient // 开启服务发现
@SpringBootApplication
public class ConsumerFeignApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerFeignApplication.class, args);
    }
}
```

### DeptController

``` java
@RestController
@RequestMapping("/consumer/dept")
public class DeptController {

    @Autowired
    private IDeptService deptService;

    @GetMapping("/list")
    public List<Dept> list() {
       return deptService.list();
    }
}
```

### IDeptService

::: tip
我们通过@FeignClient注解实现了一个Feign客户端，其中的value为 `DEPT-SERVER-PROVIDER` 表示这是对 `DEPT-SERVER-PROVIDER` 服务的接口调用客户端。我们可以回想下`DEPT-SERVER-PROVIDER`中的 `DeptController`，只需将其改为接口，保留原来的 SpringMvc 注释即可。
:::

``` java
@FeignClient(value = "DEPT-SERVER-PROVIDER")
public interface IDeptService {

    @GetMapping("/dept/list")
    List<Dept> list();

}
```

## 启动服务

分别启动我们的 Eureka 集群服务、服务提供者和本模块 `microservice-consumer-feign`，访问 <a href="http://eurekaClusterServer01.com:8011">http://eurekaClusterServer01.com:8011</a> 查看服务是否注册完毕，然后调用接口 <a href="http:\\localhost:8080\consumer\dept\list">http:\\localhost:8080\consumer\dept\list</a> 测试，效果与使用 Ribbon 一样。

## 总结

Feign通过接口的方法调用 Rest 服务（之前是 `Ribbon + RestTemplate`），
通过 Feign 直接找到服务接口，由于在进行服务调用的时候融合了 Ribbon 技术，所以也支持负载均衡作用，并且也可以自定义负载均衡策略，配置与单独使用 Ribbon 时一样。