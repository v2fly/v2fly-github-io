---
refcn: chapter_02/outbounds
refen: configuration/outbounds
---

# Outbounds

出站连接用于向远程网站或下一级代理服务器发送数据，可用的协议请见协议列表。

## OutboundObject

```json
{
    "sendThrough": "0.0.0.0",
    "protocol": "协议名称",
    "settings": {},
    "tag": "标识",
    "streamSettings": {},
    "proxySettings": {
        "tag": "another-outbound-tag"
    },
    "mux": {}
}
```

> `sendThrough`: address

用于发送数据的 IP 地址，当主机有多个 IP 地址时有效，默认值为 `"0.0.0.0"`。

> `protocol`: string

连接协议名称，可选的值见协议列表。

> `settings`: OutboundConfigurationObject

具体的配置内容，视协议不同而不同。详见每个协议中的 `OutboundConfigurationObject`。

> `tag`: string

此出站连接的标识，用于在其它的配置中定位此连接。当其值不为空时，必须在所有 tag 中唯一。

> `streamSettings`: [StreamSettingsObject](transport.md#perproxy)

[底层传输配置](transport.md#perproxy)

> `proxySettings`: [ProxySettingsObject](#proxysettingsobject)

出站代理配置。当出站代理生效时，此出站协议的 `streamSettings` 将不起作用。

> `mux`: [MuxObject](#muxobject)

[Mux 配置](#muxobject)。

## ProxySettingsObject

```json
{
    "tag": "another-outbound-tag"
}
```

> `tag`: string

当指定另一个出站协议的标识时，此出站协议发出的数据，将被转发至所指定的出站协议发出。

## MuxObject

Mux 功能是在一条 TCP 连接上分发多个 TCP 连接的数据。实现细节详见 [Mux.Cool](../developer/protocols/muxcool.md)。Mux 是为了减少 TCP 的握手延迟而设计，而非提高连接的吞吐量。使用 Mux 看视频、下载或者测速通常都有反效果。Mux 只需要在客户端启用，服务器端自动适配。

`MuxObject` 对应 `OutboundObject` 中的 `mux` 项。

```json
{
    "enabled": false,
    "concurrency": 8
}
```

> `enabled`: true | false

是否启用 Mux 转发请求

> `concurrency`: number

最大并发连接数。最小值 `1`，最大值 `1024`，缺省默认值 `8`。

特殊值 `-1`，不加载 mux 模块。(4.22.0+)

这个数值表示了一个 TCP 连接上最多承载的 Mux 连接数量。当客户端发出了 8 个 TCP 请求，而 `concurrency=8` 时，V2Ray 只会发出一条实际的 TCP 连接，客户端的 8 个请求全部由这个 TCP 连接传输。
