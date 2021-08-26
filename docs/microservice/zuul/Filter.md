---
title: 过滤器
sidebar: auto
date: 2021-07-23
categories:
 - 微服务
tags:
 - SpringCloud
---

路由与过滤是 Zuul 的两大核心功能，路由功能负责将外部请求转发到具体的服务实例上去，是实现统一访问入口的基础，过滤功能负责对请求过程进行额外的处理，是请求校验过滤及服务聚合的基础。

## 过滤器类型

* pre：在请求被路由到目标服务前执行，比如权限校验、打印日志等功能；

* routing：在请求被路由到目标服务时执行，这是使用 Apache HttpClient 或 Netflix Ribbon 构建和发送原始 HTTP 请求的地方；

* post：在请求被路由到目标服务后执行，比如给目标服务的响应添加头信息，收集统计数据等等功能；

* error：请求在其他阶段发生错误时执行。

## 过滤器的声明周期

> 下图描述了一个 HTTP 请求到 API 网关后，如何在各种不同类型的过滤器中流转的过程。

<img :src="$withBase('/img/microservice/zuul/过滤器声明周期.png')" alt="过滤器声明周期" />

## 自定义过滤器

### 添加 PreLogFilter 类继承 ZuulFilter

> 这是一个前置过滤器，主要用于在请求路由到目标服务前打印请求日志

```java
@Component
public class PreLogFilter extends ZuulFilter {

    private final Logger LOGGER = LoggerFactory.getLogger(PreLogFilter.class);

    /**
     * 过滤器类型，有 pre、routing、post、error 四种
     *
     * @return 过滤器类型
     */
    @Override
    public String filterType() {
        return "pre";
    }

    /**
     * 过滤器执行顺序，数值越小优先级越高
     *
     * @return 执行顺序
     */
    @Override
    public int filterOrder() {
        return 1;
    }

    /**
     * 是否进行过滤
     *
     * @return true 执行过滤，false 不执行
     */
    @Override
    public boolean shouldFilter() {
        return true;
    }

    /**
     * 自定义的过滤器逻辑，当 shouldFilter() 返回 true 时会执行
     */
    @Override
    public Object run() {
        RequestContext context = RequestContext.getCurrentContext();
        HttpServletRequest request = context.getRequest();
        String host = request.getRemoteHost();
        String method = request.getMethod();
        String uri = request.getRequestURI();
        LOGGER.info("Remote host:{}, method:{}, uri:{}", host, method, uri);

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            // 打印cookie
            for (Cookie cookie : cookies) {
                LOGGER.info("cookie path:{}, name:{}, value:{}, domain:{}", cookie.getPath(), cookie.getName(), cookie.getValue(), cookie.getDomain());
            }
        }

        return null;
    }
}
```

### 启动项目

启动项目，访问  <a href='http://localhost:9527/microservice/dept/dept/list/'>http://localhost:9527/microservice/dept/dept/list/</a>，控制台会打印出日志信息，如下：

<img :src="$withBase('/img/microservice/zuul/日志打印过滤器.png')" alt="日志打印过滤器" />

## 核心过滤器

| 过滤器名称              | 过滤器类型 | 优先级 | 过滤器作用                                                   |
| ----------------------- | ---------- | ------ | ------------------------------------------------------------ |
| ServletDetectionFilter  | pre        | -3     | 检测当前请求是通过 `DispatcherServlet` 处理运行的还是 `ZuulServlet` 运行处理的。 |
| Servlet30WrapperFilter  | pre        | -2     | 对原始的 `HttpServletRequest` 进行包装。                     |
| FormBodyWrapperFilter   | pre        | -1     | 将 `Content-Type` 为 `application/x-www-form-urlencoded` 或 `multipart/form-data` 的请求包装成 `FormBodyRequestWrapper` 对象。 |
| DebugFilter             | route      | 1      | 根据 `zuul.debug.request` 的配置来决定是否打印 debug 日志。  |
| PreDecorationFilter     | route      | 5      | 对当前请求进行预处理以便执行后续操作。                       |
| RibbonRoutingFilter     | route      | 10     | 通过 `Ribbon` 和 `Hystrix` 来向服务实例发起请求，并将请求结果进行返回。 |
| SimpleHostRoutingFilter | route      | 100    | 只对请求上下文中有 `routeHost` 参数的进行处理，直接使用 `HttpClien ` 向 `routeHost` 对应的物理地址进行转发。 |
| SendForwardFilter       | route      | 500    | 只对请求上下文中有 `forward.to` 参数的进行处理，进行本地跳转。 |
| SendErrorFilter         | post       | 0      | 当其他过滤器内部发生异常时会由它来进行处理，产生错误响应。   |
| SendResponseFilter      | post       | 1000   | 利用请求上下文的响应信息来组织请求成功的响应内容。           |



## 禁用过滤器

- 我们可以对过滤器进行禁用的配置，配置格式如下：

  ``` yaml
  zuul:
    filterClassName:
      filter:
        disable: true 
  ```

- 以下是禁用 PreLogFilter 的示例配置：

``` yaml
zuul:
  PreLogFilter:
    pre:
      disable: true 
```

