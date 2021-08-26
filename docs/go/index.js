const link = '/go/'

exports.config = {
    link: link,
    nav: {
        text: 'Go Learning', items: [
            {text: 'GO 基础', link: '/go/base/'}
        ], icon: 'fas fa-gopuram'
    },
    sidebar: {
        '/go/base/': [
            '',
            'Interface'
        ]
    }
}

