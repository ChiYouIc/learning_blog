const link = '/microservice/'

exports.config = {
    link: link,
    nav: {
        text: '微服务', items: [
            {text: 'Eureka 服务注册与发现', link: '/microservice/eureka/'},
            {text: 'Ribbon 负载均衡', link: '/microservice/ribbon/'},
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
    }
}

