# VLESS

VLESS 是一个无状态的轻量传输协议，它分为入站和出站两部分，可以作为 V2Ray 客户端和服务器之间的桥梁。

:::tip
VLESS 没有自带加密，请用于可靠信道，如 TLS。
:::


:::warning
VLESS 已被弃用并且可能被移除。

请考虑使用 Trojan 作为替代品。
:::

## VLESS 入站

inbound.vless

> `users` : [string]

一组服务器认可用户的 ID，必须为合法的 UUID。

## VLESS 出站

outbound.vless

> `address`: string

服务器地址，支持 IP 地址或者域名。

> `port`: number

服务器端口号。

> `uuid`: string

服务器认可的 VLESS 用户 ID，必须为合法的 UUID。
