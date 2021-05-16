# Ribbon 负载均衡

Spring Cloud Ribbon 是基于 Netflix Ribbon 实现的一套`客户端的负载均衡`工具。简单的说，Ribbon 是 Netflix 发布的开源项目，主要功能是提供客户端的软件负载均衡算法，将 Netflix 的中间层服务连接在一起。Ribbon 客户端组件提供一系列完善的配置项，如连接超时、重试等等。简单的说，就是在配置文件中列出 Load Balancer（简称 LB）后面所有的机器，Ribbon 会自动帮助你基于某种规则（如简单轮询、随机连接等）去连接这些机器。我们也很容易使用 Ribbon 实现自定义的负载均衡算法。

::: tip
负载均衡（Load Balancer）:

1. 集中式负载均衡：即在消费者与服务提供者之间使用独立的负载均衡设施（如：F5硬件，或nginx软件等），由该设施负责把请求通过某种策略转发至服务提供者。

2. 进程内负载均衡：即将负载均衡集成到消费者这边，消费者从服务注册中心获知哪些服务可用，然后自己再从这些地址中选择一个合适的服务提供者进行服务消费。Ribbon 就是属于进程内负载均衡，它只是一个类库，集成到消费者进程中，消费者通过它来获取想要的服务提供者。

:::

> 官网资料：<a href="https://github.com/Netflix/ribbon/wiki/Getting-Started">https://github.com/Netflix/ribbon/wiki/Getting-Started</a>