---
title: 什么是 Cookie、Session、Token？
sidebar: auto
date: 2021-08-16
categories:
 - 计算机网络
tags:
 - Cookie
 - Session
 - Http
---

# 什么是 Cookie、Session、Token？

在讲解 `Cookie`、`Session`、`Token` 前，我们先来理解两个概念：`认证`、`授权`。

## 什么是认证？

认证（Authentication）简单来说就是 **验证身份**，证明一个用户的合法性。

传统的身份认证方式是通过`用户名`与`密码`，随着科技的发展，除了传统认证当时，还有：

- 用户手机：手机短信、二维码、手势密码；
- 电子邮箱；
- 身份证号码；
- 基于时间序列和用户相关的一次性口令；
- 生物学特征：指纹、语音、虹膜等。

有时为了确认用户的身份，防止请求伪造，在安全场合要求高的场合，经常会使用组合认证（也叫多因素认证），也就是同时使用多个认证方式对用户的身份进行校验。



## 什么是授权？

授权（Authorization）简单来说就是 **授权第三方访问用户资源的权限**。

在互联网应用开发中，主要通过下面几种方式实现授权：

- 通过 Session 机制，一个访问会话保持着用户的授权信息；
- 通过 Cookie 机制，一个网站的 cookie 保持着用户的授权信息；
- 颁发授权令牌（Token），一个合法有效的令牌中保持着用户的授权信息。



## 什么是 Cookie？

### Cookie 特点

- Cookie 是最开始被设计出来是为了弥补 HTTP 在状态管理上的不足；
- **Cookie 存储在客户端**：Cookie 是服务器发送到用户浏览器并保存在本地的一小块数据，用户浏览器每向服务器发起一次请求，都会将这个服务器传发送来的 Cookie 带上；
- **Cookie 是不可跨域的**：每个 Cookie 都会绑定单一的域名（包括子域），无法在别的域名下获取使用，即同域的 Cookie 可以共享，这个特点常应用在 **SSO（单点登陆）** 中。



### 设置 Cookie

服务器向客户端发送 Cookie 是通过 HTTP 响应报文实现的，在 Set-Cookie 中设置需要向客户端发送的 Cookie，Cookie 的格式如下：

``` json
Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]
```



### Cookie 工作流程

<img :src="$withBase('/img/server/network/cookie工作流程.png')" alt="cookie工作流程">

- 步骤一：浏览器向服务器发送请求；
- 步骤二：服务相应请求，并向浏览器设置 Cookie；
- 步骤三：浏览器将 Cookie 存在本地，下一次请求带上该 Cookie；
- 步骤四：服务器响应请求。



### Cookie 常见属性

- **name=value**

  键值对，设置 Cookie 的名称及相对应的值。

- **domain**

  指定 Cookie 所属域名，默认是当前域名。如果 cookie 的 domain 设置为 company.com，那么 app1.company.cm、app2.company.com 都是可以共享 cookie 的，但是访问 otherCompany.com 就不能共享 cookie 了，这就涉及跨域访问的问题。

- **path**

  指定 Cookie 在哪个路径（路由）下生效，默认是 '/'。如果设置为 /abc，则只有 /abc 下的路由可以访问该 cookie，如：/abc/read。

- **expiress**

  指定 Cookie 的过期时间（GMT时间格式），到达该时间点后该 Cookie 就会自动失效。

- **max-age**

  HTTP 1.1 中定义的，优先级高于 expires 字段。

  max-age 表示 Cookie 有效期，单位秒。如果为正数，则该 Cookie 在 max-age 秒后失效；如果为负数，该 Cookie 为临时 Cookie，关闭浏览器即失效，浏览器也不会以任何形式保存该 Cookie；如果为 0，表示删除该 Cookie。默认为 -1。

- **HttpOnly**

  如果给某个 Cookie 设置了 httpOnly 属性，则无法通过 JS 脚本读写该 Cookie 信息。

- **secure**

  该 Cookie 是否仅被使用安全协议传输，默认为 false。当前 secure 值为 true 时，Cookie 在 HTTP 中是无效的，只能在带有安全协议的 HTTPS 中有效。



## 什么是 Session？

Session 翻译过来就是**会话**。用户打开一个浏览器，点击多个超链接，访问服务器多个 web 资源，然后关闭浏览器，整个会话称之为一个会话。

### Session 的特点

- Session 是另一种记录服务器和客户端会话状态的机制；
- Session 存储在服务端，一般是文件中，也可以存在数据库或缓存中。
- Session 一般基于 Cookie 实现。Session 中包含敏感信息存储在服务端，通常将 SessionId 存储在客户端的 Cookie 中，客户端每次请求携带 SessionId 即可识别用户。

### Session 工作流程

<img :src="$withBase('/img/server/network/session工作流程.png')" alt="session工作流程">

- 用户第一次请求，提交用户名密码等信息进行登录认证，服务器根据用户提交的信息进行鉴权，鉴权成功后创建 Session 对象，并将 sessionId 设置到 Cookie 中，浏览器收到响应信息将 Cookie 存入本地；
- 用户第二次请求，以查看订单信息为例，浏览器自动将当前域名下的 Cookie 信息发送给服务端，服务端解析 Cookie，获取到 sessionId 后再查找对应的 Session 对象，如果 Session 对象存在说明用户已经登陆，继续下一步操作。

从上面的流程可知，sessionId 是 Cookie 和 Session 中间的一道桥梁。

::: tip 注意

如果客户端禁用了 Cookie，还可以通过url 重写等方式传递 sessionId。

:::



## Cookie 与 Session 的区别

- **存储方式**：Cookie 数据存放在客户端的浏览器上，Session 数据存放在服务器上；
- **安全性**：Cookie 是本地存储，不是很安全，别人可以分析存放在本地的 cookie 并进行欺骗；
- **存储大小**：很多浏览器限制单个 Cookie 保存的数据不能超过 4K，一个站点最后保存 20 个 Cookie，Session 则没有类似的限制；
- **生命周期**：Cookie 可设置为长时间保持，Session 一般失效时间较短，一般客户端关闭 session 就会失效。



## 什么是 Token？

### Token 的组成

Token 是验证用户身份的凭证，我们通常叫它：**令牌**。

最简单的 Token 组成：uid（用户唯一的身份标识）、time（当前时间的时间戳）、sign（签名，以哈希算法压缩成一定长度的十六进制字符串）

<img :src="$withBase('/img/server/network/token的组成.png')" alt="token的组成">

### Token 的特点

- 无状态、可扩展
- 支持移动端设备
- 支持跨程序调用
- 安全

### Token 工作流程

<img :src="$withBase('/img/server/network/token工作流程.png')" alt="token工作流程">

- 步骤一：客户端使用用户名密码或者其它认证方式进行登陆；

- 步骤二：服务端收到请求后进行鉴权，鉴权成功后服务端会生成一个 token 并发送给客户端，客户端收到 token 以后，会把它存储起来，比如放在 Cookie 里或者 LocalStorage 里；
- 步骤三：客户端下一次向服务端请求资源的时候需要带着存储的 Token；
- 步骤四：服务端收到请求，然后去校验客户端请求里面带着的 Token，如果校验成功，就像客户端返回请求的数据。

::: tip 注意

- 客户端请求时可以将 Token 放到 HTTP 的 Header 里；
- 基于 Token 的用户认证是一种服务端无状态的认证方式，服务端不用存放 Token 数据；
- 用解析 Token 的计算时间换取 Session 的存储空间，从而减轻服务器的压力，减少频繁的查询数据库。

:::



## 什么是 JWT？

从本质上讲 JWT 也是一种 Token，只不过 JWT 是被大家广泛接受的标准。

JWT 即：Json Web Token（JWT），是为了在网络应用环境间传递声明而执行的一种基于 JSON 的开放标准（RFC 7519）.

JWT 的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息。



### JWT 的组成

<img :src="$withBase('/img/server/network/JWT的组成.png')" alt="JWT的组成">

JWT 共有三部分组成：

- 第一部分为头部（header）
- 第二部分为载荷（payload，类似于飞机承载的物品）
- 第三部分是签证（signature）

在https://jwt.io/网站上可以解析一个已知的 JWT：

<img :src="$withBase('/img/server/network/jwt.png')" alt="jwt">

- **header**

  jwt的头部承载两部分信息：**声明类型**，这里是 jwt；**声明加密的算法**，通常直接使用 HMAX SHA256；

- **payload**

  载荷就是存放有效信息的地方。主要包含三个部门：**标准中注册的声明**、**公共声明**、**私有声明**。

- **signature**

  JWT 的第三部门是一个签名信息，这个签证信息由三个部分组成：header（base64后的）；payload（base64后）、secret。



### JWT 的特点

- 不在 JWT 的 payload 部分存放敏感信息，因为该部分是客户端可解密的部分；
- 保护好 secret 私钥，该私钥非常重要；
- 如果可以，请使用 https 协议。



## 总结

在分布式微服务技术日趋流行的今天，大型网站的设计都尽量避免使用 Session 实现 HTTP 状态化。

Session 简单粗暴，在服务端维护会话信息，在客户端保存 sessionId，服务端能够轻易地把会话控制在自己的手中，但服务集群化会产生 Session 共享的负担。

JWT（Token）只在客户端保存会话信息，服务端通过密钥校验会话，（相比）拿时间换空间，卸下了服务集群共享会话信息的负担，但却加大了服务端控制会话的难度。



> 摘自[熬夜彻底搞懂Cookie Session Token JWT](https://mp.weixin.qq.com/s/_XGHtz07A0ESxJPspmNY1Q)

