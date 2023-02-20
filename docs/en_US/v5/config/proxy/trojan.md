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

> `packetEncoding`:  \["None" | "Packet"\]

UDP packet encoding method，`None` by default。(v5.4.0+)

When this value is `None` , UDP connections will be split into streams based on their destination (Address and Port-Dependent Mapping)。

When this value is `Packet`, UDP connections from a single source connection will be encoded as UDP packet addr connection, which will be restored to its original form by a supported outbound as an Endpoint Independent Mapping UDP connection.
This UDP behaviour is also known as FullCone or NAT1.

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
