# Eureka 服务搭建

## 搭建项目

创建一个父工程`microservie-learning`，以及两个子工程`microservice-netflix-eureka-server`和`microservice-netflix-eureka-client`，这两个子工程分别对应的是 Eureka Server 和 Eureka Client。

<img :src="$withBase('/img/microservice/eureka/创建工程.png')" alt="创建工程">

## 添加依赖

### microservie-learning（父工程）

``` xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <!-- Spring Cloud 依赖 -->
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <!-- 注意这里使用的版本 -->
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
    </dependencies>
</dependencyManagement>
```

### microservice-netflix-eureka-server（Eureka Server）
``` xml
<dependencies>
    <!-- Eureka Server -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-eureka-server</artifactId>
    </dependency>
</dependencies>
```

### microservice-netflix-eureka-client（Eureka Client）
``` xml
<dependencies>
    <!-- Eureka Client -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-eureka</artifactId>
    </dependency>
</dependencies>
```

## Eureka Server 配置

### 启动类
``` java
@SpringBootApplication
@EnableEurekaServer // 表示该服务为 Eureka Server
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}

```

### yml 配置
``` yml
server:
  port: 8001

spring:
  application:
    # 配置服务名称
    name: eureka-server

# Eureka 配置
eureka:
  # Eureka Server 实例配置
  instance:
    hostname: localhost
  client:
    # 是否从注册表中获取服务（作为注册中心不需要开启）
    fetch-registry: false
    # 是否向 Eureka 注册（作为服务中心不要开启）
    register-with-eureka: false
  server:
    # Eureka 自我保护机制（默认开启）
    enable-self-preservation: true
    # 开启自我保护模式比例阈值，当收到心跳包占期望收到心跳包数量低于这个值，进入自我保护模式（默认 0.85）。
    renewal-percent-threshold: 0.85
```

## Eureka Client 配置

### 启动类

``` java
@SpringBootApplication
@EnableEurekaClient // 标识该服务为 Eureka Client
@EnableDiscoveryClient // 开启服务发现
public class EurekaClientApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaClientApplication.class, args);
    }
}
```

### yml 配置

``` yml
server:
  port: 8080

spring:
  application:
    # 配置服务名称（作为 Eureka Client 向 Eureka Server 注册时的服务名）
    name: eureka-client

eureka:
  instance:
    # 向 Eureka Server 注册时的实例名称
    instance-id: eureka-client
    # 访问路径直接显示 Eureka Client 的服务 IP
    prefer-ip-address: true
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      ## 配置 Eureka Server 的服务注册地址
      defaultZone: http://localhost:8001/eureka/
```

## 启动服务

访问`http://localhost:8001`，进入 Eureka Server

<img :src="$withBase('/img/microservice/eureka/Eureka Server主页面.png')" alt="Eureka Server主页面">

整个服务的配置与启动工作就完成了，下面将演示如果获取服务的注册表信息。

## 获取服务注册表

从整个工程中,`microservice-netflix-eureka-client`其实就是一个服务的提供者（这里并没有去创建服务的消费者，服务的消费者在往后面的`Open Feign`介绍中再整合进来）；下面通过再 Eureka Client 下编写一个接口来获取服务注册表（这完全是为了演示方便）。

### EurekaRegistryController

通过`DiscoveryClient`这个接口可以获取当前服务的`描述`、`实例信息`、`所有服务实例`、`所有服务名称`。

```  java
@RestController
@RequestMapping("/eureka/client")
public class EurekaRegistryController {

    @Resource
    private DiscoveryClient discoveryClient;

    @Resource
    private Registration registration;

    /**
     * 获取服务注册表信息
     */
    @GetMapping("/registry")
    public Map<String, Object> getEurekaRegistry() {
        // 服务描述
        String description = discoveryClient.description();
        // 当前服务实例
        ServiceInstance localServiceInstance = discoveryClient.getLocalServiceInstance();  // 该方法已被抛弃
        // 当前服务实例ID
        String serviceId = registration.getServiceId();
        // 获取服务列表
        List<String> services = discoveryClient.getServices();
        // 获取服务实例
        List<ServiceInstance> instances = discoveryClient.getInstances("eureka-client");
        Map<String, Object> map = new HashMap<>();
        map.put("description", description);
        map.put("localServiceInstance", localServiceInstance);
        map.put("serviceId", serviceId);
        map.put("services", services);
        map.put("instances", instances);
        return map;
    }
}
```

### DiscoveryClient

`DiscoveryClient`可以获取服务注册表信息。

``` java
package org.springframework.cloud.client.discovery;

import java.util.List;

import org.springframework.cloud.client.ServiceInstance;

/**
 * DiscoveryClient represents read operations commonly available to Discovery service such as
 * Netflix Eureka or consul.io
 * @author Spencer Gibb
 */
public interface DiscoveryClient {

    /**
     * A human readable description of the implementation, used in HealthIndicator
     * 服务的描述，主要用于健康指示器
     * @return the description
     */
    String description();

    /**
     * @deprecated use the {@link org.springframework.cloud.client.serviceregistry.Registration} bean instead
     * 获取当前服务的服务实例（已被抛弃）
     * @return ServiceInstance with information used to register the local service 
     */
    @Deprecated
    ServiceInstance getLocalServiceInstance();

    /**
     * Get all ServiceInstances associated with a particular serviceId
     * 获取与 serviceId 关联的所有服务实例
     * @param serviceId the serviceId to query
     * @return a List of ServiceInstance
     */
    List<ServiceInstance> getInstances(String serviceId);

    /**
     * 获取所有已知服务实例ID
     * @return all known service ids
     */
    List<String> getServices();

}
```

### 调用接口
``` json
{
    // 当前服务实例
    "localServiceInstance": {
        "host": "192.168.31.216",
        "port": 8080,
        "serviceId": "eureka-client",
        "uri": "http://192.168.31.216:8080",
        "metadata": {},
        "secure": false
    },
    // 所有实例
    "instances": [
        {
            "host": "192.168.31.216",                                   // IP
            "port": 8080,                                               // 端口
            "serviceId": "EUREKA-CLIENT",                               // 服务实例
            "uri": "http://192.168.31.216:8080",                        // 访问路径
            "metadata": {},                                             // 元数据
            "secure": false,                                            
            "instanceInfo": {                                           // 实例信息
                "instanceId": "eureka-client",
                "app": "EUREKA-CLIENT",
                "appGroupName": null,
                "ipAddr": "192.168.31.216",
                "sid": "na",
                "homePageUrl": "http://192.168.31.216:8080/",
                "statusPageUrl": "http://192.168.31.216:8080/info",
                "healthCheckUrl": "http://192.168.31.216:8080/health",
                "secureHealthCheckUrl": null,
                "vipAddress": "eureka-client",
                "secureVipAddress": "eureka-client",
                "countryId": 1,
                "dataCenterInfo": {
                    "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
                    "name": "MyOwn"
                },
                "hostName": "192.168.31.216",
                "status": "UP",                                         // 服务状态（UP表示存活，DOWN表示下线）
                "leaseInfo": {
                    "renewalIntervalInSecs": 30,
                    "durationInSecs": 90,
                    "registrationTimestamp": 1619189378176,
                    "lastRenewalTimestamp": 1619190728592,
                    "evictionTimestamp": 0,
                    "serviceUpTimestamp": 1619189378176
                },
                "isCoordinatingDiscoveryServer": false,
                "metadata": {},
                "lastUpdatedTimestamp": 1619189378176,
                "lastDirtyTimestamp": 1619189378126,
                "actionType": "ADDED",
                "asgName": null,
                "overriddenStatus": "UNKNOWN"
            }
        }
    ],
    // 服务的描述
    "description": "Spring Cloud Eureka Discovery Client",
    // 所有服务实例
    "services": [
        "eureka-client"
    ],
    // 当前服务实例ID
    "serviceId": "eureka-client" 
}
```

Eureka 的单机服务搭建就结束了，下一章节会介绍 Eureka 集群以及搭建方式。