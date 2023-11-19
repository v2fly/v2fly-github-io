# Shadowsocks2022

[Shadowsocks2022](https://github.com/Shadowsocks-NET/shadowsocks-specs/) Protocol, mostly compatible with other implementations.

::: tip
Only outbound are currently implemented, and does not fully confirm to spec as of v5.12.0 . We are working on making it more align with its spec with future updates.
:::

## Shadowsocks2022 Outbound
* Name: `shadowsocks2022`
* Type: Outbound Protocol
* ID: `outbound.shadowsocks2022`

Shadowsocks2022 outbound. (v5.12.0+)

> `address` : string

Server address.

> 'port': number

Server port.

> `method` : string

- `2022-blake3-aes-128-gcm` 16 bytes key size.
- `2022-blake3-aes-256-gcm` 32 bytes key size.

> `psk` : string

Base64 encoded psk, should have exact length as required by method.

> `ipsk` : [ string ]

Base64 encoded ipsk ([identity hint](https://github.com/Shadowsocks-NET/shadowsocks-specs/blob/main/2022-2-shadowsocks-2022-extensible-identity-headers.md) psk) array, should have exact length as required by method.

Example:
```json
{
      "protocol": "shadowsocks2022",
      "settings": {
        "address": "127.0.0.1",
        "port": 20220,
        "method": "2022-blake3-aes-128-gcm",
        "psk": "oE/s2z9Q8EWORAB8B3UCxw==",
        "ipsk": [
          "qQln3GlVCZi5iJUObJVNCw=="
        ]
      }
}
```
