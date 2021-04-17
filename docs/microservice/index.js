const link = '/microservice/'

exports.config = {
    link: link,
    nav: {
        text: '微服务', items: [
            {text: 'Eureka', link: '/microservice/eureka/'},
        ]
    },
    sidebar: {
        '/microservice/eureka/': [
            ''
        ],
    }
}

