const link = '/database/'

exports.config = {
    link: link,
    nav: {
        text: '数据库', items: [
            {text: 'MySQL', link: '/database/mysql/'},
            {text: 'Redis', link: '/database/redis/'},
            {text: 'MongoDB', link: '/database/mongodb/'},
        ], icon: 'fas fa-database'
    },
    sidebar: {
        '/database/mysql/': [
            '',
            'DatabaseAndTable',
            'CRUD',
            'DataType',
            'Engine',
            'Interview'

        ],
        '/database/redis/': [
            '',
            'RedisKey',
            'RedisString',
            'RedisHash',
            'RedisList',
            'RedisSet',
            'RedisSortedSet',
            'RedisHyperLogLog',
            'RedisPubSub',
        ],
        '/database/mongodb/': [
            ''
        ]
    }
}


