module.exports = {
    title: 'Project V',
    description: 'Project V 是一个工具集合，它可以帮助你打造专属的基础通信网络',
    plugins: [
        'vuepress-plugin-mermaidjs'
    ],

    themeConfig: {
        sidebar: 'auto',
        smoothScroll: true,
        logo: 'v2ray_1024.png',
        locales: {
            '/': {
                selectText: '选择语言',
                label: '简体中文',
                editLinkText: '在 GitHub 上编辑此页',
                nav: [
                    {
                        text: '起步',
                        items: [
                            {text: '使用方式', link: '/chapter_00/workflow'},
                            {text: '下载安装', link: '/chapter_00/install'},
                            {text: '新手上路', link: '/chapter_00/start'},
                            {text: '命令参数', link: '/chapter_00/command'},
                        ]
                    },
                    {
                        text: '配置文件',
                        items: [
                            {text: '文件格式', link: '/chapter_02/01_overview'},
                            {text: '协议列表', link: '/chapter_02/01_overview'},
                            {text: '策略', link: '/chapter_02/policy'},
                            {text: '路由', link: '/chapter_02/03_routing'},
                            {text: 'DNS 配置', link: '/chapter_02/04_dns'},
                            {text: 'Mux 配置', link: '/chapter_02/mux'},
                            {text: 'API 配置', link: '/chapter_02/api'},
                            {text: '统计信息', link: '/chapter_02/stats'},
                            {text: '反向代理', link: '/chapter_02/reverse'},
                            {text: '传输配置', link: '/chapter_02/reverse'},
                        ]
                    },
                    {
                        text: '协议列表',
                        items: [
                            {text: 'Blackhole', link: '/chapter_02/protocols/blackhole'},
                            {text: 'Dns', link: '/chapter_02/protocols/dns'},
                            {text: 'Dokodemo', link: '/chapter_02/protocols/dokodemo'},
                            {text: 'Http', link: '/chapter_02/protocols/http'},
                            {text: 'MTProto', link: '/chapter_02/protocols/mtproto'},
                            {text: 'Shadowsocks', link: '/chapter_02/protocols/shadowsocks'},
                            {text: 'Socks', link: '/chapter_02/protocols/socks'},
                            {text: 'Vmess', link: '/chapter_02/protocols/vmess'},
                        ]
                    },
                    {
                        text: '传输配置',
                        items: [
                            {text: 'TCP', link: '/chapter_02/transport/tcp'},
                            {text: 'mKCP', link: '/chapter_02/transport/mkcp'},
                            {text: 'WebSocket', link: '/chapter_02/transport/websocket'},
                            {text: 'HTTP/2', link: '/chapter_02/transport/h2'},
                            {text: 'DomainSocket', link: '/chapter_02/transport/domainsocket'},
                            {text: 'QUIC', link: '/chapter_02/transport/quic'},
                        ]
                    },
                    {
                        text: '开发手册',
                        items: [
                            {text: '开发指引', link: '/developer/intro/guide'},
                            {text: '核心设计', link: '/developer/intro/design'},
                            {text: '配置开发环境', link: '/developer/intro/compile'},
                            {
                                text: '协议细节', items: [
                                    {text: 'Vmess 协议', link: '/developer/protocols/vmess'},
                                    {text: 'mKCP 协议', link: '/developer/protocols/mkcp'},
                                    {text: 'Mux.Cool 协议', link: '/developer/protocols/muxcoll'},
                                ]
                            },
                        ]
                    },
                    {text: '常见问题', link: '/chapter_00/faq'},
                    {text: 'Github', link: 'https://github.com/v2fly/v2ray-core'},
                ],
            },
            '/en/': {
                selectText: 'Languages',
                label: 'English',
                ariaLabel: 'Languages',
                editLinkText: 'Edit this page on GitHub',
                nav: [
                    {text: 'Home', link: '/'},
                    {text: 'Guide', link: '/guide/'},
                    {text: 'Developer', link: '/developer/'},
                    {text: 'Github', link: 'https://github.com/v2fly/v2ray-core'},
                ],
            },
        }
    },
}