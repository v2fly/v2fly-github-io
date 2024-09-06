# Inbounds
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

> `sniffing`: [SniffingObject](#sniffingobject)

The sniffing settings for the inbound. It allows the connection to be routed based on its content and metadata.

> `streamSettings`: [StreamObject](stream.md)

The stream settings for the inbound. This determine how the protocol data is transferred.

## Supported Proxy Protocol

* [SOCKS](proxy/socks.md)
* [VMess](proxy/vmess.md)
* [VLite](proxy/vlite.md)
* [Shadowsocks](proxy/shadowsocks.md)
* [HTTP](proxy/http.md)
* [Dokodemo](proxy/dokodemo.md)
* [Trojan](proxy/trojan.md)
* [VLESS](proxy/vless.md)

## SniffingObject

> `enabled`: true | false

Whether to enable traffic detection.

> `destOverride`: [ string ]

When traffic is of the specified type, the destination of the current connection will be overridden with the destination included in the traffic.

The `fakedns+others` setting will prioritize FakeDNS virtual DNS server matching. If the IP address is within the IP address range of the virtual DNS server but no corresponding domain name record is found, the matching results of `http` and `tls` are used. This option is only valid when `metadataOnly` is `false`.

> `metadataOnly`: true | false

Whether to use only metadata to detect the destination address without intercepting the traffic content. Only the metadata traffic destination detection module will be activated.

If using only metadata to detect the destination address is turned off, the client must send data before the proxy server actually establishes a connection. This behavior is incompatible with protocols that require the server to initiate the first message, such as SMTP.
