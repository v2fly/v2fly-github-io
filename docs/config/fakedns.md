# FakeDNS

## FakeDnsObject

`FakeDnsObject` 对应配置文件 `fakedns` 项的一个子元素。(4.38.1+)

```json
{
    "ipPool": "198.18.0.0/15",
    "poolSize": 65535
}
```

> `ipPool`: string: CIDR

FakeDNS 分配 IP 的地址空间。由 FakeDNS 分配的地址会符合这个 CIDR 表达式。

> `poolSize`: number

FakeDNS 所记忆的「IP - 域名映射」数量。当域名数量超过此数值时，会依据 [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) 规则淘汰老旧域名。

:::warning
poolSize 必须小于或等于 ipPool 的地址总数，否则 core 将无法启动。
:::

:::tip
自 v4.38.1 起，若配置文件中的 `dns` 项显式设置了 `fakedns`，而配置文件中没有显式设置 `fakedns` 项，V2Ray 会根据 DNS 模块中 `queryStrategy` 项的值来初始化 `fakedns` 项的配置，即 FakeDNS 是否支持对不同类型 DNS 查询（A 记录和 AAAA 记录）返回相应的 IPv4 或 IPv6 类型的 IP 地址。`queryStrategy` 为 `UseIPv4` 时，默认的 `ipPool` 为 `198.18.0.0/15`，`poolSize` 为 `65535`；`queryStrategy` 为 `UseIPv6` 时，默认的 `ipPool` 为 `fc00::/18`，`poolSize` 为 `65535`；`queryStrategy` 为 `UseIP` 时，默认用于 IPv4 的 `ipPool` 为 `198.18.0.0/15`，`poolSize` 为 `32768`，用于 IPv6 的 `ipPool` 为 `fc00::/18`，`poolSize` 为 `32768`。
:::

## 运行机制及配置方式

Fake DNS，有时也叫 Fake IP，是解决 DNS 污染、防止 DNS 泄露、减低延时的技术手段（[RFC3089](https://tools.ietf.org/html/rfc3089)）。对于透明代理和三层代理（例如 Android VPNService）而言，在数据发送之前，被代理的程序需要先发出 DNS 请求，以获取目标主机/域名的 IP 地址。

:::warning
FakeDNS 尽管有很多优点，但是会污染本地程序的 DNS 缓存，当代理断开之后的一段时间内设备可能无法访问网络。
:::

### 步骤一：拦截 DNS 流量

```json
{
    "dns": {
        "servers": [
            "fakedns", // fakedns 排在首位
            "8.8.8.8"
        ]
    },
    "outbounds": [
        {
            "protocol": "dns",
            "tag": "dns-out"
        }
    ],
    "routing": {
        "rules": [
            {
                "type": "field",
                "inboundTag": [
                    "tproxy-in" // 只劫持来自透明代理入站的 DNS 流量。
                ],
                "port": 53,
                "outboundTag": "dns-out"
            }
        ]
    }
}
```

当外部 DNS 请求发入 FakeDNS 模块时，它会返回位于自己 `ipPool` 内的 IP 地址作为域名的虚构解析结果，并记录该域名与虚构解析结果之间的映射关系。

### 步骤二：还原虚构地址

```json
{
    "inbounds": [
        {
            "listen": "::",
            "port": 3346,
            "protocol": "dokodemo-door", // 流量入口，可以是其他协议
            "sniffing": {
                "enabled": true,
                "destOverride": [
                    "fakedns",       // 二选一
                    "fakedns+others" // 二选一
                ],
                "metadataOnly": false
            },
            "settings": {
                "network": "tcp,udp",
                "followRedirect": true
            },
            "streamSettings": {
                "sockopt": {
                    "tproxy": "tproxy"
                }
            },
            "tag": "tproxy-in"
        }
    ]
}
```

上面给出了一个透明代理入站使用 FakeDNS 的例子。你也可以将其他入站协议配合 FakeDNS 使用。

当客户端程序基于之前解析结果请求连接这个 IP 所指向的主机时，对应 [入站连接](inbounds.md) 的 `fakedns` 流量侦测模块会将目标地址还原为对应的域名。

:::tip
如果在使用 FakeDNS 时遇到了直连空解析的问题，可以尝试在 `freedom` 出站设置 `domainStrategy` 为 `UseIP`、`UseIPv4` 或 `UseIPv6`。
:::

## 与其他类型 DNS 搭配使用

### 与 DNS 分流共存

当使用 DNS 分流时，为了让 `fakedns` 拥有高优先级，需要增加与其他类型 DNS 相同的 `domains` 配置。

```json
{
    "servers": [
        {
            "address": "fakedns",
            "domains": [
                "geosite:cn"
            ]
        },
        {
            "address": "223.5.5.5",
            "domains": [
                "geosite:cn"
            ],
            "expectIPs": [
                "geoip:cn"
            ]
        },
        "8.8.8.8"
    ]
}
```

### FakeDNS 黑名单机制

若希望某些域名不使用 FakeDNS，则可在其他类型的 DNS 中增加 `domains` 配置，使其在匹配该域名时，拥有比 FakeDNS 更高的优先级，从而实现 FakeDNS 的黑名单机制。

```json
{
    "servers": [
        "fakedns",
        {
            "address": "223.5.5.5",
            "domains": [
                "domain:not-use-fakedns.com",
                "geosite:cn"
            ]
        },
        "8.8.8.8"
    ]
}
```

### FakeDNS 白名单机制

若只希望某些域名使用 FakeDNS，则可在 FakeDNS 中增加 `domains` 配置，使 FakeDNS 在匹配该域名时，拥有比其他类型的 DNS 更高的优先级，从而实现 FakeDNS 的白名单机制。

```json
{
    "servers": [
        "8.8.8.8",
        {
            "address": "fakedns",
            "domains": [
                "domain:use-fakedns.com",
                "geosite:geolocation-!cn"
            ]
        }
    ]
}
```
