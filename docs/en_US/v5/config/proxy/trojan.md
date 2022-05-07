# Trojan

:::tip
Trojan is designed to operate in correctly configured TLS connections, as it does not provide encryption on its own.
:::

## Trojan Inbound
* Name: `trojan`
* Type: Inbound Protocol
* ID: `inbound.trojan`

> `users` : [string]

A set of recognized password for this inbound.

## Trojan Outbound
* Name: `trojan`
* Type: Outbound Protocol
* ID: `outbound.trojan`

> `address`: string

The server address. Both IP and domain name is supported.

> `port`: number

The server port number.

> `password`: string

A password recognized by server.
