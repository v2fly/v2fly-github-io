// @ts-check
import {defineUserConfig} from 'vuepress'
import {defaultTheme} from '@vuepress/theme-default'
import {docsearchPlugin} from '@vuepress/plugin-docsearch'
import {registerComponentsPlugin} from '@vuepress/plugin-register-components'
import mermaidPlugin from 'vuepress-plugin-mermaidjs'
import { getDirname, path } from '@vuepress/utils'

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
    head: [
        ["link", { rel: "apple-touch-icon", size: "180x180", href: "/apple-touch-icon.png" }],
        ["link", { rel: "icon", type: "image/png", size: "32x32", href: "/favicon-32x32.png" }],
        ["link", { rel: "icon", type: "image/png", size: "16x16", href: "/favicon-16x16.png" }],
        ["link", { rel: "manifest", href: "/site.webmanifest" }],
        ["link", { rel: "mask-icon", color: "#5bbad5", href: "/safari-pinned-tab.svg" }],
        ["meta", { name: "viewport", content: "width=device-width,initial-scale=1.0" }],
        ["meta", { name: "apple-mobile-web-app-title", content: "Project V" }],
        ["meta", { name: "application-name", content: "Project V" }],
        ["meta", { name: "msapplication-TileColor", content: "#da532c" }],
        ["meta", { name: "msapplication-TileColor", content: "#da532c" }]
    ],
    plugins: [
        docsearchPlugin({
            appId: 'BH4D9OD16A',
            apiKey: '1c152ce7991c1da9adc5413104712c5a',
            indexName: 'v2fly'
        }),
        registerComponentsPlugin({
            componentsDir: path.resolve(__dirname, './components'),
        }),
        mermaidPlugin(),
    ],
    locales: {
        '/': {
            lang: 'zh-CN',
            title: 'V2Fly.org',
            description: 'Project V 是一个工具集合，它可以帮助你打造专属的基础通信网络',
        },
        '/en_US/': {
            lang: 'en-US',
            title: 'V2Fly.org',
            description: 'Project V is a collection of tools that can help you build your own basic communication network',
        }
    },
    theme: defaultTheme({
        repo: 'v2fly',
        docsRepo: 'v2fly/v2fly-github-io',
        logo: '/v2ray.png',
        docsDir: 'docs',
        locales: {
            '/': {
                selectLanguageText: 'Languages',
                selectLanguageName: '简体中文',
                selectLanguageAriaLabel: 'Select language',
                editLinkText: '在 GitHub 上编辑此页',
                lastUpdatedText: '上次更新',
                contributorsText: '贡献者',
                navbar: [
                    { text: '快速开始', link: '/guide/start', },
                    { text: '配置文档', link: '/v5/config/overview', },
                    { text: '工具列表', link: '/awesome/tools' },
                    { text: '开发手册', link: '/developer/intro/compile', },
                    { text: '新白话文指南', link: 'https://guide.v2fly.org/' },
                ],
                sidebar: {
                    '/guide/': [
                        {
                            text: '快速开始',
                            children: [
                                'install',
                                'start',
                            ],
                        },
                        {
                            text: '原理',
                            children: [
                                'workflow',
                                'command',
                            ],
                        },
                        {
                            text: '更多',
                            children: [
                                'faq',
                                'help',
                            ],
                        },
                    ],
                    '/config/': [
                        {
                            text: '配置文件',
                            children: [
                                'overview',
                                'env',
                                'dns',
                                'routing',
                                'policy',
                                'inbounds',
                                'outbounds',
                                'transport',
                                'api',
                                'stats',
                                'reverse',
                                'multiple_config',
                                'fakedns',
                                'browserforwarder',
                                'observatory',
                            ],
                        },
                        {
                            text: '协议列表',
                            children: [
                                'protocols/blackhole',
                                'protocols/dns',
                                'protocols/dokodemo',
                                'protocols/freedom',
                                'protocols/http',
                                'protocols/socks',
                                'protocols/vmess',
                                'protocols/shadowsocks',
                                'protocols/trojan',
                                'protocols/vless',
                                'protocols/loopback',
                            ],
                        },
                        {
                            text: '传输方式',
                            children: [
                                'transport/tcp',
                                'transport/mkcp',
                                'transport/websocket',
                                'transport/h2',
                                'transport/quic',
                                'transport/domainsocket',
                                'transport/grpc',
                            ],
                        },
                    ],
                    '/developer/': [
                        {
                            text: '开发手册',
                            children: [
                                'intro/compile',
                                'intro/design',
                                'intro/guide',
                            ]
                        },
                        {
                            text: '协议细节',
                            children: [
                                'protocols/vmess',
                                'protocols/mkcp',
                                'protocols/muxcool',
                            ]
                        }
                    ],
                    "/v5/config/": [
                        {
                            text: '配置参考',
                            children: [
                                'overview',
                                'inbound',
                                'outbound',
                                'proxy',
                                'stream',
                                'service',
                                'dns',
                                'router',
                                'geo',
                            ],
                        },
                        {
                            text: '代理协议',
                            children: [
                                'proxy/blackhole',
                                'proxy/dns',
                                'proxy/dokodemo',
                                'proxy/freedom',
                                'proxy/http',
                                'proxy/socks',
                                'proxy/vmess',
                                'proxy/shadowsocks',
                                'proxy/trojan',
                                'proxy/vless',
                                'proxy/loopback',
                            ],
                        },
                        {
                            text: '传输流协议',
                            children: [
                                'stream/tcp',
                                'stream/websocket',
                                'stream/kcp',
                                'stream/grpc',
                            ],
                        },
                        {
                            text: '服务',
                            children: [
                                'service/stats',
                                'service/policy',
                                'service/browser',
                                'service/burstObservatory',
                                'service/backgroundObservatory',
                            ],
                        }
                    ],
                    '/awesome/tools': ['/awesome/tools'],
                },
            },
            '/en_US/': {
                selectLanguageName: 'English',
                selectLanguageText: '选择语言',
                selectLanguageAriaLabel: '选择语言',
                editLinkText: 'Edit this page on GitHub',
                lastUpdatedText: 'Last Updated',
                navbar: [
                    { text: 'Quick Start', link: '/en_US/guide/start', },
                    { text: 'Config Reference', link: '/en_US/v5/config/overview', },
                    { text: 'Tools', link: '/en_US/awesome/tools' },
                    { text: 'Developer Guide', link: '/en_US/developer/intro/compile', },
                    { text: 'New concise guide', link: 'https://guide.v2fly.org/' },
                ],
                sidebar: {
                    '/en_US/guide/': [
                        {
                            text: 'Quick Start',
                            children: [
                                'install',
                                'start',
                            ],
                        },
                        {
                            text: 'Concept',
                            children: [
                                'workflow',
                            ],
                        },
                        {
                            text: 'More',
                            children: [
                                'faq',
                            ],
                        },
                    ],
                    '/en_US/config/': [
                        {
                            text: 'Config Reference',
                            children: [
                                'overview',
                                'dns',
                                'outbounds',
                            ],
                        },
                        {
                            text: 'Protocols',
                            children: [
                                'protocols/blackhole',
                                'protocols/dns',
                                'protocols/dokodemo',
                                'protocols/freedom',
                            ],
                        },
                        {
                            text: 'Transport',
                            
                            children: [
                            ],
                        },
                    ],
                    '/en_US/developer/': [
                        {
                            text: 'Developer Guide',
                            children: [
                                'intro/compile',
                                'intro/design',
                                'intro/guide',
                            ]
                        },
                        {
                            text: 'Protocol Details',
                            children: [
                            ]
                        }
                    ],
                    '/en_US/v5/config/': [
                        {
                            text: 'Config Reference',
                            children: [
                                'overview',
                                'inbound',
                                'outbound',
                                'proxy',
                                'stream',
                                'service',
                                'dns',
                                'router',
                                'geo',
                            ],
                        },
                        {
                            text: 'Proxy Protocol',
                            children: [
                                'proxy/socks',
                                'proxy/vmess',
                                'proxy/vlite',
                                'proxy/shadowsocks',
                                'proxy/http',
                                'proxy/dokodemo',
                                'proxy/freedom',
                                'proxy/loopback',
                                'proxy/blackhole',
                                'proxy/dns',
                                'proxy/trojan',
                                'proxy/vless',
                            ],
                        },
                        {
                            text: 'Stream Transport Protocol',
                            children: [
                                'stream/tcp',
                                'stream/websocket',
                                'stream/kcp',
                                'stream/quic',
                            ],
                        },
                        {
                            text: 'Service',
                            children: [
                                'service/stats',
                                'service/policy',
                                'service/browser',
                                'service/burstObservatory',
                                'service/backgroundObservatory',
                            ],
                        }
                    ],
                    '/en_US/awesome/tools': ['/en_US/awesome/tools'],
                },
            },
        },
    }),
})
