module.exports = {
    head: [
        ["link", {rel: "apple-touch-icon", size: "180x180", href: "/apple-touch-icon.png"}],
        ["link", {rel: "icon", type: "image/png", size: "32x32", href: "/favicon-32x32.png"}],
        ["link", {rel: "icon", type: "image/png", size: "16x16", href: "/favicon-16x16.png"}],
        ["link", {rel: "manifest", href: "/site.webmanifest"}],
        ["link", {rel: "mask-icon", color: "#5bbad5", href: "/safari-pinned-tab.svg"}],
        ["meta", {name: "viewport", content: "width=device-width,initial-scale=1.0"}],
        ["meta", {name: "apple-mobile-web-app-title", content: "Project V"}],
        ["meta", {name: "application-name", content: "Project V"}],
        ["meta", {name: "msapplication-TileColor", content: "#da532c"}],
        ["meta", {name: "msapplication-TileColor", content: "#da532c"}]
    ],
    plugins: [
        'vuepress-plugin-mermaidjs',
        '@vuepress/back-to-top',
         ['@kidonng/vuepress-plugin-contributors', { api: 'https://api.v2fly.org/apis/github-file-contributors' }]
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
    evergreen: true,
    themeConfig: {
        repo: 'v2fly',
        docsRepo: 'v2fly/v2fly-github-io',
        logo: '/v2ray.png',
        algolia: {
            apiKey: '1c152ce7991c1da9adc5413104712c5a',
            indexName: 'v2fly'
        },
        smoothScroll: true,
        docsDir: 'docs',
        editLinks: true,
        locales: {
            '/': {
                selectText: 'Languages',
                label: '简体中文',
                ariaLabel: 'Select language',
                editLinkText: '在 GitHub 上编辑此页',
                lastUpdated: '上次更新',
                contributorsLabel: '贡献者',
                nav: [
                    {text: '快速开始', link: '/guide/start',},
                    {text: '配置文档', link: '/v5/config/overview',},
                    {text: '工具列表', link: '/awesome/tools'},
                    {text: '开发手册', link: '/developer/intro/compile',},
                    {text: '新白话文指南', link: 'https://guide.v2fly.org/'},
                ],
                sidebar: {
                    '/guide/': [
                        {
                            title: '快速开始',
                            collapsable: false,
                            children: [
                                'install',
                                'start',
                            ],
                        },
                        {
                            title: '原理',
                            collapsable: false,
                            children: [
                                'workflow',
                                'command',
                            ],
                        },
                        {
                            title: '更多',
                            collapsable: false,
                            children: [
                                'faq',
                                'help',
                            ],
                        },
                    ],
                    '/config/': [
                        {
                            title: '配置文件',
                            collapsable: false,
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
                            title: '协议列表',
                            collapsable: false,
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
                            title: '传输方式',
                            collapsable: false,
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
                            title: '开发手册',
                            collapsable: false,
                            children: [
                                'intro/compile',
                                'intro/design',
                                'intro/guide',
                            ]
                        },
                        {
                            title: '协议细节',
                            collapsable: false,
                            children: [
                                'protocols/vmess',
                                'protocols/mkcp',
                                'protocols/muxcool',
                            ]
                        }
                    ],
                    '/': 'auto',
                },
            },
            '/en_US/': {
                label: 'English',
                selectText: '选择语言',
                ariaLabel: '选择语言',
                editLinkText: 'Edit this page on GitHub',
                lastUpdated: 'Last Updated',
                nav: [
                    {text: 'Quick Start', link: '/en_US/guide/start',},
                    {text: 'Config Reference', link: '/en_US/v5/config/overview',},
                    {text: 'Tools', link: '/en_US/awesome/tools'},
                    {text: 'Developer Guide', link: '/en_US/developer/intro/compile',},
                    {text: 'New concise guide', link: 'https://guide.v2fly.org/'},
                ],
                sidebar: {
                    '/en_US/guide/': [
                        {
                            title: 'Quick Start',
                            collapsable: false,
                            children: [
                                'install',
                                'start',
                            ],
                        },
                        {
                            title: 'Concept',
                            collapsable: false,
                            children: [
                                'workflow',
                            ],
                        },
                        {
                            title: 'More',
                            collapsable: false,
                            children: [
                                'faq',
                            ],
                        },
                    ],
                    '/en_US/config/': [
                        {
                            title: 'Config Reference',
                            collapsable: false,
                            children: [
                                'overview',
                                'dns',
                                'outbounds',
                            ],
                        },
                        {
                            title: 'Protocols',
                            collapsable: false,
                            children: [
                                'protocols/blackhole',
                                'protocols/dns',
                                'protocols/dokodemo',
                                'protocols/freedom',
                            ],
                        },
                        {
                            title: 'Transport',
                            collapsable: false,
                            children: [
                            ],
                        },
                    ],
                    '/en_US/developer/': [
                        {
                            title: 'Developer Guide',
                            collapsable: false,
                            children: [
                                'intro/compile',
                                'intro/design',
                                'intro/guide',
                            ]
                        },
                        {
                            title: 'Protocol Details',
                            collapsable: false,
                            children: [
                            ]
                        }
                    ],
                    '/en_US/v5/config/': [
                        {
                            title: 'Config Reference',
                            collapsable: false,
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
                            title: 'Proxy Protocol',
                            collapsable: false,
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
                            title: 'Stream Transport Protocol',
                            collapsable: false,
                            children: [
                                'stream/tcp',
                                'stream/websocket',
                                'stream/kcp',
                                'stream/quic',
                            ],
                        },
                        {
                            title: 'Service',
                            collapsable: false,
                            children: [
                                'service/stats',
                                'service/policy',
                                'service/browser',
                                'service/burstObservatory',
                                'service/backgroundObservatory',
                            ],
                        }
                    ],
                    '/en_US/': 'auto',
                },
            },
        },
    },
}
