const go = require("../go/index");
const java = require("../java/index");
const architect = require('../architect/index')
const spring = require('../spring/index')
const microservice = require('../microservice/index')
const database = require('../database/index')
const server = require('../server/index')

const plugins = {
    '@vuepress/medium-zoom':
        {
            selector: 'img.zoom-custom-imgs',
            // medium-zoom options here
            // See: https://github.com/francoischalifour/medium-zoom#options
            options: {
                margin: 16
            }
        },
    '@vuepress/pwa': {
        serviceWorker: true,
        popupComponent: 'MySWUpdatePopup',
        updatePopup: true
    }
}

const nav = [
    {text: '首页', link: '/', icon: 'reco-home'},
    java.config.nav,
    go.config.nav,
    spring.config.nav,
    microservice.config.nav,
    database.config.nav,
    server.config.nav,
    architect.config.nav,
    {text: '时间线', link: '/timeline/', icon: 'reco-date'}
]


function handleSidebar() {
    return Object.assign(
        java.config.sidebar,
        go.config.sidebar,
        architect.config.sidebar,
        spring.config.sidebar,
        microservice.config.sidebar,
        database.config.sidebar,
        server.config.sidebar
    );
}

module.exports = {
    head: [
        ['link', {rel: 'icon', href: '/logo.png'}],
        ['link', {rel: 'manifest', href: '/manifest.json'}],
    ],
    plugins,
    title: '一兜小白菜',
    description: 'learning something',
    port: 8085,
    dest: 'public',
    base: '/learning_blog/',
    // 语言配置
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    theme: 'reco',
    themeConfig: {
        logo: '/logo.png',
        type: 'blog',
        authorAvatar: '/avatar.jpg',
        sidebarDepth: 1,
        displayAllHeaders: false, // 显示所有页面的标题链接 默认值：false
        nav,
        sidebar: handleSidebar(),
        // 博客配置
        blogConfig: {
            category: {
                location: 2,     // 在导航栏菜单中所占的位置，默认2
                text: '分类' // 默认文案 “分类”
            },
            tag: {
                location: 3,     // 在导航栏菜单中所占的位置，默认3
                text: '标签'      // 默认文案 “标签”
            },
            // 信息栏展示社交信息
            socialLinks: [
                {icon: 'reco-github', link: 'https://github.com/ChiYouIc'},
                {icon: 'reco-mayun', link: 'https://gitee.com/athenIc'},
                {icon: 'reco-wechat', link: 'https://github.com/ChiYouIc'},
                {icon: 'reco-qq', link: 'https://github.com/ChiYouIc'},
            ]
        },
        // 友情链接
        friendLink: [
            {
                title: 'vuepress-theme-reco',
                desc: 'A simple and beautiful vuepress Blog & Doc theme.',
                logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
                link: 'https://vuepress-theme-reco.recoluan.com'
            },
        ],
    },
}
