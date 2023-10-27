# HTTPUpgrade

HTTPUpgrade 在完成一个 HTTP 1.1 协议迁移握手后直接使用连接传输数据. 它类似于 WebSocket， 但是避免了使用 WebSocket 库所带来的相关开销，并在于此同时保证了流量可以被很多反向代理和 CDN（内容分发网络）转发. (v5.10.0+)

## HTTPUpgrade 流传输协议
* 名称: `httpupgrade`
* 类型: 传输协议
* ID: `stream.httpupgrade`

> `path` : string

HTTP 路径。

> `host` : string

HTTP 主机域名。
