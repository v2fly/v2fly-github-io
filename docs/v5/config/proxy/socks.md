# Socks

标准 Socks 协议实现。

:::warning
如果你将 Socks5 代理在不安全的网络环境中分享给其他人使用，建议搭配防火墙使用。

Rfc: [SOCKS 5 的认证在使用 UDP 时可被绕过](https://github.com/v2fly/v2fly-github-io/issues/104)
:::

## Socks 入站

inbound.socks

> `address` : string

SOCKS5 通过 UDP ASSOCIATE 命令建立 UDP 会话。服务端在对客户端发来的该命令的回复中，指定客户端发包的目标地址。默认值为空。

若此项为空，对于通过本地回环 IPv4/IPv6 连接的客户端，回复对应的回环 IPv4/IPv6 地址；对于非本机的客户端，回复当前入站的监听地址。

你可以通过配置此项使 V2Ray 固定回复你配置的地址。如果你不知道此项的作用，留空即可。

> `udpEnabled`: true | false

是否开启 UDP 协议的支持。默认值为 `false`。

## Socks 出站

outbound.socks

> `address`: string

服务器地址。

:::tip
仅支持连接到 Socks 5 服务器。
:::

> `port`: number

服务器端口。
