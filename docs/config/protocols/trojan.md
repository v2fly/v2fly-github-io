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
            "password":"password",
            "email": "love@v2fly.org",
            "level": 0,
        }
    ]
}
```

> `clients`: \[[ClientObject](#clientobject)\]

一个数组，其中每一项是一个 [ClientObject](#clientobject)。

### ClientObject

```json
{
    "password":"password",
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

> `servers`: \[[ServerObject](#serverobject)\]

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