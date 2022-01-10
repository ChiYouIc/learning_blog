const link = '/server/'

exports.config = {
    link: link,
    nav: {
        text: '操作系统', items: [
            {text: '操作系统', link: '/server/operating/'},
            {text: '计算机网络', link: '/server/network/'},
            {text: '数据结构与算法', link: '/server/algorithm/'},
            {text: 'Nginx', link: '/server/nginx/'},
            {text: 'Docker', link: '/server/docker/'}
        ], icon: 'fas fa-server'
    },
    sidebar: {
        // '/server/operating/': [
        //     ''
        // ],
        '/server/algorithm/': [
            '',
            'Queue'
        ],
        // '/server/network/': [
        //     '',
        //     'http/HttpProtocol',
        //     'CookieAndSession'
        // ],
        // '/server/nginx/': [
        //     ''
        // ],
        '/server/docker/': [
            '',
            'Use'
        ]
    }
}

