const link = '/spring/'

exports.config = {
    link: link,
    nav: {
        text: 'Spring Learning', items: [
            {text: 'Spring', link: '/spring/spring/'},
            {text: 'SpringBoot', link: '/spring/springBoot/'},
            {text: 'SpringSecurity', link: '/spring/springSecurity/'}
        ], icon: 'fas fa-seedling'
    },
    sidebar: {
        // '/spring/spring/': [
        //     ''
        // ],
        // '/spring/springBoot/': [
        //     ''
        // ],
        // '/spring/springSecurity/': [
        //     ''
        // ]
    }
}

