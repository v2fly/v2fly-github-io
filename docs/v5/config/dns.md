# DNS 域名解析

V2Ray 内建了一个 DNS 组件，其主要用途为：对目标地址（域名）进行 DNS 解析，同时为 IP 路由规则匹配提供判断依据。

:::tip
由于 DNS 协议的复杂性，V2Ray 只支持最基本的 IP 查询（A 和 AAAA 记录）。如需完整的 DNS 功能，推荐使用 [CoreDNS](https://coredns.io)。
:::

:::warning
在 `freedom` 协议的 `outbound` 中，`domainStrategy` 默认值为 `AsIs`，即 `freedom` outbound 默认不会使用本 DNS 组件进行目标地址解析。如需使用，应修改 `freedom` outbound 中的 `domainStrategy` 配置为 `UseIP`、`UseIPv4` 或 `UseIPv6`。
:::

## 支持的 DNS 协议及其路由策略

- DNS over **UDP**：查询请求经过路由组件，可从用户指定 outbound 发出
  - 使用 IP 地址的形式，如 `8.8.8.8`
  - 默认使用 `53` 端口进行查询，支持使用非标准端口
- DNS over **TCP**：查询请求经过路由组件，可从用户指定 outbound 发出
  - 使用 `tcp://host:port` 的形式，如 `tcp://8.8.8.8:53`
  - 默认使用 `53` 端口进行查询，支持使用非标准端口
- DNS over **TCP local mode**：查询请求不经过路由组件，直接从 freedom outbound 发出
  - 使用 `tcp+local://host:port` 的形式，如 `tcp+local://8.8.8.8:53`
  - 默认使用 `53` 端口进行查询，支持使用非标准端口
- DNS over **HTTPS**：查询请求经过路由组件，可从用户指定 outbound 发出
  - 使用 `https://host:port/dns-query` 的形式，如 `https://dns.google/dns-query` 或 `https://1.1.1.1/dns-query`
  - 默认使用 `443` 端口进行查询，支持使用非标准端口和非标准路径，如 `https://a.b.c.d:8443/my-dns-query`
- DNS over **HTTPS local mode**：查询请求不经过路由组件，直接从 freedom outbound 发出
  - 使用 `https+local://host:port/dns-query` 的形式，如 `https+local://223.5.5.5/dns-query`
  - 默认使用 `443` 端口进行查询，支持使用非标准端口和非标准路径，如 `https+local://a.b.c.d:8443/my-dns-query`
- DNS over **QUIC local mode**：查询请求不经过路由组件，直接从 freedom outbound 发出
  - 使用 `quic+local://host` 的形式，如 `quic+local://dns.adguard.com`
  - 默认使用 `853` 端口进行查询，支持使用非标准端口
  - 目前（2022 年 11 月 20 日），公共递归 DNS 服务中支持 DNS over QUIC 协议的有 `dns.adguard.com` 与 `dns.nextdns.io`。
- 特殊项：
  - **localhost**：使用本机预设的 DNS 配置
  - **FakeDNS**：使用 V2Ray 内建的 FakeDNS 服务器。

:::tip
当使用 `localhost` 时，本机的 DNS 请求不受 V2Ray 控制，需要额外的配置才可以使 DNS 请求由 V2Ray 转发。
:::

:::warning
如果在 Linux 设备上使用 DNS over QUIC，可能需要调整接收缓冲区大小，下面的命令将其设置为 2.5 MB

```shell
sysctl -w net.core.rmem_max=2500000
```

Reference: [https://github.com/lucas-clemente/quic-go/wiki/UDP-Receive-Buffer-Size](https://github.com/lucas-clemente/quic-go/wiki/UDP-Receive-Buffer-Size)
:::

## DNS 处理流程

若当前要查询的域名：

- 命中了 `hosts` 中的「域名 - IP」、「域名 - IP 数组」映射，则将该 IP 或 IP 数组作为 DNS 解析结果返回。
- 命中了 `hosts` 中的「域名 - 域名」映射，则该映射的值（另一个域名）将作为当前要查询的新域名，进入 DNS 处理流程，直到解析出 IP 后返回，或返回空解析。
- 没有命中 `hosts`，但命中了某（几）个 DNS 服务器中的 `domains` 域名列表，则按照命中的规则的优先级，依次使用该规则对应的 DNS 服务器进行查询。若命中的 DNS 服务器查询失败，或 `expectIPs` 不匹配，则使用下一个命中的 DNS 服务器进行查询；否则返回解析得到的 IP。若所有命中的 DNS 服务器均查询失败，此时 DNS 组件：
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
    "nameServer": [{
        "address": {
            "network": "udp",
            "address": "1.1.1.1",
            "port": 53
        },
        "clientIp": "5.6.7.8",
        "skipFallback": true,
        "prioritizedDomain": [{
            "type": "Subdomain",
            "domain": "youtube.com"
        }, {
            "type": "Keyword",
            "domain": "google"
        }],
        "expectIPs": [{
            "countryCode": "cn",
            "cidr": [{
                "ipAddr": "119.29.0.0",
                "prefix": 16
            }],
            "inverseMatch": true
        }, {
            "filePath": "geoip.dat",
            "code": "private"
        }]
    }],
    "clientIp": "1.2.3.4",
    "staticHosts": [{
        "type": "Full",
        "domain": "cloudflare.com",
        "ip": ["1.1.1.1", "1.0.0.1"]
    }, {
        "type": "Full",
        "domain": "cloudflare.com",
        "proxiedDomain": "api.v2fly.org"
    }],
    "fakeDns": {
        "pools": [
            {
                "ipPool": "198.18.0.0/15",
                "lruSize": 65535
            },
                        {
                "ipPool": "fc00::/18",
                "lruSize": 65535
            }
        ]
    },
    "domainMatcher": "mph",
    "queryStrategy": "USE_IP4",
    "cacheStrategy": "CacheEnabled",
    "fallbackStrategy": "Enabled",
    "disableCache": false,
    "disableFallback": false,
    "disableFallbackIfMatch": true,
    "tag": "dns"
}
```

> `nameServer`: [ [NameServerObject](#nameserverobject) ]

DNS 服务器列表。

> `clientIp`: string

当前网络的 IP 地址。用于 DNS 查询时通知 DNS 服务器，客户端所在的地理位置（不能是私有 IP 地址）。

:::tip
此功能需要 DNS 服务器支持 EDNS Client Subnet（RFC7871）。
:::

> `staticHosts`: [ [HostMappingObject](#hostmappingobject) ]

静态域名映射。

:::tip
当地址中同时设置了多个 IP 和域名，则只会返回第一个域名，其余 IP 和域名均被忽略。【TODO】
:::

> `fakeDns`: [FakeDnsObject](#fakednsobject)

FakeDNS 公共配置，当 `nameServer` 中 `address` 为 `fakedns` 且无 `fakeDNS` 配置时，使用此配置。(v5.2.0+)

> `domainMatcher`: "linear" | "mph"

选择要使用的域名匹配算法。(v5.2.0+)

* `linear`：使用线性匹配算法，默认值；
* `mph`：使用最小完美散列（minimal perfect hash）算法。
  * 测试数据约 17 万条，匹配速度提升约 30%，内存占用减少约 15%

> `queryStrategy`: "USE_IP" | "USE_IP4" | "USE_IP6"

DNS 查询所使用的网络类型。默认值为 `USE_IP`，即 DNS 同时查询域名的 A 和 AAAA 记录。`USE_IP4` 和 `USE_IP6` 分别为只查询 A 记录、只查询 AAAA 记录。

:::tip
建议没有 IPv6 网络的用户，设置为 `USE_IP4`。
:::

> `cacheStrategy`: "CacheEnabled" | "CacheDisabled"

DNS 缓存策略。默认为 `CacheEnabled`，即启用 DNS 缓存。`CacheDisabled` 为禁用 DNS 缓存。 (v5.2.0+)

> `disableCache`: bool

禁用 DNS 缓存。默认为 false，即为不禁用。 (v5.2.0+ 弃用)

> `fallbackStrategy`: "Enabled" | "Disabled" | "DisabledIfAnyMatch"

DNS 回退（fallback）查询策略。默认为 `Enabled`，即启用 DNS 回退（fallback）查询。`Disabled` 为禁用 DNS 回退（fallback）查询。`DisabledIfAnyMatch` 为在 DNS 服务器的优先匹配域名列表命中时禁用 DNS 回退（fallback）查询。详情见 [DNS 处理流程](#dns-处理流程)。 (v5.2.0+)

> `disableFallback`: bool

禁用 DNS 回退（fallback）查询。默认为 false，即为不禁用。详情见 [DNS 处理流程](#dns-处理流程)。 (v5.2.0+ 弃用)

:::warning
如果本选项设置为 `true`，则 [ServerObject](#serverobject) 中的 `skipFallback` 均不会生效。
:::

> `disableFallbackIfMatch`: bool

禁用在 DNS 服务器的优先匹配域名列表命中时执行 DNS 回退（fallback）查询。 (v5.2.0+ 弃用)

> `tag`: string

由此 DNS 发出的查询流量，除 `localhost` 和 `DOHL_` 模式外，都会带有此标识，可在路由使用 `inboundTag` 进行匹配。

## NameServerObject

```json
{
    "address": {
        "address": "1.1.1.1",
        "port": 53
    },
    "clientIp": "5.6.7.8",
    "skipFallback": true,
    "prioritizedDomain": [{
        "type": "subdomain",
        "domain": "youtube.com"
    }, {
        "type": "keyword",
        "domain": "google"
    }],
    "expectIPs": [{
        "cidr": [{
            "ipAddr": "119.29.0.0",
            "prefix": 16
        }],
        "inverseMatch": true
    }, {
        "filePath": "geoip.dat",
        "code": "private"
    }],
    "fakeDns": {
        "pools": [
            {
                "ipPool": "198.18.0.0/15",
                "lruSize": 65535
            },
                        {
                "ipPool": "fc00::/18",
                "lruSize": 65535
            }
        ]
    },
    "tag": "dns",
    "queryStrategy": "UseIPv4",
    "cacheStrategy": "CacheEnabled",
    "fallbackStrategy": "Enabled",
}
```

> `address`: [EndpointObject](#endpointobject)

DNS 服务器地址。

> `clientIp`: string

当前网络的 IP 地址。用于 DNS 查询时通知 DNS 服务器，客户端所在的地理位置（不能是私有 IP 地址）。此处 `clientIp` 的优先级高于外层配置的 `clientIp`，由此可实现「使用不同的 `clientIp` 从相同的 DNS 服务器获取同一域名在不同地区的解析结果」。

:::tip
此功能需要 DNS 服务器支持 EDNS Client Subnet（RFC7871）。
:::

> `skipFallback`: bool

在 DNS 回退（fallback）查询过程中，是否跳过本 DNS。默认为 false，即为不跳过。详情见 [DNS 处理流程](#dns-处理流程)。(v5.2.0+ 弃用)

:::tip
本选项可用于防止 DNS 回退（fallback）查询 `A` 和 `AAAA` 记录过程中的 DNS 泄漏。
:::

:::warning
如果 [DnsObject](#dnsobject) 中的 `disableFallback` 设置为 `true`，则本选项不会生效。
:::

> `prioritizedDomain`: \[ [PriorityDomainObject](#prioritydomainobject) ]

一个域名列表，此列表包含的域名，将优先使用此服务器进行查询。

> `expectIPs`:\[ [GeoIPObject](#geoipobject) ]

一个 IP 范围列表。

当配置此项时，V2Ray DNS 会对返回的 IP 进行校验，只返回满足 expectIPs 列表的地址。如果未配置此项，会原样返回 IP 地址。

> `fakeDns`: [FakeDnsObject](#fakednsobject)

FakeDNS 配置，当该项配置时，FakeDNS 启用。当该项未被配置但 `address` 配置为 `fakedns` 时则使用上级公共配置。(v5.2.0+)

> `tag`: string

默认使用上级公共配置。由此 DNS 发出的查询流量，除 `localhost` 和 `DOHL_` 模式外，都会带有此标识，可在路由使用 `inboundTag` 进行匹配。(v5.2.0+)

> `queryStrategy`: "UseIP" | "UseIPv4" | "UseIPv6"

DNS 查询所使用的网络类型，默认使用上级公共配置。配置为 `UseIP` 时 DNS 同时查询域名的 A 和 AAAA 记录。`UseIPv4` 和 `UseIPv6` 分别为只查询 A 记录、只查询 AAAA 记录。(v5.2.0+)

> `cacheStrategy`: "CacheEnabled" | "CacheEnabled"

DNS 缓存策略，默认使用上级公共配置。 `CacheEnabled`，为启用 DNS 缓存。`CacheEnabled` 为禁用 DNS 缓存。详情见 [DNS 处理流程](#dns-处理流程)。(v5.2.0+)

> `fallbackStrategy`: "Enabled" | "Disabled" | "DisabledIfAnyMatch"

DNS 回退（fallback）查询策略，默认使用上级公共配置。 `Enabled`，为启用 DNS 回退（fallback）查询。`Disabled` 为禁用 DNS 回退（fallback）查询。`DisabledIfAnyMatch` 为在 DNS 服务器的优先匹配域名列表命中时禁用 DNS 回退（fallback）查询。详情见 [DNS 处理流程](#dns-处理流程)。 (v5.2.0+)

## EndpointObject

```json
{
    "address": "1.1.1.1",
    "port": 53
}
```

> `address`: string

DNS 服务器地址，如 `8.8.8.8`、`tcp+local://8.8.8.8:53` 和 `https://dns.google/dns-query` 等，详情查看[支持的 DNS 协议及其路由策略](#支持的-dns-协议及其路由策略)。

> `port`: number

DNS 服务器端口，如 `53`。此项缺省时默认为 `53`。当使用 DOH、DOHL、DOQL 模式时，该项无效。非标准端口应在 URL 中指定。

## PriorityDomainObject

```json
{
    "type": "Subdomain",
    "domain": "youtube.com"
}
```

> `type`: "Full" | "Subdomain" | "Keyword" | "Regex"

`domain` 的匹配类型。

> `domain`: string

与 `type` 所对应的 domain 值。以下为 `type` 与`domain` 的对应关系：

- **Full**：当此域名完整匹配目标域名时，该规则生效。例如 `v2ray.com` 匹配 `v2ray.com` 但不匹配 `www.v2ray.com`。
- **Regex**：当 `domain` 所表示的正则表达式匹配目标域名时，该规则生效。例如 `\.goo.*\.com$` 匹配 `www.google.com`、`fonts.googleapis.com`，但不匹配 `google.com`。
- **Subdomain (推荐)**：当此域名是目标域名或其子域名时，该规则生效。例如 `v2ray.com` 匹配 `www.v2ray.com`、`v2ray.com`，但不匹配 `xv2ray.com`。
- **Keyword**：当此字符串匹配目标域名中任意部分，该规则生效。比如 `sina.com` 可以匹配 `sina.com`、`sina.com.cn`、`www.sina.com` 和 `www.sina.company`，但不匹配 `sina.cn`。

## GeoIPObject

```json
{
    "cidr": [{
        "ipAddr": "10.0.0.0",
        "prefix": 8
    }, {
        "ipAddr": "192.168.0.0",
        "prefix": 16
    }],
    "filePath": "geoip.dat",
    "code": "private",
    "inverseMatch": true
}
```

> `code`: string

从文件中加载 IP 时，所指定的 code。例如从 `gepip.dat` 中加载时，code 为双字符[国家或地区代码](https://zh.wikipedia.org/wiki/國家地區代碼)，支持所有可以上网的国家和地区。

> `filePath`: string

从文件中加载 IP 时，所指定的文件路径。默认值为 `geoip.dat`。

> `cidr`: [ [CIDRObject](#cidrobject) ]

[CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing)：形如 `10.0.0.0/8`。

:::warning

当 `code` 和 `cidr` 同时指定时，从文件中加载的 IP 会覆盖 `cidr` 的值。

:::

> `inverseMatch`: bool

是否反向匹配。当该值为 `true` 时，匹配不在指定 IP 范围内的地址。

## CIDRObject

```json
{
    "ipAddr": "119.29.0.0",
    "prefix": 16
}
```

> `ipAddr`: string

IP 地址。

> `prefix`: number

IP 地址前缀匹配的长度，单位为比特。

## HostMappingObject

```json
{
    "type": "Regex",
    "domain": "cloudflare.com",
    "ip": ["1.1.1.1", "1.0.0.1"],
    "proxiedDomain": "api.v2fly.org"
}
```

> `type`: "Full" | "Subdomain" | "Keyword" | "Regex"

`domain` 的匹配类型。

> `domain`: string

与 `type` 所对应的 domain 值。格式与 [PriorityDomainObject](#prioritydomainobject) 相同。

> `ip`: [ string ]

匹配的域名所映射的 IP 地址列表。

> `proxiedDomain`: string

如指定 `proxiedDomain`，匹配的域名将直接使用该域名的查询结果，类似于 CNAME。

:::tip
如果同时指定了 `ip` 和 `proxiedDomain`，将优先生效 `proxiedDomain`。
:::

## FakeDNSObject

```json
{
    "pools": [
        {
            "ipPool": "198.18.0.0/15",
            "lruSize": 65535
        },
        {
            "ipPool": "fc00::/18",
            "lruSize": 65535
         }
    ]
}
```

> `pools`: [ [PoolObject](#poolobject) ]

IP 地址池配置。

### PoolObject

> `ipPool`: string

FakeDNS 分配 IP 的地址空间。由 FakeDNS 分配的地址会符合这个 CIDR 表达式。

> `lruSize`: number

FakeDNS 所记忆的「IP - 域名映射」数量。当域名数量超过此数值时，会依据 [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) 规则淘汰老旧域名。

:::warning
poolSize 必须小于或等于 ipPool 的地址总数，否则将无法启动。
:::
