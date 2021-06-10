const link = '/microservice/'

exports.config = {
    link: link,
    nav: {
        text: '微服务', items: [
            {text: 'Eureka 服务注册与发现', link: '/microservice/eureka/'},
            {text: 'Ribbon 负载均衡', link: '/microservice/ribbon/'},
            {text: 'Feign 声明式服务调用', link: '/microservice/feign/'},
            {text: 'Hystrix 服务容错保护', link: '/microservice/hystrix/'},
            {text: 'Zuul 路由网关', link: '/microservice/zuul/'},
        ]
    },
    sidebar: {
        '/microservice/eureka/': [
            '',
            'Eureka 服务搭建',
            'Eureka 集群搭建'
        ],
        '/microservice/ribbon/': [
            '',
            '负载均衡服务调用',
            '负载均衡策略'
        ],
        '/microservice/feign/': [
            ''
        ],
        '/microservice/hystrix/': [
            '',
            '服务熔断',
            '服务降级',
            '服务监控',
            '请求缓存',
            '请求合并',
            '常用配置',
        ],
        '/microservice/zuul/': [
            '',
            '路由配置',
            '路由映射',
            '过滤器',
        ]

    }
}

