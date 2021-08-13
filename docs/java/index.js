const link = '/java/'

exports.config = {
    link: link,
    nav: {
        text: 'Java Learning', items: [
            {text: 'JVM 虚拟机', link: '/java/jvm/'},
            {text: 'Java 多线程', link: '/java/thread/'},
            {text: 'Java IO', link: '/java/io/'},
            {text: 'Java NIO', link: '/java/nio/'},
            {text: '设计模式', link: '/java/design/'},
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
            'sleep()与wait()',
            'start()与Run()',
            '乐观锁与悲观锁',
            '自旋锁',
            'Synchronized同步锁',
            'ReentrantLock',
            'Semaphore',
            'CyclicBarrier',
            'CountDownLatch',
            '线程锁',
            '线程基本方法',
            '线程上下文切换',
            '同步锁与死锁',
            '线程池原理',
            '阻塞队列',
        ],
        '/java/io/': [],
        '/java/nio/': [],
        '/java/design/': [
            '',
            '单例模式',
            '工厂方法模式',
            '抽象工厂模式',
            '模板方法模式',
            '建造者模式',
            '代理模式',
            '原型模式',
            '中介者模式',
            '命令模式',
            '责任链模式',
            '装饰模式'
        ]
    }
}

