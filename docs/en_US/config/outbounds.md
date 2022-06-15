# Outbounds

Outbound connections are used to send data to remote websites or another proxy server. For available protocols, see the protocol list.

## OutboundObject

`OutboundObject` corresponds to an object of the `outbounds` array in the configuration file.

```json
{
    "sendThrough": "0.0.0.0",
    "protocol": "PROTOCOL",
    "settings": {},
    "tag": "TAG",
    "streamSettings": {},
    "proxySettings": {
        "tag": "OUTBOUND-TAG",
        "transportLayer": false
    },
    "mux": {}
}
```

> `sendThrough`: address

The IP address used to send data, which may be necessary if the host has multiple IP addresses. The default value is `"0.0.0.0"`.

> `protocol`: string

The name of the connection protocol. See the protocol list for values.

> `settings`: OutboundConfigurationObject

The specific configuration content varies depending on the protocol. See `OutboundConfigurationObject` in each protocol for details.

> `tag`: string

The identifier of this outbound connection, used to locate this connection in other configurations. When it is not empty, its value must be unique among all `tag`s.

> `streamSettings`: [StreamSettingsObject](transport.md#streamsettingsobject)

[Transport-specific configurations](transport.md#StreamSettingsObject)

> `proxySettings`: [ProxySettingsObject](#proxysettingsobject)

Outbound proxy configuration. When the outbound proxy is in effect, the `streamSettings` of this outbound protocol will not work.

> `mux`: [MuxObject](#muxobject)

[Mux Configuration](#muxobject).

## ProxySettingsObject

```json
{
    "tag": "OUTBOUND-TAG",
    "transportLayer": false
}
```

> `tag`: string

When the identifier of another outbound protocol is specified, the data sent by this outbound protocol will be forwarded to the specified outbound protocol.

> `transportLayer`: true | false

(Since v4.35.0) Whether to enable transport layer forwarding support. When enabled, the transport layer protocol of this outbound connection will remain effective (if supported).

If this option is not enabled, the transport layer protocol will be invalid when forwarding, and only the default TCP transport protocol can be used.

## MuxObject

The Mux function distributes the data of multiple TCP connections from one TCP connection. See [Mux.Cool](../developer/protocols/muxcool.md) for implementation details. Mux is designed to reduce TCP's handshake delay, not to increase connection throughput. Using Mux to watch videos, transfer files, or measure transfer speed generally will be worse. Mux only needs to be enabled on the client side, and the server side will automatically switch along with it.

`MuxObject` corresponds to the `mux` item in `OutboundObject`.

```json
{
    "enabled": false,
    "concurrency": 8
}
```

> `Enabled`: true | false

Whether to enable Mux forwarding requests. The default value is `false`.

> `concurrency`: number

The maximum number of concurrent connections. The minimum value is `1`, the maximum value is `1024`, and the default value is `8`.

(Since v4.22.0) A negative value (`-1`) will not load the Mux module at runtime.

This value indicates the maximum number of Mux connections carried on a single TCP connection. When the client sends 8 TCP requests and `concurrency` is set to `8`, V2Ray will only send one actual TCP connection, and all 8 requests of the client are transmitted by this TCP connection.
