---
title: 负载均衡策略
sidebar: auto
date: 2021-07-05
categories:
 - 微服务
tags:
 - SpringCloud
---

> 所谓的负载均衡策略，就是当 A 服务调用 B 服务时，此时 B 服务存在多个实例，这时 A 服务以何种方式选择调用 B 服务的实例，Ribbon 可以选择一下几种负载均衡策略。

* `com.netflix.loadbalancer.RandomRule`：从服务实例中随机选取一个进行访问；
* `com.netflix.loadbalancer.RoundRobinRule`：以线性轮询的方式，就是维护一个计数器，从提供服务的实例中按顺序选取，第一次选第一个，第二次选第二个，以此类推，到最后一个以后再从头来过，也就是反复的顺序选取所有的实例；
* `com.netflix.loadbalancer.RetryRule`：在 RoundRobinRule 的基础上添加重试机制，即在指定的重试时间内，反复使用线性轮询策略来选择可用实例；
* `com.netflix.loadbalancer.WeightedResponseTimeRule`：对 RoundRobinRule 的扩展，响应速度越快的实例选择权重越大，越容易被选择；
* `com.netflix.loadbalancer.BestAvailableRule`：选择并发较小的实例；
* `com.netflix.loadbalancer.AvailabilityFilteringRule`：先过滤掉故障实例，再选择并发较小的实例；
* `com.netflix.loadbalancer.ZoneAwareLoadBalancer`：采用双重过滤，同时过滤不是同一区域的实例和故障实例，选择并发较小的实例。

## 自定义负载均衡

### MyRibbonRule

在 `microservice-consumer` 的 `config` 目录下创建 `MyRibbonRule.class`。

``` java

/**
 * 使用轮询方式顺序访问服务实例，每个服务实例，连续访问 total 次之后，切换下一个服务实例
 **/
public class MyRibbonRule extends AbstractLoadBalancerRule {

    // 总共被调用的次数，目前要求每台被调用5次
    private int total = 0;
    // 当前提供服务的机器号
    private int currentIndex = 0;

    public Server choose(ILoadBalancer lb, Object key) {
        if (lb == null) {
            return null;
        }
        Server server = null;
        while (server == null) {
            if (Thread.interrupted()) {
                return null;
            }
            // 获取已启动且可访问的服务实例
            List<Server> upList = lb.getReachableServers();
            // 获取所有服务实例
            List<Server> allList = lb.getAllServers();
            int serverCount = allList.size();
            // 没有服务实例存在时
            if (serverCount == 0) {
                return null;
            }
            // 每个服务实例访问 5 次之后，切换到下一个服务实例
            if (total < 5) {
                server = upList.get(currentIndex);
                total++;
            } else {
                total = 0;
                currentIndex++;
                if (currentIndex >= upList.size()) {
                    currentIndex = 0;
                }
            }
            // 服务实例不存在
            if (server == null) {
                // 当前线程放弃 CPU 调度，由执行状态转到就绪状态，重新争夺 CPU 资源执行
                Thread.yield();
                continue;
            }
            // 服务实例可用
            if (server.isAlive()) {
                return (server);
            }
            // 服务实例存在，但不可用，需要重新进行获取
            server = null;
            Thread.yield();
        }
        return server;
    }

    @Override
    public void initWithNiwsConfig(IClientConfig iClientConfig) {

    }

    @Override
    public Server choose(Object key) {
        return this.choose(getLoadBalancer(), key);
    }
}
```

### Applicationc

``` java
@SpringBootApplication
@EnableEurekaClient
@RibbonClients({
        // name：服务名
        // configuration：ILoadBalancer, ServerListFilter, IRule
        @RibbonClient(name = "DEPT-SERVER-PROVIDER", configuration = MyRibbonRule.class)
})
public class ConsumerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConsumerApplication.class, args);
    }
}

```

::: warning
这里没有直接在在类上添加 `@Configuration` 注解，如果使用了该注解，就会导致当前模块下，所有的服务都会使用该负载均衡策略，不能做到每个服务一个策略的目的，但如果你当前模块下所有的服务都使用同一个负载均衡策略，你完全可以直接使用 `@Bean` 的方式去注入。

在启动类上使用 `@RibbonClients` 与 `@RibbonClient` 配置服务的负载均衡策略，每一个 `@RibbonClient` 表示一个服务。在 `@RibbonClient` 里面 `name` 绑定服务名称，`configuration` 属性是一个 `Class<?>数组`，该数组接受类型 ILoadBalancer、 ServerListFilter、 IRule。

:::
