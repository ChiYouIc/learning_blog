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
            'Redis键(Key)',
            'Redis字符串(String)',
            'Redis哈希(Hash)',
            'Redis列表(List)',
            'Redis集合(Set)',
            'Redis有序集合',
            'RedisHyperLogLog',
            'Redis发布订阅',
        ],
        '/database/mongodb/': [
            ''
        ]
    }
}

