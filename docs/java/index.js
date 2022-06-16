const link = '/java/'

exports.config = {
    link: link,
    nav: {
        text: 'Java Learning', items: [
            {text: 'JVM 虚拟机', link: '/java/jvm/'},
            {text: 'Java 多线程', link: '/java/thread/'},
            {text: 'Java 集合框架', link: '/java/container/'},
            {text: 'Java IO', link: '/java/io/'},
            {text: 'Java NIO', link: '/java/nio/'},
            {text: '设计模式', link: '/java/design/'},
        ], icon: 'fab fa-java'
    },
    sidebar: {
        '/java/jvm/': [
            '',
            'thread',
            'JVMMemoryArea',
            'JVMRuntimeMemory',
            'GarbageCollectionAndAlgorithms',
            'JavaReferenceTypes',
            'GCCollectionAlgorithms',
            'GCRefuseCollector',
            'JavaIOAndNIO',
            'JVMClassLoadingMechanism',
        ],
        '/java/thread/': [
            '',
            'ThreadCreation',
            'ThreadLifeCycle',
            'ThreadStop',
            'Sleep()AndWait()',
            'Start()AndRun()',
            'OptimisticAndPessimisticLocks',
            'SpinLock',
            'SynchronizedLock',
            'ReentrantLock',
            'Semaphore',
            'CyclicBarrier',
            'CountDownLatch',
            'ThreadLock',
            'BasicThreadingMethods',
            'ThreadContextSwitch',
            'SynchronousLocksAndDeadlocks',
            'ThreadPool',
            'ThreadPoolPrinciple',
            'BlockingQueue',
        ],
        '/java/container/': [
            '',
            'ArrayList',
            'Vector',
            'LinkedList',
            'HashSet',
            'LinkedHashSet',
            'TreeSet',
            'HashMap7',
            'HashMap8',
            'Hashtable',
            'DelayQueue'
        ],
        '/java/io/': [],
        '/java/nio/': [
            '',
            'Channel',
            'FileChannel',
            'Socket',
            'Scatter_Gather',
            'Buffer',
            'Selector',
            'Pipe_FileLock',
            'Other'
        ],
        '/java/design/': [
            '',
            'SingletonPattern',
            'FactoryMethodPattern',
            'AbstractFactoryPattern',
            'TemplateMethodPattern',
            'BuilderPattern',
            'ProxyPattern',
            'PrototypePattern',
            'MediatorPattern',
            'CommandPattern',
            'ChainOfResponsibilityPattern',
            'DecoratorPattern',
            'StrategyPattern',
            'AdapterPattern',
            'IteratorPattern'
        ]
    }
}

