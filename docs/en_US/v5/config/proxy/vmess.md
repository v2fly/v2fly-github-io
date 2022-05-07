# VMess

VMess is V2Ray's indigenous proxy protocol. The traffic is obfuscated with encryption to look like random streams.
It is required for the client and server to have an accurate clock to function correctly.

## VMess Inbound
* Name: `vmess`
* Type: Inbound Protocol
* ID: `inbound.vmess`

> `users` : [string]

The users UUIDs for this inbound.

## VMess Outbound
* Name: `vmess`
* Type: Outbound Protocol
* ID: `outbound.vmess`

> `address`: string

The server address.

> `port`: number

The server port number.

> `uuid`: string

The user UUIDs. 
