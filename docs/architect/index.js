const link = '/architect/'

exports.config = {
    link: link,
    nav: {text: '软件架构师', link: link, ariaLabel: '软件架构师'},
    sidebar: {
        '/architect/': [
            '',
            'multithreading',
            'database_system'
        ]
    }
}
