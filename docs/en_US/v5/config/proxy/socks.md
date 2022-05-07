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

## Socks Outbound
* Name: `socks`
* Type: Outbound Protocol
* ID: `outbound.socks`

> `address`: string

The server address.

> `port`: number

The server port.
