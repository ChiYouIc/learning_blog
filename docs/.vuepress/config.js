const go = require("../go/index");
const java = require("../java/index");
const architect = require('../architect/index')
const spring = require('../spring/index')
const microservice = require('../microservice/index')
const database = require('../database/index')
const server = require('../server/index')

const plugins = {
    'vuepress-plugin-flowchart': {},
    // 支持 mermaid 绘图的插件
    'vuepress-plugin-mermaidjs': {},
    'cursor-effects': {
        size: 2, // size of the particle, default: 2
        shape: ['star'], // shape of the particle, default: 'star'
        zIndex: 999999999, // z-index property of the canvas, default: 999999999
    },
    'vuepress-plugin-cat': {
        theme: ['blackCat'],
        clean: false,
        messages: {
            welcome: '欢迎来到您的站点名称【顿顿白菜】的博客',
            home: '心里的花，我想要带你回家。',
            theme: '好吧，希望你能喜欢我的其他小伙伴。',
            close: '你知道我喜欢吃什么吗？痴痴地望着你。'
        },
        messageStyle: { right: '68px', bottom: '190px' },
        modelStyle: { right: '90px', bottom: '-20px', opacity: '0.9' },
        btnStyle: { right: '90px', bottom: '40px' },
        width: 200,
        height: 300
    },
    '@vuepress/medium-zoom': {
        selector: '.content__default img',
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
    { text: '首页', link: '/', icon: 'reco-home' },
    java.config.nav,
    go.config.nav,
    spring.config.nav,
    microservice.config.nav,
    database.config.nav,
    server.config.nav,
    architect.config.nav,
    { text: '时间线', link: '/timeline/', icon: 'reco-date' }
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
        ['link', { rel: 'icon', href: '/logo.png' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
    ],
    plugins,
    title: '一兜小白菜',
    description: '任何职业都可以成为黑客。你可以是一个木匠黑客。不一定是高科技。只要与技能有关，并且倾心专注于你正在做的事情，你就可能成为黑客。',
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
        author: '顿顿白菜',
        logo: '/logo.png',
        type: 'blog',
        authorAvatar: '/avatar.jpg',
        subSidebar: 'auto', //在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
        sidebarDepth: 1,
        displayAllHeaders: false, // 显示所有页面的标题链接 默认值：false
        bgImageStyle: {
            height: '350px'
        },
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
                { icon: 'reco-github', link: 'https://github.com/ChiYouIc' },
                { icon: 'reco-mayun', link: 'https://gitee.com/athenIc' },
                { icon: 'reco-wechat', link: 'https://github.com/ChiYouIc' },
                { icon: 'reco-qq', link: 'https://github.com/ChiYouIc' },
            ]
        },
        // 友情链接
        friendLink: [
            {
                title: 'vuepress-theme-reco',
                desc: 'A simple and beautiful vuepress Blog & Doc theme.',
                logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
                link: 'https://vuepress-theme-reco.recoluan.com'
            }, {
                title: '我的博客',
                desc: '我的个人博客主页',
                logo: '/logo.png',
                link: 'http://iron-man.top/'
            }
        ],
    },
    // markdown 扩展
    markdown: {
        // markdown-it-anchor 的选项
        anchor: { permalink: false },
        // markdown-it-toc 的选项
        toc: { includeLevel: [1, 2] },
        extendMarkdown: md => {
            // 使用更多的 markdown-it 插件!
            md.use(require('markdown-it-plantuml'))
        }
    }
}
