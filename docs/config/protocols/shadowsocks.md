# Shadowsocks

* 名称：`shadowsocks`
* 类型：入站 / 出站

[Shadowsocks](https://zh.wikipedia.org/wiki/Shadowsocks) 协议，包含入站和出站两部分，兼容大部分其它版本的实现。

与官方版本的兼容性：

* 支持 TCP 和 UDP 数据包转发，其中 UDP 可选择性关闭；
* 加密方式：
  * AES-256-GCM
  * AES-128-GCM
  * ChaCha20-Poly1305 或称 ChaCha20-IETF-Poly1305
  * （V2Ray 4.27.0+） none 或称 plain

::: warning
"none" 不加密方式下，服务器端不会验证 "password" 中的密码。一般需要加上 TLS 并在传输层使用安全配置，例如 WebSocket 配置较长的 path
:::

Shadowsocks 的配置分为两部分，`InboundConfigurationObject` 和 `OutboundConfigurationObject`，分别对应入站和出站协议配置中的 `settings` 项。

## InboundConfigurationObject

```json
{
    "email": "love@v2ray.com",
    "method": "aes-256-gcm",
    "password": "密码",
    "level": 0,
    "network": "tcp",
    "ivCheck": false,
    "udp": false,
    "packetEncoding": "None"
}
```

> `email`: string

邮件地址，可选，用于标识用户

> `method`: string

必填。可选的值见 [加密方式列表](#加密方式列表)

> `password`: string

必填，任意字符串。Shadowsocks 协议不限制密码长度，但短密码会更可能被破解，建议使用 16 字符或更长的密码。

> `level`: number

用户等级，默认值为 `0`。详见 [本地策略](../policy.md)。

> `network`: "tcp" | "udp" | "tcp,udp"

可接收的网络连接类型，默认值为 `"tcp"`。

> `ivCheck`: true | false

是否启用 IV 检查功能。可以使某些 IV 重放攻击更加困难。 (4.37.0+)

目前此功能默认不启用，但是在未来版本中会默认处于启用状态。

> `udp`: true | false

是否开启 UDP 协议的支持。默认值为 `false`。

> `packetEncoding`: "None" | "Packet"

UDP 包编码方式，默认值为 `None`。
当该值为 `None` 时，UDP 将根据目标地址被映射 (Address and Port-Dependent Mapping)。
当该值为 `Packet` 时，UDP 将被端点独立映射 (Endpoint Independent Mapping)，此 UDP 行为也被称为 FullCone 或 NAT1。

## OutboundConfigurationObject

```json
{
    "servers": [
        {
            "email": "love@v2ray.com",
            "address": "127.0.0.1",
            "port": 1234,
            "method": "加密方式",
            "password": "密码",
            "level": 0
        }
    ]
}
```

> `servers`: \[[ServerObject](#serverobject)\]

一个数组，其中每一项是一个 [ServerObject](#serverobject)。

### ServerObject

```json
{
    "email": "love@v2ray.com",
    "address": "127.0.0.1",
    "port": 1234,
    "method": "加密方式",
    "password": "密码",
    "level": 0,
    "ivCheck": false
}
```

> `email`: string

邮件地址，可选，用于标识用户

> `address`: address

Shadowsocks 服务器地址，支持 IPv4、IPv6 和域名。必填。

> `port`: number

Shadowsocks 服务器端口。必填。

> `method`: string

必填。可选的值见[加密方式列表](#加密方式列表)

> `password`: string

必填。任意字符串。Shadowsocks 协议不限制密码长度，但短密码会更可能被破解，建议使用 16 字符或更长的密码。

> `level`: number

用户等级

> `ivCheck`: true | false

是否启用 IV 检查功能。可以使某些 IV 重放攻击更加困难。 (4.37.0+)

目前此功能默认不启用，但是在未来版本中会默认处于启用状态。

## 加密方式列表

* `"aes-256-gcm"`
* `"aes-128-gcm"`
* `"chacha20-poly1305"` 或 `"chacha20-ietf-poly1305"`
* `"none"` 或 `"plain"`
