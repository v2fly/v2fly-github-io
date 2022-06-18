# Shadowsocks

* Name: `shadowsocks`
* Type: Inbound / Outbound

[Shadowsocks](https://zh.wikipedia.org/wiki/Shadowsocks) is an inbound/outbound protocol. It is an encrypted and obfuscated traffic tunnel protocol. It is compatible with most other implementations.

Compatibility with original specification:

* Supports forwarding of TCP and (optionally) UDP;
* Supported encryption:
  * AES-256-GCM
  * AES-128-GCM
  * ChaCha20-Poly1305 or ChaCha20-IETF-Poly1305
  * (Since v4.27.0) Unencrypted / Plaintext

::: warning
When using "none", the server does NOT verify the password set in the "password" field. For those cases, a secure tunnel should be used at the transport layer, such as WebSocket.
:::

The Shadowsocks configuration is divided into two parts, `InboundConfigurationObject` and `OutboundConfigurationObject`, corresponding to the `settings` element in the inbound and outbound protocol configurations respectively.

## InboundConfigurationObject

```json
{
    "email": "love@v2ray.com",
    "method": "aes-256-gcm",
    "password": "PASSWORD",
    "level": 0,
    "network": "tcp",
    "ivCheck": false
}
```

> `email`: string

Email address, optional. Used to identify users.

> `method`: string

Selects the encryption type to be used for Shadowsocks. See [Encryption Methods List](#Encryption-Methods-List) for supported algorithms. Required.

> `password`: string

Required, any string. The Shadowsocks protocol does not limit the length of the password, but shorter passwords are easier to crack via brute-force, so 16 character or longer passwords are recommended.

> `level`: number

User level, default value is `0`. See [Local Policy](../policy.md).

> `network`: "tcp" | "udp" | "tcp,udp"

The types of traffic which can be received, the default is `"tcp"`.

> `ivCheck`: true | false

(Since v4.37.0) Whether to enable functions that check the cryptographic IV. Makes certain IV replay attacks more difficult.

This feature is currently disabled by default, but this may be changed in future versions.

## OutboundConfigurationObject

```json
{
    "servers": [
        {
            "email": "love@v2ray.com",
            "address": "127.0.0.1",
            "port": 1234,
            "method": "ENCRYPTION",
            "password": "PASSWORD",
            "level": 0
        }
    ]
}
```

> `servers`: \[[ServerObject](#serverobject)\]

An array, each of which is a [ServerObject](#ServerObject).

### ServerObject

```json
{
    "email": "love@v2ray.com",
    "address": "127.0.0.1",
    "port": 1234,
    "method": "ENCRYPTION",
    "password": "PASSWORD",
    "level": 0,
    "ivCheck": false
}
```

> `email`: string

Email address, optional. Used to identify users.

> `address`: address

Remote Shadowsocks server address. Address can be IPv4, IPv6, or a domain name. Required.

> `port`: number

Remote Shadowsocks server port. Required.

> `method`: string

Selects the encryption type to be used for Shadowsocks. See [Encryption Methods List](#Encryption-Methods-List) for supported algorithms. Required.

> `password`: string

Required, any string. The Shadowsocks protocol does not limit the length of the password, but shorter passwords are easier to crack via brute-force, so 16 character or longer passwords are recommended.

> `level`: number

User level, default value is `0`. See [Local Policy](../policy.md).

> `ivCheck`: true | false

(Since v4.37.0) Whether to enable functions that check the cryptographic IV. Makes certain IV replay attacks more difficult.

This feature is currently disabled by default, but this may be changed in future versions.

## Encryption Methods List

* `"aes-256-gcm"`
* `"aes-128-gcm"`
* `"chacha20-poly1305"` or `"chacha20-ietf-poly1305"`
* `"none"` or `"plain"`
