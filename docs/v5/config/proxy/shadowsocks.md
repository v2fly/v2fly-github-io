# Shadowsocks

[Shadowsocks](https://shadowsocks.org) 协议，兼容大部分其它版本的实现。

## Shadowsocks 入站

inbound.shadowsocks

> `method` : string

加密方式，可选值见[加密方式列表](#加密方式列表)。

> `password`: string

服务器认可的密码。Shadowsocks 协议不限制密码长度，但短密码会更可能被破解，建议使用 16 字符或更长的密码。

> `networks`: "tcp" | "udp" | "tcp,udp"

可接收的网络连接类型，比如当指定为 `"tcp"` 时，Shadowsocks 入站仅会接收 TCP 流量。默认值为 `"tcp"`。

> `packetEncoding`:  \["None" | "Packet"\]

UDP 包编码方式，默认值为 `None`。
当该值为 `None` 时，UDP 将根据目标地址被映射 (Address and Port-Dependent Mapping)。
当该值为 `Packet` 时，UDP 将被端点独立映射 (Endpoint Independent Mapping)，此 UDP 行为也被称为 FullCone 或 NAT1。

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
Shadowsocks+aes-256-gcm配置示例，这是一个最简单的配置，不是最佳实践，这个配置可以用于回国，但是切勿用于翻墙！
```json
{
    "log": {
        "access": "",
        "error": "",
        "loglevel": "info"
    },
    "inbounds": [
        {
            "port": 443,
            "listen": "0.0.0.0",
            "protocol": "shadowsocks",
            "settings": {
                "method": "aes-256-gcm", //这里使用`aes-256-gcm`加密方式，如果你的CPU不带aes加密指令集也可以使用`"chacha20-poly1305"` 或 `"chacha20-ietf-poly1305"`
                "password": "ukrxmqlkYTnyyb5sgc8mqiDe5vMoFqRwxefqiigxfdzgigLASE=", //更改这里的密码，让它变得更加复杂
                "network": "tcp,udp"
            },
            "sniffing": {
                "enabled": false,//如果需要流量探测，请将其改为`true`
                "destOverride": [
                    "http",
                    "tls"
                ]
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom",
            "settings": {}
        }
    ]
}
```
