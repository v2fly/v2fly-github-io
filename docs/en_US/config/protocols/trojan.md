# Trojan

* Name: `trojan`
* Type: Inbound / Outbound

[Trojan](https://trojan-gfw.github.io/trojan/protocol) is an inbound/outbound protocol. It is an encrypted traffic tunnel protocol disguised as TLS traffic (such as WebSocket).

:::tip
Trojan is only designed to work in an encrypted TLS tunnel that is correctly configured.
:::

Trojan's configuration is divided into two parts, `InboundConfigurationObject` and `OutboundConfigurationObject`, corresponding to the `settings` element in the inbound and outbound protocol configuration respectively.

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
    ]
}
```

> `clients`: \[ [ClientObject](#clientobject) \]

An array, each of which is a [ClientObject](#ClientObject).

> `fallbacks`: \[ [FallbackObject](#fallbackobject) \]

An array containing a series of fallback stream configurations (optional).

### ClientObject

```json
{
    "password": "password",
    "email": "love@v2fly.org",
    "level": 0,
}
```

> `password`: string

Required, any string.

> `email`: string

Email address, optional. Used to identify users.

> `level`: number

User level, default is `0`. See [Local Policy](../policy.md).

### FallbackObject

```json
{
    "alpn": "",
    "path": "",
    "dest": 80,
    "xver": 0
}
```

Since v4.31.0+, V2Ray's Trojan has full VLESS fallbacks support. The configuration is exactly the same, and the VLESS fallbacks upgrade will follow in the future.

The trigger conditions for fallback are also very similar: the length of the first packet is `< 58`, the 57th byte is not '\r' (because Trojan has no protocol version), or the identity authentication fails.

See also: [VLESS](vless.md)

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

An array, each element is a [ServerObject](#ServerObject).

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

Remote server address. Address can be IPv4, IPv6, or a domain name. Required.

> `port`: number

Remote server port. required.

> `password`: string

Required, any string.

> `email`: string

Email address, optional. Used to identify users.

> `level`: number

User level, default is `0`. See [Local Policy](../policy.md).
