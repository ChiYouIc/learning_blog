---
title: 路由映射
sidebar: auto
date: 2021-07-20
categories:
 - 微服务
tags:
 - SpringCloud
---

## application.yml

修改配置文件，添加 zuul 配置，配置服务提供者的路由映射规则。

```yaml
# Zuul 配置
zuul:
  routes:
    dept-server-provider: # 服务名称
      path: /dept/**                      # 自定义路由映射，不再通过服务名称去映射具体服务
  ignored-services: dept-server-provider  # 隐藏真是的服务名称
  prefix: /microservice                   # 统一的URI前缀
  sensitive-headers: Cookie,Set-Cookie,Authorization     #配置过滤敏感的请求头信息，设置为空就不会过滤
  add-host-header: true                   #设置为 true 重定向是会添加host请求头
  retryable: true # 关闭重试机制
  PreLogFilter:
    pre:
      disable: false #控制是否启用过滤器
```

::: tip

* `routes` 配置的是服务的路由映射，`dept-server-provider` 表示的服务实例名称，`path` 服务路由映射，这两个是成对出现的； 上述配置后的效果就是可以直接通过访问`http:\\localhost:9527\dept\dept\list\` 访问服务提供者。

* `ignored-services` 配置项是一个数组，如果需要忽略多个服务名称时，可以直接使用 `*` 代替。 当我们不配置该项时，即便我们单独配置了服务的路由映射，还是可以用 `http://localhost:9527/dept-server-provider/dept/list` 访问。

* `prefix` 配置的是所有服务的访问路径前缀，默认是缺省的，如果配置之后，在访问服务时，就需要添加对应的前缀。上述配置效果就是通过 `http:\\localhost:9527\microservice\dept\dept\list\` 访问服务提供者。

* `sensitive-headers` 配置过滤敏感的请求头信息，默认值 `Cookie`、`Set-Cookie`、`Authorization`；当客户端发送的请求中携带了配置的请求头信息(`Cookie`、`Set-Cookie`、`Authorization`)， 这些请求投是不会发送给下游服务的。

* `add-host-header` 配置传递原始 host 请求头信息； 当我们的下游服务限制了 request 的 host 请求头信息和服务器一致时，该配置应该设置 false 值，也就是不需要传递原始 host，而是当前 zuul 代理服务的 host 请求头；这其实是一个安全性策略，避免有人跳过 zuul 代理，直接访问下游服务。
  :::

## 启动项目

添加了上述的配置之后，再次启动项目，访问 <a href='http://localhost:9527/microservice/dept/dept/list/'>http://localhost:9527/microservice/dept/dept/list/</a>,如下：

<img :src="$withBase('/img/microservice/zuul/路由映射.png')" alt="路由映射" />
