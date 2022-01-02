# inbounds
inbound

```json
{
  "protocol":"vmess",
  "settings":{},
  "port":"",
  "listen":"",
  "tag":"",
  "sniffing":{},
  "streamSettings":{}
}
```

> `protocol`: name of `<inbound>`

The name of the inbound [proxy](proxy.md) protocol.

> `settings`: settings of `<inbound>`

The settings for the inbound [proxy](proxy.md) protocol.

> `port`: string

The listening port for the inbound.

It can be ``"443"`` or `"20-21"` or `"22,3389"` .

> `listen`: string

The listening IP address for the inbound.

> `tag`: string

The Tag of the inbound. This is used as an identifier for outbounds.

> `sniffing`: [SniffingObject](#SniffingObject)

The sniffing settings for the inbound. It allows the connection to be routed based on its content and metadata.

> `streamSettings`: [StreamObject](stream.md)

The stream settings for the inbound. This determine how the protocol data is transferred.

## Supported Proxy Protocol

* [SOCKS](proxy/socks.md)
* [VMess](proxy/vmess.md)
* [Shadowsocks](proxy/shadowsocks.md)
* [HTTP](proxy/http.md)
* [Dokodemo](proxy/dokodemo.md)
* [Trojan](proxy/trojan.md)
* [VLESS](proxy/vless.md)

## SniffingObject

> `enabled`: true | false

> `destOverride`: [ string ]

> `metadataOnly`: true | false
