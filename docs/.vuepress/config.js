const path = require('path')

const go = require("../go/index");
const java = require("../java/index");
const architect = require('../architect/index')
const spring = require('../spring/index')

const nav = [
    {text: 'Home', link: '/'},
    java.config.nav,
    go.config.nav,
    spring.config.nav,
    architect.config.nav
]

const configureWebpack = {
    resolve: {
        alias: {
            '@': resolve('docs/asset')
        }
    }
}

function resolve(dir) {
    return path.join(__dirname, dir)
}

function handleSidebar() {
    return Object.assign(
        java.config.sidebar,
        go.config.sidebar,
        architect.config.sidebar,
        spring.config.sidebar
    );
}

module.exports = {
    head: [
        ['link', {rel: 'icon', href: '/logo.png'}]
    ],
    title: '一兜小白菜',
    description: 'learning something',
    port: 8085,
    dest: 'public',
    base: '/learning_blog/',
    theme: 'antdocs',
    themeConfig: {
        logo: '/logo.png',
        sidebarDepth: 1,
        displayAllHeaders: false, // 显示所有页面的标题链接 默认值：false
        nav,
        sidebar: handleSidebar()
    },
    configureWebpack
}
