const link = '/microservice/'

exports.config = {
    link: link,
    nav: {
        text: '微服务', items: [
            {text: '领域驱动设计', link: '/microservice/ddd/'},
            {text: 'Eureka 服务注册与发现', link: '/microservice/eureka/'},
            {text: 'Ribbon 负载均衡', link: '/microservice/ribbon/'},
            {text: 'Feign 声明式服务调用', link: '/microservice/feign/'},
            {text: 'Hystrix 服务容错保护', link: '/microservice/hystrix/'},
            {text: 'Zuul 路由网关', link: '/microservice/zuul/'},
            {text: 'Gateway 服务网关', link: '/microservice/gateway/'},
            {text: '理论与面试', link: '/microservice/theory/'},
        ], icon: 'fas fa-cloud'
    },
    sidebar: {
        '/microservice/ddd/': [
            ''
        ],
        '/microservice/eureka/': [
            '',
            'EurekaCreate',
            'EurekaCluster'
        ],
        '/microservice/ribbon/': [
            '',
            'LoadBalancingServiceInvocation',
            'LoadBalancingPolicy'
        ],
        '/microservice/feign/': [
            ''
        ],
        '/microservice/hystrix/': [
            '',
            'ServiceFusing',
            'ServiceDegradation',
            'ServiceMonitoring',
            'RequestCache',
            'RequestMerge',
            'CommonlyUsedConfiguration',
        ],
        '/microservice/zuul/': [
            '',
            'RouteConfiguration',
            'RouteMap',
            'Filter',
        ],
        '/microservice/gateway/': [
            ''
        ],
        // '/microservice/theory/': [
        //     ''
        // ]

    }
}

