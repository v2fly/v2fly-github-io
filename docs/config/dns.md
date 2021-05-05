# DNS 域名解析

V2Ray 内建了一个 DNS 模块，其主要用途为：对目标地址（域名）进行 DNS 解析，同时为 IP 路由规则匹配提供判断依据。

:::tip
由于 DNS 协议的复杂性，V2Ray 只支持最基本的 IP 查询（A 和 AAAA 记录）。如需完整的 DNS 功能，推荐使用 [CoreDNS](https://coredns.io)。
:::

:::warning
在 `freedom` 协议的 `outbound` 中，`domainStrategy` 默认值为 `AsIs`，不会使用本 DNS 模块进行目标地址解析。如需使用，应配置为 `UseIP`、`UseIPv4` 或 `UseIPv6`。
:::

## DNS 处理流程

若当前要查询的域名：

- 命中了 `hosts` 中的「域名 - IP」、「域名 - IP 数组」映射，则将该 IP 或 IP 数组作为 DNS 解析结果返回。
- 命中了 `hosts` 中的「域名 - 域名」映射，则该映射的值（另一个域名）将作为当前要查询的新域名，进入 DNS 处理流程，直到解析出 IP 后返回，或返回空解析。
- 没有命中 `hosts`，但命中了某（几）个 DNS 服务器中的 `domains` 域名列表，则按照命中的规则的优先级，依次使用该规则对应的 DNS 服务器进行查询。若命中的 DNS 服务器查询失败，或 `expectIPs` 不匹配，则使用下一个命中的 DNS 服务器进行查询；否则返回解析得到的 IP。若所有命中的 DNS 服务器均查询失败，此时 DNS 模块：
  - 默认会进行 「DNS 回退（fallback）查询」：使用「上一轮失败查询中未被使用的、且 `skipFallback` 为默认值 `false` 的 DNS 服务器」依次查询。若查询失败，或 `expectIPs` 不匹配，返回空解析；否则返回解析得到的 IP。
  - 若 `disableFallback` 设置为 `true`，则不会进行「DNS 回退（fallback）查询」。
- 既没有命中 `hosts`，又没有命中 DNS 服务器中的 `domains` 域名列表，则：
  - 默认使用「`skipFallback` 为默认值 `false` 的 DNS 服务器」依次查询。若第一个被选中的 DNS 服务器查询失败，或 `expectIPs` 不匹配，则使用下一个被选中的 DNS 服务器进行查询；否则返回解析得到的 IP。若所有被选中的 DNS 服务器均查询失败，返回空解析。
  - 若「`skipFallback` 为默认值 `false` 的 DNS 服务器」数量为 0 或 `disableFallback` 设置为 `true`，则使用 DNS 配置中的第一个 DNS 服务器进行查询。查询失败或不匹配 `expectIPs` 列表，返回空解析；否则返回解析得到的 IP。

DNS 处理流程示意图如下：

![DNS resolution process](/dns_flowchart_20210418.svg)

## DnsObject

`DnsObject` 对应配置文件的 `dns` 项。

```json
{
    "hosts": {
        "baidu.com": "127.0.0.1",
        "example.com": [
            "127.0.0.1",
            "::1",
            "proxy.example.com",
            "127.0.0.2"
        ],
        "dns.google": "8.8.8.8",
        "proxy.example.com": "127.0.0.1",
        "geosite:test": [
            "another-proxy.example.com",
            "127.0.0.1"
        ],
        "geosite:category-ads-all": [
            "127.0.0.1",
            "127.0.0.2",
            "::1"
        ]
    },
    "servers": [
        "https://dns.google/dns-query",
        {
            "address": "223.5.5.5",
            "port": 5353,
            "clientIp": "5.6.7.8",
            "skipFallback": true,
            "domains": [
                "domain:baidu.com",
                "geosite:cn"
            ],
            "expectIPs": [
                "geoip:cn",
                "ext:customizedGeoIPFile.dat:cn",
                "ext-ip:customizedGeoIPFile.dat:cn"
            ]
        },
        {
            "address": "fakedns",
            "domains": [
                "domain:v2fly.org",
                "geosite:geolocation-!cn"
            ]
        },
        {
            "address": "https://1.1.1.1/dns-query",
            "domains": [
                "domain:v2fly.org",
                "geosite:geolocation-!cn"
            ],
            "expectIPs": [
                "geoip:!cn",
                "ext:customizedGeoIPFile.dat:!cn",
                "ext-ip:customizedGeoIPFile.dat:!cn"
            ]
        },
        "1.0.0.1",
        "localhost"
    ],
    "clientIp": "1.2.3.4",
    "queryStrategy": "UseIPv4",
    "disableCache": true,
    "disableFallback": true,
    "tag": "dns_inbound"
}
```

> `hosts`: map{string: address} | map{string: \[address\]}

域名与地址的映射，其值可为「域名与单个地址」的映射、「域名与多个地址（地址数组）的映射」(v4.37.3+)，其中地址可以是 IP 或域名。

在解析域名时，如果域名匹配这个列表中的某一项，当该项的地址为 IP 时，则解析结果为该项的 IP，而不会进行后续的 DNS 解析；当该项的地址为域名时，会使用此域名进行后续的 DNS 解析，而不使用原始域名。

:::tip
当地址中同时设置了多个 IP 和域名，则只会返回第一个域名，其余 IP 和域名均被忽略。
:::

域名的格式有以下几种形式：

- **纯字符串**：当此域名完整匹配目标域名时，该规则生效。例如 `v2ray.com` 匹配 `v2ray.com` 但不匹配 `www.v2ray.com`。
- **正则表达式**：由 `regexp:` 开始，余下部分是一个正则表达式。当此正则表达式匹配目标域名时，该规则生效。例如 `regexp:\.goo.*\.com$` 匹配 `www.google.com`、`fonts.googleapis.com`，但不匹配 `google.com`。
- **子域名 (推荐)**：由 `domain:` 开始，余下部分是一个域名。当此域名是目标域名或其子域名时，该规则生效。例如 `domain:v2ray.com` 匹配 `www.v2ray.com`、`v2ray.com`，但不匹配 `xv2ray.com`。
- **子串**：由 `keyword:` 开始，余下部分是一个字符串。当此字符串匹配目标域名中任意部分，该规则生效。比如 `keyword:sina.com` 可以匹配 `sina.com`、`sina.com.cn`、`www.sina.com` 和 `www.sina.company`，但不匹配 `sina.cn`。
- **预定义域名列表**：由 `geosite:` 开头，余下部分是一个名称，如 `geosite:google` 或者 `geosite:cn`。名称及域名列表参考 [预定义域名列表](routing.md#预定义域名列表)。

> `servers`: \[string | [ServerObject](#serverobject) \]

一个 DNS 服务器列表，支持的类型有两种：DNS 地址（字符串形式）和 [ServerObject](#serverobject) 。

当值为一个 IP 地址时，如 `8.8.8.8`，V2Ray 会使用此地址的 53 端口进行 UDP 协议的 DNS 查询。

当值为 `localhost` 时，表示使用本机预设的 DNS 配置。

当值为 `https://host:port/dns-query` 的形式，如 `https://dns.google/dns-query`，V2Ray 会使用 DNS over HTTPS（RFC8484, 简称 DOH）进行查询。DOH 请求不会经过 `Routing` 路由组件，默认会使用第一个 `outbound`。有些服务商拥有 IP 别名的证书，可以直接写 IP 形式，比如 `https://1.1.1.1/dns-query`，也可使用非标准端口和路径，如 `https://a.b.c.d:8443/my-dns-query`。(4.22.0+)

当值为 `https+local://host:port/dns-query` 的形式，如 `https+local://dns.google/dns-query`，V2Ray 会使用 DNS over HTTPS 本地模式进行查询，即 DOHL 请求不会经过 `Routing` 和 `Outbound` 等组件，直接对外请求，以降低耗时。一般适合在服务端使用，也可使用非标准端口和路径。(4.22.0+)

当值为 `quic+local://host` 的形式，如 `quic+local://dns.adguard.com`，V2Ray 会使用 DNS over QUIC 本地模式进行查询，即 DOQ 请求不会经过 `Routing` 和 `Outbound` 等组件，直接对外请求，以降低耗时。目前（2021 年 1 月 4 日），公共 DNS 中支持 DOQ 协议的只有 `dns.adguard.com`，默认使用端口 784。(4.34.0+)

当值为 `fakedns` 时，表示使用 V2Ray 内建的虚拟 DNS 服务器。详情见[虚拟 DNS 服务器](fakedns.md)(4.35.0+)

:::tip
当使用 `localhost` 时，本机的 DNS 请求不受 V2Ray 控制，需要额外的配置才可以使 DNS 请求由 V2Ray 转发。
:::

:::warning
如果在 Linux 设备上使用 DNS over QUIC，可能需要调整接受缓冲区大小，下面的命令将其设置为 2.5 MB

```shell
sysctl -w net.core.rmem_max=2500000
```

Reference: [https://github.com/lucas-clemente/quic-go/wiki/UDP-Receive-Buffer-Size](https://github.com/lucas-clemente/quic-go/wiki/UDP-Receive-Buffer-Size)
:::

> `clientIp`: string

当前网络的 IP 地址。用于 DNS 查询时通知 DNS 服务器，客户端所在的地理位置（不能是私有 IP 地址）。

:::tip
此功能需要 DNS 服务器支持 EDNS Client Subnet（RFC7871）。
:::

> `queryStrategy`: "UseIP" | "UseIPv4" | "UseIPv6"

(4.37.0+) DNS 查询所使用的网络类型。默认值为 `UseIP`，即 DNS 同时查询域名的 A 和 AAAA 记录。`UseIPv4` 和 `UseIPv6` 分别为只查询 A 记录、只查询 AAAA 记录。

:::tip
建议没有 IPv6 网络的用户，设置为 `UseIPv4`。本选项与 `freedom` 协议 `outbound` 中的 `domainStrategy` 选项优先级相同，建议同时设置为 `UseIPv4`。
:::

:::warning
如果本选项设置为 `UseIPv4`，而 `freedom` 协议 `outbound` 中的 `domainStrategy` 选项设置为 `UseIPv6`，会导致从 `freedom` 协议 `outbound` 发出的连接的 DNS 查询被 Go 运行时接管，进而导致 DNS 泄漏；反之同理。
:::

> `disableCache`: bool

(4.35.0+) 禁用 DNS 缓存。默认为 false，即为不禁用。

> `disableFallback`: bool

(4.37.2+) 禁用 DNS 回退（fallback）查询。默认为 false，即为不禁用。详情见 [DNS 处理流程](#dns-处理流程)。

:::warning
如果本选项设置为 `true`，则 [ServerObject](#serverobject) 中的 `skipFallback` 均不会生效。
:::

> `tag`: string

（V2Ray 4.13+）由此 DNS 发出的查询流量，除 `localhost` 和 `DOHL_` 模式外，都会带有此标识，可在路由使用 `inboundTag` 进行匹配。

## ServerObject

```json
{
    "address": "223.5.5.5",
    "port": 5353,
    "clientIp": "5.6.7.8",
    "skipFallback": true,
    "domains": [
        "domain:baidu.com",
        "geosite:cn"
    ],
    "expectIPs": [
        "geoip:cn",
        "ext:customizedGeoIPFile.dat:cn",
        "ext-ip:customizedGeoIPFile.dat:cn"
    ]
}
```

> `address`: address

DNS 服务器地址，如 `8.8.8.8`。对于普通 DNS IP 地址只支持 UDP 协议的 DNS 服务器，若地址是以 `https://` 或 `https+local://` 开头的 URL 形式，则使用 DOH 模式，规则同字符串模式的 DOH 配置。

> `port`: number

DNS 服务器端口，如 `53`。此项缺省时默认为 `53`。当使用 DOH、DOHL、DOQL 模式时，该项无效。非标准端口应在 URL 中指定。

> `clientIp`: string

当前网络的 IP 地址。用于 DNS 查询时通知 DNS 服务器，客户端所在的地理位置（不能是私有 IP 地址）。此处 `clientIp` 的优先级高于外层配置的 `clientIp`，由此可实现「使用不同的 `clientIp` 从相同的 DNS 服务器获取同一域名在不同地区的解析结果」。 (4.34.0+)

:::tip
此功能需要 DNS 服务器支持 EDNS Client Subnet（RFC7871）。
:::

> `skipFallback`: bool

(4.37.2+) 在 DNS 回退（fallback）查询过程中，是否跳过本 DNS。默认为 false，即为不跳过。详情见 [DNS 处理流程](#dns-处理流程)。

:::tip
本选项可用于防止 DNS 回退（fallback）查询 `A` 和 `AAAA` 记录过程中的 DNS 泄漏。
:::

:::warning
如果 [DnsObject](#dnsobject) 中的 `disableFallback` 设置为 `true`，则本选项不会生效。
:::

> `domains`: \[string\]

一个域名列表，此列表包含的域名，将优先使用此服务器进行查询。域名格式和[路由配置](routing.md#ruleobject)中相同。

> `expectIPs`:\[string\]

（V2Ray 4.22.0+）一个 IP 范围列表，格式和[路由配置](routing.md#ruleobject)中相同。

当配置此项时，V2Ray DNS 会对返回的 IP 进行校验，只返回满足 expectIPs 列表的地址。如果未配置此项，会原样返回 IP 地址。
