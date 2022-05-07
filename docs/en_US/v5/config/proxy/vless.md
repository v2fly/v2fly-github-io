# VLESS

:::tip
VLESS is designed to operate in correctly configured TLS connections, as it does not provide encryption on its own.
:::

::: warning
VLESS is deprecated and subject to removal. 

Please consider using the Trojan protocol as a replacement for new deployments. 
:::
## VLESS Inbound
* Name: `vless`
* Type: Inbound Protocol
* ID: `inbound.vless`

> `users` : [string]

A set of recognized uuid for this inbound.

## VLESS Outbound
* Name: `vless`
* Type: Outbound Protocol
* ID: `outbound.vless`

> `address`: string

The server address. Both IP and domain name is supported.

> `port`: number

The server port number.

> `uuid`: string

A password recognized by server.
