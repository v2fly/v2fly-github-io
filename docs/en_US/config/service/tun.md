# Tun
* Name: `tun`
* Type: Service
* ID: `service.tun`

Tun is an interface that accepts and forwards packet based network traffic, and converts traffic processed by inbounds to streams. (v5.9.0+)

Look at its [pull request](https://github.com/v2fly/v2ray-core/pull/2541) for working examples of how to configure it.

Supports Linux operating system on amd64 and arm64.

### Tun

> `name`: string

The name of the tun interface.

> `mtu`: number

The mtu of the tun interface. The recommanded value is 1500.

> `tag`: string

The inbound tag associated with tun generated traffic.

> `ips`: [ [IPObject](#ipobject) ]

The ip address associated with tun. You will need to add them to tun on the operating system side as well.

> `routes`: [ [RouteObject](#routeobject) ]

The routes associated with tun. You will need to add them to tun on the operating system side as well.

> `enablePromiscuousMode`: bool

Recommanded to set to true.

> `enableSpoofing`: bool

Recommanded to set to true.

> `packetEncoding`:  \["None" | "Packet"\]

UDP packet encoding method，`None` by default。

When this value is `None` , UDP connections will be split into streams based on their destination (Address and Port-Dependent Mapping)。

When this value is `Packet`, UDP connections from a single source connection will be encoded as UDP packet addr connection, which will be restored to its original form by a supported outbound as an Endpoint Independent Mapping UDP connection.
This UDP behaviour is also known as FullCone or NAT1.

> `sniffingSettings`: [SniffingObject](../inbounds.md/#sniffingobject)

The sniffing settings for the tun inbound. It allows the connection to be routed based on its content and metadata.（v5.11.0+）

### IPObject

> `ip`: [ number ]

The IP address in base 10 expression.

> `prefix`: number

### RouteObject

> `ip`: [ number ]

> `prefix`: number
