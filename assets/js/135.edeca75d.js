(window.webpackJsonp=window.webpackJsonp||[]).push([[135],{673:function(t,s,e){"use strict";e.r(s);var a=e(4),n=Object(a.a)({},(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h2",{attrs:{id:"application-yml"}},[t._v("application.yml")]),t._v(" "),e("p",[t._v("修改配置文件，添加 zuul 配置，配置服务提供者的路由映射规则。")]),t._v(" "),e("div",{staticClass:"language-yaml extra-class"},[e("pre",{pre:!0,attrs:{class:"language-yaml"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Zuul 配置")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("zuul")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("routes")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("dept-server-provider")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 服务名称")]),t._v("\n      "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("path")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" /dept/"),e("span",{pre:!0,attrs:{class:"token important"}},[t._v("**")]),t._v("                      "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 自定义路由映射，不再通过服务名称去映射具体服务")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("ignored-services")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" dept"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("server"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("provider  "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 隐藏真是的服务名称")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("prefix")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" /microservice                   "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 统一的URI前缀")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("sensitive-headers")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" Cookie"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("Set"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("-")]),t._v("Cookie"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("Authorization     "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#配置过滤敏感的请求头信息，设置为空就不会过滤")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("add-host-header")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v("                   "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#设置为 true 重定向是会添加host请求头")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("retryable")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("true")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 关闭重试机制")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("PreLogFilter")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n    "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("pre")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("\n      "),e("span",{pre:!0,attrs:{class:"token key atrule"}},[t._v("disable")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token boolean important"}},[t._v("false")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#控制是否启用过滤器")]),t._v("\n")])])]),e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"title"}),e("ul",[e("li",[e("p",[e("code",[t._v("routes")]),t._v(" 配置的是服务的路由映射，"),e("code",[t._v("dept-server-provider")]),t._v(" 表示的服务实例名称，"),e("code",[t._v("path")]),t._v(" 服务路由映射，这两个是成对出现的； 上述配置后的效果就是可以直接通过访问"),e("code",[t._v("http:\\\\localhost:9527\\dept\\dept\\list\\")]),t._v(" 访问服务提供者。")])]),t._v(" "),e("li",[e("p",[e("code",[t._v("ignored-services")]),t._v(" 配置项是一个数组，如果需要忽略多个服务名称时，可以直接使用 "),e("code",[t._v("*")]),t._v(" 代替。 当我们不配置该项时，即便我们单独配置了服务的路由映射，还是可以用 "),e("code",[t._v("http://localhost:9527/dept-server-provider/dept/list")]),t._v(" 访问。")])]),t._v(" "),e("li",[e("p",[e("code",[t._v("prefix")]),t._v(" 配置的是所有服务的访问路径前缀，默认是缺省的，如果配置之后，在访问服务时，就需要添加对应的前缀。上述配置效果就是通过 "),e("code",[t._v("http:\\\\localhost:9527\\microservice\\dept\\dept\\list\\")]),t._v(" 访问服务提供者。")])]),t._v(" "),e("li",[e("p",[e("code",[t._v("sensitive-headers")]),t._v(" 配置过滤敏感的请求头信息，默认值 "),e("code",[t._v("Cookie")]),t._v("、"),e("code",[t._v("Set-Cookie")]),t._v("、"),e("code",[t._v("Authorization")]),t._v("；当客户端发送的请求中携带了配置的请求头信息("),e("code",[t._v("Cookie")]),t._v("、"),e("code",[t._v("Set-Cookie")]),t._v("、"),e("code",[t._v("Authorization")]),t._v(")， 这些请求投是不会发送给下游服务的。")])]),t._v(" "),e("li",[e("p",[e("code",[t._v("add-host-header")]),t._v(" 配置传递原始 host 请求头信息； 当我们的下游服务限制了 request 的 host 请求头信息和服务器一致时，该配置应该设置 false 值，也就是不需要传递原始 host，而是当前 zuul 代理服务的 host 请求头；这其实是一个安全性策略，避免有人跳过 zuul 代理，直接访问下游服务。")])])])]),e("h2",{attrs:{id:"启动项目"}},[t._v("启动项目")]),t._v(" "),e("p",[t._v("添加了上述的配置之后，再次启动项目，访问 "),e("a",{attrs:{href:"http://localhost:9527/microservice/dept/dept/list/"}},[t._v("http://localhost:9527/microservice/dept/dept/list/")]),t._v(",如下：")]),t._v(" "),e("img",{attrs:{src:t.$withBase("/img/microservice/zuul/路由映射.png"),alt:"路由映射"}})])}),[],!1,null,null,null);s.default=n.exports}}]);