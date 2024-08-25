# Shadowsocks

[Shadowsocks](https://shadowsocks.org) Protocol，mostly compatible with other implementations。

## Shadowsocks Inbound
* Name: `shadowsocks`
* Type: Inbound Protocol
* ID: `inbound.shadowsocks`

> `method` : string

Encryption method，one of [supported encryption methods](#supported encryption methods) .

> `password`: string

A recognized password for this inbound.
Shadowsocks does not mandate the length of the password, but it would be easy to crack a short password,
thus a password of 16 characters or more is recommended.

> `networks`: "tcp" | "udp" | "tcp,udp"

Enabled network type. 
For example, when `"tcp"` is specified, this inbound will only accept TCP traffic.
This value is `"tcp"` by default.

> `packetEncoding`:  \["None" | "Packet"\]

UDP packet encoding method，`None` by default。

When this value is `None` , UDP connections will be split into streams based on their destination (Address and Port-Dependent Mapping)。

When this value is `Packet`, UDP connections from a single source connection will be encoded as UDP packet addr connection, which will be restored to its original form by a supported outbound as an Endpoint Independent Mapping UDP connection.
This UDP behaviour is also known as FullCone or NAT1.

## Shadowsocks Outbound

* Name: `shadowsocks`
* Type: Outbound Protocol
* ID: `outbound.shadowsocks`

> `address`: string

The server address. Both IP and domain name is supported.

> `port`: number

The server port number.

> `method` : string

Encryption method，one of [supported encryption methods](#supported encryption methods) .

> `password`: string

A password recognized by server.

## Supported Encryption Methods

* `"AES_256_GCM"`
* `"AES_128_GCM"`
* `"CHACHA20_POLY1305"`
* `"NONE"`

::: warning
In "NONE" unencrypted and unauthenticated mode, the server will not try to validate the password.

This is typically used when authentication is already completed by the transport layer, like enabling TLS encryption and WebSocket transport with a long and unpredictable path.
:::
