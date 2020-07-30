module.exports = {
    title: 'V2Fly.org',
    description: 'Project V 是一个工具集合，它可以帮助你打造专属的基础通信网络',
    head: [
        [
            "link",
            {
                rel: "apple-touch-icon",
                size: "180x180",
                href: "/apple-touch-icon.png"
            }
        ],
        [
            "link",
            {
                rel: "icon",
                type: "image/png",
                size: "32x32",
                href: "/favicon-32x32.png"
            }
        ],
        [
            "link",
            {
                rel: "icon",
                type: "image/png",
                size: "16x16",
                href: "/favicon-16x16.png"
            }
        ],
        [
            "link",
            {
                rel: "manifest",
                href: "/site.webmanifest"
            }
        ],
        [
            "link",
            {
                rel: "mask-icon",
                color: "#5bbad5",
                href: "/safari-pinned-tab.svg"
            }
        ],
        [
            "meta",
            {
                name: "apple-mobile-web-app-title",
                content: "Project V"
            }
        ],
        [
            "meta",
            {
                name: "application-name",
                content: "Project V"
            }
        ],
        [
            "meta",
            {
                name: "msapplication-TileColor",
                content: "#da532c"
            }
        ],
        [
            "meta",
            {
                name: "msapplication-TileColor",
                content: "#da532c"
            }
        ]
    ],
    plugins: [
        'vuepress-plugin-mermaidjs',
        '@vuepress/back-to-top'
    ],
    themeConfig: {
        smoothScroll: true,
        logo: '/v2ray.png',
        locales: {
            '/': {
                selectText: '选择语言',
                label: '简体中文',
                editLinkText: '在 GitHub 上编辑此页',
                nav: [
                    {
                        text: '开始',
                        link: '/chapter_00/workflow',
                    },
                    {
                        text: '配置',
                        link: '/chapter_02/01_overview',
                    },
                    {
                        text: '开发',
                        link: '/developer/intro/guide',
                    },
                    { text: '常见问题', link: '/chapter_00/faq' },
                    { text: '工具列表', link: '/awesome/tools' },
                    { text: '新白话文指南', link: 'https://guide.v2fly.org/' },
                    { text: 'GitHub', link: 'https://github.com/v2fly/v2ray-core' },
                ],
                sidebar: {
                    '/chapter_00/faq': 'auto',
                    '/chapter_00/help': 'auto',
                    '/chapter_00/': [
                        'workflow',
                        'install',
                        'start',
                        'command',
                    ],

                    '/chapter_02/': [
                        {
                            title: '配置文件',
                            collapsable: false,
                            children: [
                                '01_overview',
                                'multiple_config',
                                'policy',
                                '03_routing',
                                '04_dns',
                                'mux',
                                'api',
                                'stats',
                                'reverse',
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
                                'protocols/mtproto',
                                'protocols/shadowsocks',
                                'protocols/socks',
                                'protocols/vmess',
                            ],
                        },
                        {
                            title: '传输方式',
                            collapsable: false,
                            children: [
                                '05_transport',
                                'transport/tcp',
                                'transport/mkcp',
                                'transport/websocket',
                                'transport/h2',
                                'transport/domainsocket',
                                'transport/quic',
                            ],
                        },
                    ],
                    '/developer/': [
                        {
                            title: '开发手册',
                            collapsable: false,
                            children: [
                                'intro/guide',
                                'intro/design',
                                'intro/compile',
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
            '/en/': {
                selectText: 'Languages',
                label: 'English',
                ariaLabel: 'Languages',
                editLinkText: 'Edit this page on GitHub',
                nav: [
                    { text: 'Home', link: '/' },
                    { text: 'Guide', link: '/guide/' },
                    { text: 'Developer', link: '/developer/' },
                    { text: 'GitHub', link: 'https://github.com/v2fly/v2ray-core' },
                ],
            },
        },
        sidebar: 'auto',
    },
}
