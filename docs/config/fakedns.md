# 虚拟 DNS 服务器

## FakeDnsObject

`FakeDnsObject` 对应配置文件的 `fakedns` 项。 (4.35.0+)

```json
{
    "ipPool": "240.0.0.0/8",
    "poolSize": 65535
}
```

> `ipPool`: string: CIDR

虚拟 DNS 服务器分配 IP 的地址空间。由虚拟 DNS 服务器分配的地址会符合这个 CIDR 表达式。默认为 "240.0.0.0/8"。也支持 IPv6，例如 "fc00::/7"。

> `poolSize`: number

虚拟 DNS 服务器所记忆的 IP - 域名映射 数量。当域名数量超过此数值时，会依据 [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) 规则淘汰老旧域名。默认为 65535。

:::warning
注意： poolSize 必须 小于或等于 ipPool 的地址总数，否则 core 将无法启动。
:::

## 虚拟 DNS 服务器机制

虚拟 DNS，一般也被称为 Fake DNS 或者 Fake IP。对于透明代理和三层代理（例如 Android VPNService）而言，在数据发送之前，被代理的程序需要先发出 DNS 请求。
虚拟 DNS 是解决 DNS 污染、防止 DNS 泄露、减低延时的技术手段。 [RFC3089](https://tools.ietf.org/html/rfc3089)

:::warning
虚拟 DNS 尽管有很多优点，但是会污染本地程序的 DNS 缓存，当代理断开之后一段时间内设备可能无法访问网络。
:::

### 步骤一：导入 DNS 流量

```json
{
    "dns": {
        "servers": [
            "fakedns", // fakedns 排在首位
            "8.8.8.8"
        ]
    },
    "inbounds": [
        {
            "protocol": "dokodemo-door",
            "tag": "dns-in"
        }
    ],
    "outbounds": [
        {
            "protocol": "dns",
            "tag": "dns-out"
        }
    ],
    "routing": {
        "rules": [
            {
                "inboundTag": "dns-in",
                "outboundTag": "dns-out"
            }
        ]
    }
}
```

当外部 DNS 请求导入虚拟 DNS 服务器时，它会返回一个位于自己 `ipPool` 内的 IP 地址为域名的虚构解析结果，并记忆该域名与虚构解析结果之间的关系。

### 步骤二：还原虚构地址

```json
{
    "inbounds": [
        {
            "protocol": "dokodemo-door", // 流量入口，可以是其他协议
            "sniffing": {
                "enabled": true,
                "destOverride": [
                    "fakedns"
                ],
                "metadataOnly": false
            }
        }
    ]
}
```

当客户端程序基于之前解析结果请求连接这个 IP 所指向的主机时，对应 [入站连接](inbounds.md) 的 `fakedns` 流量侦测模块会将目标地址还原为对应的域名。

:::tip
如果在使用虚拟 DNS 时遇到了直连空解析的问题，可以尝试在 `freedom` 出站设置 `domainStrategy` 为 `UseIP`
:::

## 与其他类型 DNS 的搭配使用方式

### 与 DNS 分流共存

当使用 DNS 分流时，为了让 `fakedns` 拥有高优先级，需要增加和分流相同的 `domains` 配置

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
            ],
            "port": 53
        },
        "8.8.8.8"
    ]
}
```

### 黑名单

若有某些域名不能使用虚拟 DNS，则可以通过改变列表顺序，实现黑名单或者白名单

```json
{
    "servers": [
        "fakedns",
        {
            "address": "8.8.8.8",
            "domains": [
                "not-use-fakedns.com"
            ]
        },
        "8.8.8.8"
    ]
}
```

### 白名单

```json
{
    "servers": [
        "8.8.8.8",
        {
            "address": "fakedns",
            "domains": [
                "use-fakedns.com",
                "geosite:geolocation-!cn"
            ]
        }
    ]
}
```
