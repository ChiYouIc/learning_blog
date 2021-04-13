const link = '/java/'

exports.config = {
    link: link,
    nav: {
        text: 'Java Learning', items: [
            {text: 'JVM 虚拟机', link: '/java/jvm/'},
            {text: 'JVM IO', link: '/java/io/'},
            {text: 'JVM NIO', link: '/java/nio/'}
        ]
    },
    sidebar: {
        '/java/jvm/': [
            '',
        ],
        '/java/io/': [],
        '/java/nio/': []
    }
}

