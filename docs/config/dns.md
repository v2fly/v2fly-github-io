# DNS 服务器

V2Ray 内置了一个 DNS 服务器，其有两大主要用途：根据域名解析的 IP 匹配路由规则，以及传统的 DNS 功能——解析目标地址进行连接。

由此 DNS 服务器所发出的 DNS 查询请求，会自动根据路由配置进行转发，无需额外配置。

:::tip
由于 DNS 协议的复杂性，V2Ray 只支持最基本的 IP 查询（A 和 AAAA 记录）。推荐使用本机 DNS 配合一个额外的 DNS 服务器来做 DNS 查询，如 [CoreDNS](https://coredns.io/)，以使用完整的 DNS 功能。
:::

:::warning
注意：在 `freedom` 协议的 `outbound` 中，`domainStrategy` 默认值为 `AsIs`，不会使用本 DNS 服务器进行目的地址解析，如果需要使用应配置为 `UseIP`。
:::

## DNS 处理流程

当某个 DNS 服务器指定的域名列表匹配了当前要查询的域名，V2Ray 会优先使用这个 DNS 服务器进行查询，否则按从上往下的顺序进行查询，同时只返回匹配 expectIPs 的 IP 列表。

DNS 服务器的处理流程示意图如下：

![](/dns_flowchart.svg)

## DnsObject

`DnsObject` 对应配置文件的 `dns` 项。

```json
{
    "hosts": {
        "baidu.com": "127.0.0.1"
    },
    "servers": [
        {
            "address": "11.22.33.44",
            "port": 5353,
            "clientIp": "5.6.7.8",
            "domains": [
                "domain:v2fly.org",
                "geosite:cn"
            ],
            "expectIPs": [
                "geoip:cn"
            ]
        },
    "8.8.8.8",
    "8.8.4.4",
    "localhost"
    ],
    "clientIp": "1.2.3.4",
    "tag": "dns_inbound"
}
```

> `hosts`: map{string: address}

静态 IP 列表，其值为一系列的 "域名": "地址"。其中地址可以是 IP 或者域名。在解析域名时，如果域名匹配这个列表中的某一项，当该项的地址为 IP 时，则解析结果为该项的 IP，而不会使用下述的 servers 进行解析；当该项的地址为域名时，会使用此域名进行 IP 解析，而不使用原始域名。

域名的格式有以下几种形式：

* 纯字符串：当此域名完整匹配目标域名时，该规则生效。例如 "v2ray.com" 匹配 "v2ray.com" 但不匹配 "www.v2ray.com"。
* 正则表达式：由 `"regexp:"` 开始，余下部分是一个正则表达式。当此正则表达式匹配目标域名时，该规则生效。例如 "regexp:\\\\.goo.*\\\\.com$" 匹配 "www.google.com"、"fonts.googleapis.com"，但不匹配 "google.com"。
* 子域名 (推荐)：由 `"domain:"` 开始，余下部分是一个域名。当此域名是目标域名或其子域名时，该规则生效。例如 "domain:v2ray.com" 匹配 "www.v2ray.com"、"v2ray.com"，但不匹配 "xv2ray.com"。
* 子串：由 `"keyword:"` 开始，余下部分是一个字符串。当此字符串匹配目标域名中任意部分，该规则生效。比如 "keyword:sina.com" 可以匹配 "sina.com"、"sina.com.cn" 和 "www.sina.com"，但不匹配 "sina.cn"。
* 预定义域名列表：由 `"geosite:"` 开头，余下部分是一个名称，如 `geosite:google` 或者 `geosite:cn`。名称及域名列表参考 [预定义域名列表](routing.md#dlc)。

> `servers`: \[string | [ServerObject](#serverobject) \]

一个 DNS 服务器列表，支持的类型有两种：DNS 地址（字符串形式）和 [ServerObject](#serverobject) 。

当它的值是一个 DNS IP 地址时，如 `"8.8.8.8"`，V2Ray 会使用此地址的 53 端口进行 DNS 查询。

当值为 `"localhost"` 时，表示使用本机预设的 DNS 配置。

当值是 `"https://host:port/dns-query"` 的形式，如 `"https://dns.google/dns-query"`，V2Ray 会使用 `DNS over HTTPS` (RFC8484, 简称 DOH) 进行查询。有些服务商拥有 IP 别名的证书，可以直接写 IP 形式，比如 `https://1.1.1.1/dns-query`。也可使用非标准端口和路径，如 `"https://a.b.c.d:8443/my-dns-query"` (4.22.0+)

当值是 `"https+local://host:port/dns-query"` 的形式，如 `"https+local://dns.google/dns-query"`，V2Ray 会使用 `DNS over HTTPS 本地模式` 进行查询，即 DOH 请求不会经过 Routing/Outbound 等组件，直接对外请求，以降低耗时。一般适合在服务端使用。也可使用非标端口和路径。(4.22.0+)

当值是 `"quic+local://host"` 的形式，如 `"quic+local://dns.adguard.com"`，V2Ray 会使用 `DNS over QUIC 本地模式` 进行查询，即 DOQ 请求不会经过 Routing/Outbound 等组件，直接对外请求，以降低耗时。目前（2021 年 1 月 4 日），公共 DNS 中支持 DOQ 协议的只有 `dns.adguard.com`，默认使用端口 `784`。 (4.34.0+)

:::tip
当使用 `localhost` 时，本机的 DNS 请求不受 V2Ray 控制，需要额外的配置才可以使 DNS 请求由 V2Ray 转发。

不同规则初始化得到的 DNS 客户端会在 V2Ray 启动日志中以 `info` 级别体现，比如 `local DOH`、`remote DOH` 和 `udp` 等模式。（4.22.0+）
:::

> `clientIp`: string

当前网络的 IP 地址。用于 DNS 查询时通知 DNS 服务器，客户端所在的地理位置（不能是私有 IP 地址）。

:::tip
此功能需要 DNS 服务器支持 EDNS Client Subnet（RFC7871）。
:::

> `tag`: string

（V2Ray 4.13+）由此 DNS 发出的查询流量，除 `localhost` 和 `DOHL_` 模式外，都会带有此标识，可在路由使用 `inboundTag` 进行匹配。

## ServerObject

```json
{
    "address": "11.22.33.44",
    "port": 5353,
    "clientIp": "5.6.7.8",
    "domains": [
        "domain:v2fly.org",
        "geosite:cn"
    ],
    "expectIPs": [
        "geoip:cn"
    ]
}
```

> `address`: address

DNS 服务器地址，如 `"8.8.8.8"`。对于普通 DNS IP 地址只支持 UDP 协议的 DNS 服务器，若地址是以 `"https://"` 或 `"https+local://"` 开头的 URL 形式，则使用 DOH 模式，规则同字符串模式的 DOH 配置。

> `port`: number

DNS 服务器端口，如 `53`。此项缺省时默认为 `53`。当使用 DOH 模式该项无效，非标端口应在 URL 中指定。

> `clientIp`: string

当前网络的 IP 地址。用于 DNS 查询时通知 DNS 服务器，客户端所在的地理位置（不能是私有 IP 地址）。此处 `clientIp` 的优先级高于外层配置的 `clientIp`，由此可实现「使用不同的 `clientIp` 从相同的 DNS 服务器获取同一域名在不同地区的解析结果」。 (4.34.0+)

:::tip
此功能需要 DNS 服务器支持 EDNS Client Subnet（RFC7871）。
:::

> `domains`: \[string\]

一个域名列表，此列表包含的域名，将优先使用此服务器进行查询。域名格式和 [路由配置](routing.md#ruleobject) 中相同。

> `expectIPs`:\[string\]

（V2Ray 4.22.0+）一个 IP 范围列表，格式和 [路由配置](routing.md#ruleobject) 中相同。

当配置此项时，V2Ray DNS 会对返回的 IP 的进行校验，只返回包含 expectIPs 列表中的地址。

如果未配置此项，会原样返回 IP 地址。
