# HTTPUpgrade

HTTPUpgrade 在完成一个 HTTP 1.1 协议迁移握手后直接使用连接传输数据. 它类似于 WebSocket， 但是避免了使用 WebSocket 库所带来的相关开销，并在于此同时保证了流量可以被很多反向代理和 CDN（内容分发网络）转发. 您需要启用 TLS 或其他安全协议来使本协议按预期方式运作。 (v5.10.0+)

您可以参考 [pull request](https://github.com/v2fly/v2ray-core/pull/2727) 中的示例。

## HTTPUpgrade 流传输协议
* 名称: `httpupgrade`
* 类型: 传输协议
* ID: `stream.httpupgrade`

> `path` : string

HTTP 路径。

> `host` : string

HTTP 主机域名。

> `maxEarlyData`: number

所要发送的前置数据的最长长度。用于减少连接建立的时间。

> `earlyDataHeaderName`: string
> 
发送的前置数据的 HTTP 头的名字，设置后启用基于 HTTP 头的前置数据。(v5.24.0)

> `headers`: [ struct{ key, value string } ]

自定义 HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是字符串。默认值为空。(v5.24.0)
