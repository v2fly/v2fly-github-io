# Shadowsocks2022

[Shadowsocks2022](https://github.com/Shadowsocks-NET/shadowsocks-specs/) 协议, 与其他实现基本兼容.

::: tip
目前仅实现了出站协议，截至到 v5.12.0 版本为止并未完全拟合协议标准. 我们会在未来的更新中提高协议的协议标准拟合度.
:::

## Shadowsocks2022 出站
* 名称: `shadowsocks2022`
* 类型: 出站协议
* ID: `outbound.shadowsocks2022`

Shadowsocks2022 出站协议. (v5.12.0+)

> `address` : string

服务器地址.

> 'port': number

服务器端口号.

> `method` : string

协议加密方式。

- `2022-blake3-aes-128-gcm` 16 字节密钥.
- `2022-blake3-aes-256-gcm` 32 字节密钥.

> `psk` : string

Base64 编码的预共享密钥，其长度必须符合加密方式的要求.

> `ipsk` : [ string ]

Base64 编码的用户 ([身份提示](https://github.com/Shadowsocks-NET/shadowsocks-specs/blob/main/2022-2-shadowsocks-2022-extensible-identity-headers.md) psk) 密钥数组 , 其长度必须符合加密方式的要求.

示例:
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
