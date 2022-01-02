# Trojan

:::tip
Trojan 被设计工作在正确配置的加密 TLS 隧道中。
:::

## Trojan 入站

inbound.trojan

> `users` : [string]

一组服务器认可用户的密码。

## Trojan 出站

outbound.trojan

> `address`: string

服务器地址，支持 IP 地址或者域名。

> `port`: number

服务器端口号。

> `password`: string

服务器认可的 Trojan 用户的密码。
