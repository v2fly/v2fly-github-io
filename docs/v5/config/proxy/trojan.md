# Trojan

:::tip
Trojan 被设计工作在正确配置的加密 TLS 隧道中。
:::

## Trojan 入站

inbound.trojan

> `users` : [string]

一组服务器认可用户的密码。

> `packetEncoding`:  \["None" | "Packet"\]

UDP 包编码方式，默认值为 `None`。(v5.4.0+)
当该值为 `None` 时，UDP 将根据目标地址被映射 (Address and Port-Dependent Mapping)。
当该值为 `Packet` 时，UDP 将被端点独立映射 (Endpoint Independent Mapping)，此 UDP 行为也被称为 FullCone 或 NAT1。

## Trojan 出站

outbound.trojan

> `address`: string

服务器地址，支持 IP 地址或者域名。

> `port`: number

服务器端口号。

> `password`: string

服务器认可的 Trojan 用户的密码。
