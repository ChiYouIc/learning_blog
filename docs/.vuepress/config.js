const go = require("../go/index");
const java = require("../java/index");

module.exports = {
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
        ],
        sidebar: {
            '/': [],
            ['' + java.config.link]: java.config.sidebar,
            ['' + go.config.link]: go.config.sidebar
        }
    }
}
