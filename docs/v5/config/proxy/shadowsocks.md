# Shadowsocks

[Shadowsocks](https://shadowsocks.org) 协议，兼容大部分其它版本的实现。

## Shadowsocks 入站

inbound.shadowsocks

> `method` : string

加密方式，可选值见[加密方式列表](#加密方式列表)。

> `password`: string

服务器认可的密码。Shadowsocks 协议不限制密码长度，但短密码会更可能被破解，建议使用 16 字符或更长的密码。

> `network`: "tcp" | "udp" | "tcp,udp"

可接收的网络连接类型，比如当指定为 `"tcp"` 时，Shadowsocks 入站仅会接收 TCP 流量。默认值为 `"tcp"`。

## Shadowsocks 出站

outbound.shadowsocks

> `address`: string

服务器地址，支持 IP 地址或者域名。

> `port`: number

服务器端口号。

> `method` : string

加密方式，可选值见[加密方式列表](#加密方式列表)。

> `password`: string

服务器认可的密码。Shadowsocks 协议不限制密码长度，但短密码会更可能被破解，建议使用 16 字符或更长的密码。

## 加密方式列表

* `"aes-256-gcm"`
* `"aes-128-gcm"`
* `"chacha20-poly1305"` 或 `"chacha20-ietf-poly1305"`
* `"none"` 或 `"plain"`

::: warning
"none" 不加密方式下，服务器端不会验证 "password" 中的密码。一般需要加上 TLS 并在传输层使用安全配置，例如 WebSocket 配置较长的 path
:::
