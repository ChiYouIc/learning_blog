---
title: 负载均衡服务调用
sidebar: auto
date: 2021-07-06
categories:
 - 微服务
tags:
 - SpringCloud
---

## 搭建项目

这里创建了三个 Eureka Service 作为服务集群，分别是`microservice-netflix-eureka-cluster-server-01`、`microservice-netflix-eureka-cluster-server-02`、`microservice-netflix-eureka-cluster-server-03`；

三个服务提供者，分别是`microservice-provider-01`、`microservice-provider-02`、`microservice-provider-03`；

一个服务消费者`microservice-consumer`；

一个公共API模块`microservice-common-api`。

<img :src="$withBase('/img/microservice/ribbon/服务搭建.png')" alt="服务搭建">

## 添加依赖

### microservie-learning（父工程）

``` xml
<properties>
    <maven.compiler.source>8</maven.compiler.source>
    <maven.compiler.target>8</maven.compiler.target>
    <mysql.version>8.0.20</mysql.version>
    <druid.version>1.1.23</druid.version>
    <mybatisPlus.version>3.4.2</mybatisPlus.version>
    <lombok.version>1.16.18</lombok.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
</dependencies>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.ic.learning</groupId>
            <artifactId>microservice-common-api</artifactId>
            <version>${version}</version>
        </dependency>
        <dependency>
            <!-- Spring Cloud 依赖 -->
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>Dalston.SR1</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <!-- Spring Boot 依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>1.5.9.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <!-- mysql 连接 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>${mysql.version}</version>
        </dependency>
        <!-- 数据库连接池 -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>${druid.version}</version>
        </dependency>
        <!-- mybatis plus -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>${mybatisPlus.version}</version>
        </dependency>
        <!-- lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### microservice-provider-\*

``` xml
<dependencies>
    <!-- Eureka Server -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-eureka</artifactId>
    </dependency>

    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>

    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid</artifactId>
    </dependency>

    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-boot-starter</artifactId>
    </dependency>

    <dependency>
        <groupId>com.ic.learning</groupId>
        <artifactId>microservice-common-api</artifactId>
    </dependency>
</dependencies>
```

### microservice-consumer

``` xml 
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Eureka -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-eureka</artifactId>
    </dependency>

    <!-- Ribbon相关 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-ribbon</artifactId>
    </dependency>

    <dependency>
        <groupId>com.ic.learning</groupId>
        <artifactId>microservice-common-api</artifactId>
    </dependency>
</dependencies>
```

### microservice-common-api

``` xml
<dependencies>
    <dependency>
        <groupId>com.baomidou</groupId>
        <artifactId>mybatis-plus-annotation</artifactId>
    </dependency>
</dependencies>
```

### 数据库脚本

``` sql
create schema cloudDB01 collate utf8_general_ci;
create schema cloudDB02 collate utf8_general_ci;
create schema cloudDB03 collate utf8_general_ci;

use cloudDB01;
CREATE TABLE dept
(
  deptno BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  dname VARCHAR(60),
  db_source   VARCHAR(60)
);
INSERT INTO dept(dname,db_source) VALUES('开发部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('人事部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('财务部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('市场部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('运维部',DATABASE());

use  cloudDB02;
CREATE TABLE dept
(
  deptno BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  dname VARCHAR(60),
  db_source   VARCHAR(60)
);
INSERT INTO dept(dname,db_source) VALUES('开发部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('人事部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('财务部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('市场部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('运维部',DATABASE());

use  cloudDB03;
CREATE TABLE dept
(
  deptno BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  dname VARCHAR(60),
  db_source   VARCHAR(60)
);
INSERT INTO dept(dname,db_source) VALUES('开发部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('人事部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('财务部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('市场部',DATABASE());
INSERT INTO dept(dname,db_source) VALUES('运维部',DATABASE());
```
::: tip
引入数据库操作的原因是为了更直观的去演示 Ribbon 负载均衡算法，就是Ribbon会基于某种规则去连接服务（简单轮询、随机连接等等），以及后面我们自定义负载均衡算法。
:::

## Eureka Server 集群配置

Eureka Server 集群配置可参考，历史笔记<a href="/learning_blog/microservice/eureka/Eureka%20集群搭建.html">Eureka 集群搭建</a>，这里不再阐述。

## 服务提供者（Service Provider）配置

该案例中我们创建了三个服务提供者注册到 Eureka Server 中，这三个模块的配置都是一样，这里只演示其中一个的配置。

### 启动类

``` java
@SpringBootApplication
@EnableEurekaClient // 标识该服务为 Eureka Client
@EnableDiscoveryClient // 开启服务发现
public class ProviderApplication01 {
    public static void main(String[] args) {
        SpringApplication.run(ProviderApplication01.class, args);
    }
}
```

### Controller

``` java
@RestController
@RequestMapping("/dept")
public class DeptController {

    @Autowired
    private IDeptService deptService;

    @GetMapping("/list")
    public List<Dept> list() {
        return deptService.list();
    }

}
```

### Service

``` java
public interface IDeptService extends IService<Dept> {
}

@Service
public class DeptServiceImpl extends ServiceImpl<DeptMapper, Dept> implements IDeptService {
}

```

### Mapper

``` java
@Mapper
@Repository
public interface DeptMapper extends BaseMapper<Dept> {
}

```

### yml 配置

``` yml
server:
  port: 8081

spring:
  application:
    # 配置服务名称（作为 Eureka Client 向 Eureka Server 注册时的服务名）
    name: dept-server-provider
  datasource:
    type: com.mysql.cj.jdbc.MysqlConnectionPoolDataSource     # 当前数据源操作类型
    driver-class-name: com.mysql.cj.jdbc.Driver               # mysql驱动包
    url: jdbc:mysql://localhost:3306/cloudDB01                # 数据库名称
    username: root
    password: 123456
    dbcp2:
      min-idle: 5                                           # 数据库连接池的最小维持连接数
      initial-size: 5                                       # 初始化连接数
      max-total: 5                                          # 最大连接数
      max-wait-millis: 200

mybatis:
  config-location: classpath:mybatis/mybatis.cfg.xml
  type-aliases-package: com.ic.learning.entity
  mapper-locations:
    - classpath:mybatis/mapper/**/*.xml


eureka:
  instance:
    # 向 Eureka Server 注册时的实例名称
    instance-id: provider-01
    # 访问路径直接显示 Eureka Client 的服务 IP
    prefer-ip-address: true
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      # 集群配置方式
      defaultZone: http://eurekaClusterServer01.com:8011/eureka/,http://eurekaClusterServer02.com:8012/eureka/,http://eurekaClusterServer03.com:8013/eureka/
```

::: warning
服务提供者中，引入了`mybatis-plus`，目的就是为了整合数据库，方便演示（不引入也可，直接在 controller 中把返回结果写死）。
:::

## 服务消费者（Service Customer）配置

### 启动类
``` java
@SpringBootApplication
@EnableEurekaClient
public class ConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class, args);
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

### Controller

``` java
@RestController
@RequestMapping("/dept")
public class DeptController {
    @Resource
    private RestTemplate restTemplate;

    @Value("${service-url.dept-service}")
    private String REST_URL_PREFIX;

    @GetMapping("/list")
    public List list() {
        return restTemplate.getForObject(REST_URL_PREFIX.concat("/dept/list"), List.class);
    }
}
```

### yml 配置

``` yml
server:
  port: 8080

# 服务配置
service-url:
  dept-service: http://DEPT-SERVER-PROVIDER

# Ribbon 配置
ribbon:
  eager-load:
    clients: dept-service-provider    # 指定需要饥饿加载的服务名
    enabled: true                     # 开启Ribbon的饥饿加载模式

# Eureka 配置
eureka:
  client:
    register-with-eureka: false   # 不向 Eureka Server 注册自己
    service-url:
      defaultZone: http://eurekaClusterServer01.com:8011/eureka/,http://eurekaClusterServer02.com:8012/eureka/,http://eurekaClusterServer03.com:8013/eureka/
```

## 公共 API

### Entity

``` java
@Data
@TableName("dept")
@Accessors(chain = true)
public class Dept {

    @TableField("deptno")
    private String deptno;

    @TableField("dname")
    private String dname;

    @TableField("db_source")
    private String dbSource;
}
```

## 启动服务

启动所有的服务，先访问 Eureka Server，<a href="http://eurekaClusterServer01.com:8011">http://eurekaClusterServer01.com:8011</a>

<img :src="$withBase('/img/microservice/ribbon/Eureka Server 访问.png')" alt="Eureka Server 访问">

### 调用接口

使用 Postman 调用接口测试`http:\\localhost:8080\dept\list`，注意这个接口是服务消费者的接口，不是服务提供者的。

<img :src="$withBase('/img/microservice/ribbon/调用消费者接口.png')" alt="调用消费者接口">

::: tip
在尝试反复调用接口时会发现，每次的返回数据中 `dbSource` 的值不一样，这就是 Ribbon 的负载均衡策略，基于某种选择策略选择服务提供者，在下一章节中，会介绍 Ribbon 提供的默认负载均衡策略，以及如何自定义负载均衡策略。
:::

