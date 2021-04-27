const link = '/microservice/'

exports.config = {
    link: link,
    nav: {
        text: '微服务', items: [
            {text: 'Eureka 服务注册与发现', link: '/microservice/eureka/'},
        ]
    },
    sidebar: {
        '/microservice/eureka/': [
            '',
            'Eureka 服务搭建',
            'Eureka 集群搭建'
        ],
    }
}

