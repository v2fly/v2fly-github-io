# Socks
Socks Protocol can be used to exchange proxied traffic with other applications.


## Socks Inbound
* Name: `socks`
* Type: Inbound Protocol
* ID: `inbound.socks`

> `address` : string

The server address for the purpose of UDP communication.

> `udpEnabled`: true | false

Is UDP support enabled.

> `packetEncoding`:  \["None" | "Packet"\]

UDP packet encoding method，`None` by default。

When this value is `None` , UDP connections will be split into streams based on their destination (Address and Port-Dependent Mapping)。

When this value is `Packet`, UDP connections from a single source connection will be encoded as UDP packet addr connection, which will be restored to its original form by a supported outbound as an Endpoint Independent Mapping UDP connection.
This UDP behaviour is also known as FullCone or NAT1.

## Socks Outbound
* Name: `socks`
* Type: Outbound Protocol
* ID: `outbound.socks`

> `address`: string

The server address.

> `port`: number

The server port.
