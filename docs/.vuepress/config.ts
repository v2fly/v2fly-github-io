import {defineUserConfig} from 'vuepress'
import {defaultTheme} from '@vuepress/theme-default'
import {docsearchPlugin} from '@vuepress/plugin-docsearch'
import {registerComponentsPlugin} from '@vuepress/plugin-register-components'
import { getDirname, path } from '@vuepress/utils'
import { viteBundler } from '@vuepress/bundler-vite'

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
    bundler: viteBundler({
        viteOptions: {},
        vuePluginOptions: {},
    }),
    theme: defaultTheme({
        repo: 'v2fly',
        docsRepo: 'v2fly/v2fly-github-io',
        logo: '/v2ray.png',
        docsDir: 'docs',
        docsBranch: 'master',
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
                    { text: '配置文档', link: '/config/overview', },
                    { text: '配置文档 (v5, WIP)', link: '/v5/config/overview', },
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
                                '/config/overview',
                                '/config/env',
                                '/config/dns',
                                '/config/routing',
                                '/config/policy',
                                '/config/inbounds',
                                '/config/outbounds',
                                '/config/transport',
                                '/config/api',
                                '/config/stats',
                                '/config/reverse',
                                '/config/multiple_config',
                                '/config/fakedns',
                                '/config/browserforwarder',
                                '/config/observatory',
                            ],
                        },
                        {
                            text: '协议列表',
                            children: [
                                '/config/protocols/blackhole',
                                '/config/protocols/dns',
                                '/config/protocols/dokodemo',
                                '/config/protocols/freedom',
                                '/config/protocols/http',
                                '/config/protocols/socks',
                                '/config/protocols/vmess',
                                '/config/protocols/shadowsocks',
                                '/config/protocols/trojan',
                                '/config/protocols/vless',
                                '/config/protocols/loopback',
                                '/config/protocols/hy2',
                            ],
                        },
                        {
                            text: '传输方式',
                            children: [
                                '/config/transport/tcp',
                                '/config/transport/mkcp',
                                '/config/transport/websocket',
                                '/config/transport/h2',
                                '/config/transport/quic',
                                '/config/transport/domainsocket',
                                '/config/transport/grpc',
                                '/config/transport/hy2',
                            ],
                        },
                        {
                            text: '服务',
                            children: [
                                '/config/service/stats',
                                '/config/service/policy',
                                '/config/service/browser',
                                '/config/service/burstObservatory',
                                '/config/service/backgroundObservatory',
                                '/config/service/tun',
                                '/config/service/subscription',
                            ],
                        }
                    ],
                    '/developer/': [
                        {
                            text: '开发手册',
                            children: [
                                '/developer/intro/compile',
                                '/developer/intro/design',
                                '/developer/intro/guide',
                                '/developer/intro/releasearchive',
                                '/developer/intro/releasesigning',
                            ]
                        },
                        {
                            text: '协议细节',
                            children: [
                                '/developer/protocols/vmess',
                                '/developer/protocols/mkcp',
                                '/developer/protocols/muxcool',
                            ]
                        }
                    ],
                    "/v5/config/": [
                        {
                            text: '配置参考',
                            children: [
                                '/v5/config/overview',
                                '/v5/config/inbound',
                                '/v5/config/outbound',
                                '/v5/config/proxy',
                                '/v5/config/stream',
                                '/v5/config/service',
                                '/v5/config/dns',
                                '/v5/config/router',
                                '/v5/config/geo',
                            ],
                        },
                        {
                            text: '代理协议',
                            children: [
                                '/v5/config/proxy/blackhole',
                                '/v5/config/proxy/dns',
                                '/v5/config/proxy/dokodemo',
                                '/v5/config/proxy/freedom',
                                '/v5/config/proxy/http',
                                '/v5/config/proxy/socks',
                                '/v5/config/proxy/vmess',
                                '/v5/config/proxy/vlite',
                                '/v5/config/proxy/shadowsocks',
                                '/v5/config/proxy/shadowsocks2022',
                                '/v5/config/proxy/trojan',
                                '/v5/config/proxy/hy2',
                                '/v5/config/proxy/vless',
                                '/v5/config/proxy/loopback',
                            ],
                        },
                        {
                            text: '传输流协议',
                            children: [
                                '/v5/config/stream/tcp',
                                '/v5/config/stream/websocket',
                                '/v5/config/stream/kcp',
                                '/v5/config/stream/grpc',
                                '/v5/config/stream/quic',
                                '/v5/config/stream/meek',
                                '/v5/config/stream/httpupgrade',
                                '/v5/config/stream/hy2',
                                '/v5/config/stream/mekya',
                            ],
                        },
                        {
                            text: '服务',
                            children: [
                                '/v5/config/service/stats',
                                '/v5/config/service/policy',
                                '/v5/config/service/browser',
                                '/v5/config/service/burstObservatory',
                                '/v5/config/service/backgroundObservatory',
                                '/v5/config/service/tun',
                                '/v5/config/service/subscription',
                                '/v5/config/service/filesystemstorage',
                            ],
                        }
                    ],
                    '/awesome/tools': ['/awesome/tools'],
                },
            },
            '/en_US/': {
                selectLanguageText: '选择语言',
                selectLanguageName: 'English',
                selectLanguageAriaLabel: '选择语言',
                editLinkText: 'Edit this page on GitHub',
                lastUpdatedText: 'Last Updated',
                contributorsText: 'Contributors',
                navbar: [
                    { text: 'Quick Start', link: '/en_US/guide/start', },
                    { text: 'Config Reference', link: '/en_US/config/overview', },
                    { text: 'Config Reference (v5, WIP)', link: '/en_US/v5/config/overview', },
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
                                'command',
                            ],
                        },
                        {
                            text: 'More',
                            children: [
                                'faq',
                                'help',
                            ],
                        },
                    ],
                    '/en_US/config/': [
                        {
                            text: 'Config Reference',
                            children: [
                                '/en_US/config/overview',
                                '/en_US/config/env',
                                '/en_US/config/dns',
                                '/en_US/config/routing',
                                '/en_US/config/policy',
                                '/en_US/config/inbounds',
                                '/en_US/config/outbounds',
                                '/en_US/config/transport',
                                '/en_US/config/api',
                                '/en_US/config/stats',
                                '/en_US/config/reverse',
                                '/en_US/config/multiple_config',
                                '/en_US/config/fakedns',
                                '/en_US/config/browserforwarder',
                                '/en_US/config/observatory',
                            ],
                        },
                        {
                            text: 'Protocols',
                            children: [
                                '/en_US/config/protocols/blackhole',
                                '/en_US/config/protocols/dns',
                                '/en_US/config/protocols/dokodemo',
                                '/en_US/config/protocols/freedom',
                                '/en_US/config/protocols/http',
                                '/en_US/config/protocols/socks',
                                '/en_US/config/protocols/vmess',
                                '/en_US/config/protocols/shadowsocks',
                                '/en_US/config/protocols/trojan',
                                '/en_US/config/protocols/vless',
                                '/en_US/config/protocols/loopback',
                                '/en_US/config/protocols/hy2',
                            ],
                        },
                        {
                            text: 'Transport',
                            children: [
                                '/en_US/config/transport/tcp',
                                '/en_US/config/transport/mkcp',
                                '/en_US/config/transport/websocket',
                                '/en_US/config/transport/h2',
                                '/en_US/config/transport/quic',
                                '/en_US/config/transport/domainsocket',
                                '/en_US/config/transport/grpc',
                                '/en_US/config/transport/hy2',
                            ],
                        },
                        {
                            text: 'Service',
                            children: [
                                '/en_US/config/service/stats',
                                '/en_US/config/service/policy',
                                '/en_US/config/service/browser',
                                '/en_US/config/service/burstObservatory',
                                '/en_US/config/service/backgroundObservatory',
                                '/en_US/config/service/tun',
                                '/en_US/config/service/subscription',
                            ],
                        }
                    ],
                    '/en_US/developer/': [
                        {
                            text: 'Developer Guide',
                            children: [
                                '/en_US/developer/intro/compile',
                                '/en_US/developer/intro/design',
                                '/en_US/developer/intro/guide',
                                '/en_US/developer/intro/releasearchive',
                                '/en_US/developer/intro/releasesigning',
                            ]
                        },
                        {
                            text: 'Protocol Details',
                            children: [
                                '/en_US/developer/protocols/vmess',
                                '/en_US/developer/protocols/mkcp',
                                '/en_US/developer/protocols/muxcool',
                            ]
                        }
                    ],
                    '/en_US/v5/config/': [
                        {
                            text: 'Config Reference',
                            children: [
                                '/en_US/v5/config/overview',
                                '/en_US/v5/config/inbound',
                                '/en_US/v5/config/outbound',
                                '/en_US/v5/config/proxy',
                                '/en_US/v5/config/stream',
                                '/en_US/v5/config/service',
                                '/en_US/v5/config/dns',
                                '/en_US/v5/config/router',
                                '/en_US/v5/config/geo',
                            ],
                        },
                        {
                            text: 'Proxy Protocol',
                            children: [
                                '/en_US/v5/config/proxy/blackhole',
                                '/en_US/v5/config/proxy/dns',
                                '/en_US/v5/config/proxy/dokodemo',
                                '/en_US/v5/config/proxy/freedom',
                                '/en_US/v5/config/proxy/http',
                                '/en_US/v5/config/proxy/socks',
                                '/en_US/v5/config/proxy/vmess',
                                '/en_US/v5/config/proxy/vlite',
                                '/en_US/v5/config/proxy/shadowsocks',
                                '/en_US/v5/config/proxy/shadowsocks2022',
                                '/en_US/v5/config/proxy/trojan',
                                '/en_US/v5/config/proxy/hy2',
                                '/en_US/v5/config/proxy/vless',
                                '/en_US/v5/config/proxy/loopback',
                            ],
                        },
                        {
                            text: 'Stream Transport Protocol',
                            children: [
                                '/en_US/v5/config/stream/tcp',
                                '/en_US/v5/config/stream/websocket',
                                '/en_US/v5/config/stream/kcp',
                                '/en_US/v5/config/stream/grpc',
                                '/en_US/v5/config/stream/quic',
                                '/en_US/v5/config/stream/meek',
                                '/en_US/v5/config/stream/httpupgrade',
                                '/en_US/v5/config/stream/hy2',
                                '/en_US/v5/config/stream/mekya',
                            ],
                        },
                        {
                            text: 'Service',
                            children: [
                                '/en_US/v5/config/service/stats',
                                '/en_US/v5/config/service/policy',
                                '/en_US/v5/config/service/browser',
                                '/en_US/v5/config/service/burstObservatory',
                                '/en_US/v5/config/service/backgroundObservatory',
                                '/en_US/v5/config/service/tun',
                                '/en_US/v5/config/service/subscription',
                                '/en_US/v5/config/service/filesystemstorage',
                            ],
                        }
                    ],
                    '/en_US/awesome/tools': ['/en_US/awesome/tools'],
                },
            },
        },
    }),
})
