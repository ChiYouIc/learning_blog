const path = require('path')

const go = require("../go/index");
const java = require("../java/index");
const architect = require('../architect/index')
const spring = require('../spring/index')
const microservice = require('../microservice/index')
const database = require('../database/index')

const nav = [
    {text: 'Home', link: '/'},
    java.config.nav,
    go.config.nav,
    spring.config.nav,
    microservice.config.nav,
    database.config.nav,
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
        spring.config.sidebar,
        microservice.config.sidebar,
        database.config.sidebar
    );
}

module.exports = {
    head: [
        ['link', {rel: 'icon', href: '/logo.png'}],
        ['link', {rel: 'manifest', href: '/manifest.json'}],
    ],
    plugins: ['@vuepress/pwa', {
        serviceWorker: true,
        updatePopup: true
    }],
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
