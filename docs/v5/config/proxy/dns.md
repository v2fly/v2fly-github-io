# DNS

## DNS 出站

outbound.dns

DNS 是一个出站协议，主要用于拦截和转发 DNS 查询。此出站协议只能接收 DNS 流量（包含基于 UDP 和 TCP 协议的查询），其它类型的流量会导致错误。

在处理 DNS 查询时，此出站协议会将 IP 查询（即 A 和 AAAA 记录）转发给内置的 [DNS 服务器](../dns.md)。其它类型的查询流量将被转发至它们原本的目标地址。

## 配置

```json
{
  "network": "tcp",
  "address": "1.1.1.1",
  "port": 53,
  "nonIPQuery": "skip"
}
```

> `network`: "tcp" | "udp"

修改 DNS 流量的传输层协议，默认值为原协议（即原始请求是 TCP 则为 TCP，原始请求是 UDP 则为 UDP）。

* `"tcp"`：强制使用 TCP 协议
* `"udp"`：强制使用 UDP 协议

> `address`: string

修改 DNS 服务器地址，值为 IP 地址或域名。不填此项或填空字符串时，使用内置 DNS 服务器。

* 可以是 IPv4 地址，如 `"1.1.1.1"`
* 可以是 IPv6 地址，如 `"2606:4700:4700::1111"`
* 可以是域名，如 `"dns.google"`

> `port`: number

修改 DNS 服务器端口。默认值为 `53`。

* 必须是 1-65535 之间的有效端口号
* 通常 DNS 使用 53 端口，DoT（DNS over TLS）使用 853 端口

> `nonIPQuery`: "drop" | "skip"

处理非 IP 查询（非 A 和 AAAA 记录查询）的策略。(v5.1.0+)

* `"drop"`：丢弃所有非 IP 查询
* `"skip"`：跳过处理，将查询转发到原目标地址（默认行为）

## 工作原理

DNS 出站的典型工作流程：

1. 拦截客户端发出的 DNS 查询请求
2. 判断查询类型：
   - 如果是 A/AAAA 记录查询，转发给 V2Ray 内置 DNS 服务器处理
   - 如果是其他类型查询（如 MX、TXT 等），根据 `nonIPQuery` 配置处理
3. 返回查询结果给客户端

这样可以实现：
* 统一的 DNS 管理
* DNS 分流和防污染
* 与路由规则联动

## 使用示例

### 示例 1：基本 DNS 拦截

```json
{
  "inbounds": [
    {
      "port": 53,
      "protocol": "dokodemo-door",
      "tag": "dns-in",
      "settings": {
        "address": "1.1.1.1",
        "port": 53,
        "network": "tcp,udp"
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "dns",
      "tag": "dns-out"
    }
  ]
}
```

这个配置会拦截所有到 1.1.1.1:53 的 DNS 请求，并使用 V2Ray 内置 DNS 处理。

### 示例 2：DNS 分流

```json
{
  "dns": {
    "servers": [
      {
        "address": "223.5.5.5",
        "domains": ["geosite:cn"],
        "expectIPs": ["geoip:cn"]
      },
      {
        "address": "1.1.1.1",
        "domains": ["geosite:geolocation-!cn"]
      }
    ]
  },
  "inbounds": [
    {
      "port": 53,
      "protocol": "dokodemo-door",
      "tag": "dns-in",
      "settings": {
        "address": "0.0.0.0",
        "port": 53,
        "network": "udp"
      }
    }
  ],
  "routing": {
    "rules": [
      {
        "type": "field",
        "inboundTag": ["dns-in"],
        "outboundTag": "dns-out"
      }
    ]
  },
  "outbounds": [
    {
      "protocol": "dns",
      "tag": "dns-out"
    }
  ]
}
```

实现国内域名使用国内 DNS，国外域名使用国外 DNS。

### 示例 3：透明代理 DNS 处理

```json
{
  "inbounds": [
    {
      "port": 12345,
      "protocol": "dokodemo-door",
      "tag": "dns-in",
      "settings": {
        "address": "0.0.0.0",
        "port": 53,
        "network": "tcp,udp"
      }
    }
  ],
  "routing": {
    "rules": [
      {
        "type": "field",
        "inboundTag": ["dns-in"],
        "outboundTag": "dns-out"
      }
    ]
  },
  "outbounds": [
    {
      "protocol": "dns",
      "tag": "dns-out",
      "settings": {}
    }
  ]
}
```

配合 iptables 规则，可以拦截所有 DNS 查询并使用 V2Ray 处理。

### 示例 4：使用外部 DNS 服务器

```json
{
  "outbounds": [
    {
      "protocol": "dns",
      "tag": "dns-out",
      "settings": {
        "network": "tcp",
        "address": "8.8.8.8",
        "port": 53
      }
    }
  ]
}
```

不使用内置 DNS，而是将 DNS 查询转发到外部 DNS 服务器。

### 示例 5：仅处理 IP 查询

```json
{
  "outbounds": [
    {
      "protocol": "dns",
      "tag": "dns-out",
      "settings": {
        "nonIPQuery": "drop"
      }
    }
  ]
}
```

丢弃所有非 A/AAAA 记录的 DNS 查询，只处理 IP 地址查询。

## 使用场景

1. **防止 DNS 污染**：使用可信的 DNS 服务器，避免 DNS 劫持
2. **DNS 分流**：根据域名分类使用不同的 DNS 服务器
3. **透明代理**：配合 iptables 实现全局 DNS 拦截
4. **统一 DNS 管理**：集中管理所有 DNS 请求
5. **FakeDNS 支持**：配合 FakeDNS 实现更高效的路由

## 配合路由使用

DNS 出站通常需要配合路由规则使用：

```json
{
  "routing": {
    "rules": [
      {
        "type": "field",
        "inboundTag": ["dns-in"],
        "outboundTag": "dns-out"
      }
    ]
  }
}
```

这样可以确保 DNS 查询被正确路由到 DNS 出站处理。

## 注意事项

* DNS 出站只能处理 DNS 协议的流量，发送其他类型流量会导致错误
* 通常需要配合 `dokodemo-door` 入站使用，用于拦截 DNS 查询
* 如果不指定 `address` 和 `port`，会使用 V2Ray 内置 DNS 服务器
* `nonIPQuery` 设置为 `drop` 会丢弃所有非 IP 查询，可能影响某些应用
* 在使用 FakeDNS 时，DNS 出站是必需的组件
* 建议配合详细的 DNS 配置使用，以实现更精确的 DNS 分流
