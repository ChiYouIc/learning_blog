const link = '/java/'

exports.config = {
    link: link,
    nav: {
        text: 'Java Learning', items: [
            {text: 'JVM 虚拟机', link: '/java/jvm/'},
            {text: 'Java 多线程', link: '/java/thread/'},
            {text: 'Java IO', link: '/java/io/'},
            {text: 'Java NIO', link: '/java/nio/'},
        ]
    },
    sidebar: {
        '/java/jvm/': [
            '',
            '线程',
            'JVM 内存区域',
            'JVM 运行时内存',
            '垃圾回收与算法',
            'Java 四种引用类型',
            'GC 分代收集算法 VS 分区收集算法',
            'GC 垃圾收集器',
            'Java IO&NIO',
            'JVM 类加载机制',
        ],
        '/java/thread/': [
            '',
            '线程创建方式',
            '线程池',
            '线程生命周期',
            '线程终止',
            'sleep()与wait()'
        ],
        '/java/io/': [],
        '/java/nio/': []
    }
}

