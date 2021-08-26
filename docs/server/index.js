const link = '/server/'

exports.config = {
    link: link,
    nav: {
        text: '服务器', items: [
            {text: '操作系统', link: '/server/operating/'},
            {text: '计算机网络', link: '/server/network/'},
            {text: '算法', link: '/server/algorithm/'},
            {text: 'Nginx', link: '/server/nginx/'},
            {text: 'Docker', link: '/server/docker/'}
        ], icon: 'fas fa-server'
    },
    sidebar: {
        '/server/operating/': [
            ''
        ],
        '/server/algorithm/': [
            ''
        ],
        '/server/network/': [
            ''
        ],
        '/server/nginx/': [
            ''
        ],
        '/server/docker/': [
            ''
        ]
    }
}

