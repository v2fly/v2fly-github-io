# HTTP
HTTP Proxy Protocol can be used to exchange proxied traffic with other applications using HTTP protocol.

## HTTP Inbound
* Name: `http`
* Type: Inbound Protocol
* ID: `inbound.http`

:::tip
Although HTTP inbound could be used to provide proxy service to remote users, it does not support encryption or authentication.

It is designed for providing proxy service to a local device or local network.
:::

## HTTP Outbound
* Name: `http`
* Type: Outbound Protocol
* ID: `outbound.http`

> `address`: string

The server address. Both IP and domain name is supported.

> `port`: number

The server port number.
