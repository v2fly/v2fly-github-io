# Router 路由
service.router

V2Ray 内建了一个路由模块，可以将入站数据按需求由不同的出站连接发出，以达到按需代理的目的。这一功能的常见用法是分流国内外流量。V2Ray 可以通过内部机制判断不同国家或地区的流量，然后将它们发送到不同的出站代理。

```json
{
  "domainStrategy":"AsIs",
  "rule":[],
  "balancingRule":[]
}
```

> `domainStrategy`: `AsIs` | `UseIp` | `IpIfNonMatch` | `IpOnDemand`

* `AsIs`：只使用域名进行路由选择，默认值；
* `IpIfNonMatch`：当域名没有匹配任何基于域名的规则时，将域名解析成 IP（A 记录或 AAAA 记录），进行基于 IP 规则的匹配；
  * 当一个域名有多个 IP 地址时，会尝试匹配所有的 IP 地址，直到其中一个与某个 IP 规则匹配为止；
  * 解析后的 IP 仅在路由选择时起作用，转发的数据包中依然使用原始域名。
* `IpOnDemand`：当匹配时碰到任何基于 IP 的规则，立即将域名解析为 IP 进行匹配。

> `rule`: [ [RuleObject](#ruleobject) ]

对应一个数组，数组中每一项是一个规则。对于每一个连接，路由将根据这些规则依次进行判断，当一个规则生效时，即将这个连接转发至它所指定的 `outboundTag` 或 `balancingTag`。当没有匹配到任何规则时，流量默认被转发至第一个 `outbound`。

> `balancingRule`: [ [BalancingRuleObject](#balancingruleobject) ]

一个数组，数组中每一项是一个负载均衡器的配置。当一个规则指向一个负载均衡器时，V2Ray 会通过此负载均衡器选出一个 `outbound`，然后由它转发流量。

## RuleObject

> `tag`: string

对应一个额外 [出站连接配置](outbounds.md) 的标识。

> `balancingTag`: string

对应一个负载均衡器的标识。`balancerTag` 和 `tag` 须二选一。当同时指定时，`tag` 生效。

> `domain`: \[ [DomainObject](./geo.md#DomainObject) \]

当匹配目标域名时，此规则生效。

> `geoDomain`: \[ [GeoDomain](./geo.md#GeoDomain) \]

当匹配目标域名时，此规则生效。

> `geoip` : \[ [GeoIP](./geo.md#GeoIP) \]

当匹配目标 IP 时，此规则生效。

> `portList`: string

目标端口范围，有三种形式：

* `a-b`：a 和 b 均为正整数，且小于 65536。这个范围是一个前后闭合区间，当端口落在此范围内时，此规则生效。
* `a`：a 为正整数，且小于 65536。当目标端口为 a 时，此规则生效。
* 以上两种形式的混合，以逗号 "," 分隔。形如：`53,443,1000-2000`。

> `networks`: "tcp" | "udp" | "tcp,udp"

可选的值有 "tcp"、"udp" 或 "tcp,udp"，当连接方式是指定的方式时，此规则生效。

> `sourceGeoip`: \[ [GeoIP](./geo.md#GeoIP) \]

当匹配来源 IP 时，此规则生效。

> `sourcePortList`: string

来源端口范围，格式与 `portList` 相同。

> `userEmail`: [ string ]

一个数组，数组内每一项是一个邮箱地址。当某一项匹配来源用户时，此规则生效。

> `inboundTag`: [ string ]

一个数组，数组内每一项是一个标识。当某一项匹配入站协议的标识时，此规则生效。

> `protocol`: \[ "http" | "tls" | "bittorrent" \]

一个数组，数组内每一项表示一种协议。当某一个协议匹配当前连接的流量时，此规则生效。必须开启入站代理中的 `sniffing` 选项。

> `domainMatcher`: "linear" | "mph"

选择要使用的域名匹配算法。

* `linear`：使用线性匹配算法，默认值；
* `mph`：使用最小完美散列（minimal perfect hash）算法。
  * 测试数据约 17 万条，匹配速度提升约 30%，内存占用减少约 15%

> `geoDomain` :

## BalancingRuleObject

负载均衡器配置。当一个负载均衡器生效时，它会从指定的出站协议中，按配置选出一个最合适的出站协议，进行流量转发。

```json
{
    "tag": "balancer",
    "selector": [],
    "strategy": {
      "type": "random"
    }
}
```

> `tag`: string

此负载均衡器的标识，用于匹配 `RuleObject` 中的 `balancerTag`。

> `outboundSelector`: \[ string \]

一个字符串数组，其中每一个字符串将用于和出站协议标识的前缀匹配。在以下几个出站协议标识中：`[ "a", "ab", "c", "ba" ]`，`"outboundSelector": ["a"]` 将匹配到 `[ "a", "ab" ]`。

> `strategy`: "random" | "leastping" | "leastload"

进行负载均衡的策略类型。

可以填入的类型包括 `random` 、`leastping` 以及 `leastload`。

> strategySettings: [StrategySettingsObject](#strategysettingsobject)

> fallbackTag: string

### StrategySettingsObject
