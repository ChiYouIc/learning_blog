const link = '/database/'

exports.config = {
    link: link,
    nav: {
        text: '数据库', items: [
            {text: 'MySQL', link: '/database/mysql/'},
            {text: 'Redis', link: '/database/redis/'},
            {text: 'MongoDB', link: '/database/mongodb/'},
        ]
    },
    sidebar: {
        '/database/mysql/': [
            '',

        ],
        '/database/redis/': [
            '',
            'Redis键',
            'Redis字符串',
            'Redis哈希',
            'Redis列表',
            'Redis集合',
            'Redis有序集合',
            'RedisHyperLogLog',
            'Redis发布订阅',
        ],
        '/database/mongodb/': [
            ''
        ]
    }
}


