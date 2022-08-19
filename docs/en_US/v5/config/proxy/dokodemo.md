# Dokodemo

Dokodemo door is an inbound data protocol. It can listen to a local port and send all data entering this port to a port of the designated server, so as to achieve the effect of port mapping.


## Dokodemo Inbound
* Name: `blackhole`
* Type: Inbound Protocol
* ID: `inbound.blackhole`

> `address`: string

Forward traffic to this address. It can be an IP address, like `"1.2.3.4"`, or a domain name, like `"v2ray.com"`. String type.

When `followRedirect` (see below) is `true`, `address` can be empty.

> `port`: number

Forward traffic to the specified port of the destination address, range \[1, 65535\], numeric type. Required parameters.

> `networks`: string

The type of network protocol that can be received. For example, when it is specified as `"tcp"`, any gate will only receive TCP traffic. The default value is `"tcp"`.

> `followRedirect`: true | false

When the value is `true`, dokodemo-door will recognize the data forwarded by iptables and forward it to the corresponding destination address. 
