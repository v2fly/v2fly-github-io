# Trojan

* 名称：`trojan`
* 类型：入站 / 出站

[Trojan](https://trojan-gfw.github.io/trojan/protocol) 协议设计指南

:::tip
Trojan 被设计工作在正确配置的加密 TLS 隧道中
:::

Trojan 的配置分为两部分，`InboundConfigurationObject` 和 `OutboundConfigurationObject`，分别对应入站和出站协议配置中的 `settings` 项。

## InboundConfigurationObject

```json
{
    "clients":[
        {
            "password": "password",
            "email": "love@v2fly.org",
            "level": 0
        }
    ],
    "fallbacks": [
        {
            "dest": 80
        }
    ],
    "packetEncoding": "None"
}
```

> `clients`: \[ [ClientObject](#clientobject) \]

一个数组，其中每一项是一个 [ClientObject](#clientobject)。

> `fallbacks`: \[ [FallbackObject](#fallbackobject) \]

一个数组，包含一系列强大的回落分流配置（可选）。

> `packetEncoding`: "None" | "Packet"

UDP 包编码方式，默认值为 `None`。
当该值为 `None` 时，UDP 将根据目标地址被映射 (Address and Port-Dependent Mapping)。
当该值为 `Packet` 时，UDP 将被端点独立映射 (Endpoint Independent Mapping)，此 UDP 行为也被称为 FullCone 或 NAT1。

### ClientObject

```json
{
    "password": "password",
    "email": "love@v2fly.org",
    "level": 0,
}
```

> `password`: string

必填，任意字符串。

> `email`: string

邮件地址，可选，用于标识用户

> `level`: number

用户等级，默认值为 `0`。详见 [本地策略](../policy.md)。

### FallbackObject

```json
{
    "alpn": "",
    "path": "",
    "dest": 80,
    "xver": 0
}
```

v4.31.0+，V2Ray 的 Trojan 有完整的 VLESS fallbacks 支持，配置方式完全一致，后续 VLESS fallbacks 升级时会同步跟进。

触发回落的条件也基本相同：首包长度 < 58 或第 57 个字节不为 '\r'（因为 Trojan 没有协议版本）或身份认证失败。

## OutboundConfigurationObject

```json
{
    "servers": [
        {
            "address": "127.0.0.1",
            "port": 1234,
            "password": "password",
            "email": "love@v2fly.org",
            "level": 0
        }
    ]
}
```

> `servers`: \[ [ServerObject](#serverobject) \]

一个数组，其中每一项是一个 [ServerObject](#serverobject)。

### ServerObject

```json
{
    "address": "127.0.0.1",
    "port": 1234,
    "password": "password",
    "email": "love@v2fly.org",
    "level": 0
}
```

> `address`: address

服务器地址，支持 IPv4、IPv6 和域名。必填。

> `port`: number

服务器端口，必填。

> `password`: string

必填，任意字符串。

> `email`: string

邮件地址，可选，用于标识用户

> `level`: number

用户等级
