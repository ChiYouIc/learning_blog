const go = require("../go/index");
const java = require("../java/index");
const architect = require('../architect/index')

function handleSidebar() {
    return Object.assign(java.config.sidebar, go.config.sidebar, architect.config.sidebar);
}

module.exports = {
    head: [
        ['link', {rel: 'icon', href: '/logo.png'}]
    ],
    title: '一兜小白菜',
    description: 'learning something',
    port: 8085,
    themeConfig: {
        logo: '/logo.png',
        sidebarDepth: 2,
        displayAllHeaders: true, // 默认值：false
        nav: [
            {text: 'Home', link: '/'},
            java.config.nav,
            go.config.nav,
            architect.config.nav
        ],
        sidebar: handleSidebar()
    }
}
