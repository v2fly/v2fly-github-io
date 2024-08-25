# Outbounds
outbound

Outbound connections are used to send data to remote websites or the next level of proxy server. For available protocols, see the protocol list.

```json
{
  "protocol":"vmess",
  "settings":{},
  "sendThrough":"1.2.3.4",
  "tag":"demo",
  "streamSettings":{},
  "proxySettings":{},
  "mux":{}
}
```

> `protocol`: name of `<outbound>`

The name of the outbound protocol.

> `settings`: settings of `<outbound>`

The settings for the outbound protocol.

> `sendThrough`: string

The local address for creating connection.

> `tag`: string

The Tag of the outbound. This is used as an identifier for outbounds.

> `streamSettings`: [StreamObject](stream.md)

The stream settings for the outbound. This determine how the protocol data is transferred.

> `proxySettings`: [ProxyObject](#proxyobject)

Forward Proxy(Proxy Chaining) settings.

> `mux`: [MuxObject](#muxobject)

Connection multiplexor settings.

> `domainStrategy`: [ "AsIs" | "UseIP" | "UseIP4" | "UseIP6" | "" ]

Control whether how domain names in outgoing connection are processed. (v5.12.0+)

- "AsIs" : Let operating system resolve it.
- "UseIP" : Resolve it with built-in dns, and use any IP address.
- "UseIP4" : Resolve it with built-in dns, and use any IPv4 address.
- "UseIP6" : Resolve it with built-in dns, and use any IPv6 address.

## Supported Proxy Protocol

* [SOCKS](proxy/socks.md)
* [VMess](proxy/vmess.md)
* [VLite](proxy/vlite.md)
* [Shadowsocks](proxy/shadowsocks.md)
* [Shadowsocks2022](proxy/shadowsocks2022.md)
* [Freedom](proxy/freedom.md)
* [Loopback](proxy/loopback.md)
* [Blackhole](proxy/blackhole.md)
* [DNS](proxy/dns.md)
* [Trojan](proxy/trojan.md)
* [HTTP](proxy/http.md)
* [VLESS](proxy/vless.md)
