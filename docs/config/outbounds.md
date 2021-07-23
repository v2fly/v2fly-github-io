# Outbounds

Outbound connections are used to send data to remote websites or the next level of proxy server. For available protocols, see the protocol list.

## OutboundObject

`OutboundObject` corresponds to a child element of the `outbounds` item in the configuration file.

```json
{
    "sendThrough": "0.0.0.0",
    "protocol": "Protocol Name",
    "settings": {},
    "tag": "Tag",
    "streamSettings": {},
    "proxySettings": {
        "tag": "another-outbound-tag"
    },
    "mux": {}
}
```

> `sendThrough`: address

The IP address used to send data, valid when the host has multiple IP addresses, the default value is `"0.0.0.0"`.

> `protocol`: string

The name of the connection protocol. See the protocol list for optional values.

> `settings`: OutboundConfigurationObject

The specific configuration content varies depending on the protocol. See `OutboundConfigurationObject` in each protocol for details.

> `tag`: string

The identifier of this outbound connection, used to locate this connection in other configurations. When its value is not empty, it must be unique among all tags.

> `streamSettings`: [StreamSettingsObject](transport.md#streamsettingsobject)

[Low-level transmission configuration](transport.md#streamsettingsobject)

> `proxySettings`: [ProxySettingsObject](#proxysettingsobject)

Outbound proxy configuration. When the outbound proxy is in effect, the `streamSettings` of this outbound protocol will not work.

> `mux`: [MuxObject](#muxobject)

[Mux Configuration](#muxobject).

## ProxySettingsObject

```json
{
    "tag": "another-outbound-tag"
}
```

> `tag`: string

When the identifier of another outbound protocol is specified, the data sent by this outbound protocol will be forwarded to the specified outbound protocol.

## MuxObject

The function of Mux is to distribute the data of multiple TCP connections on one TCP connection. See [Mux.Cool](../developer/protocols/muxcool.md) for implementation details. Mux is designed to reduce TCP's handshake delay, not to increase connection throughput. Using Mux to watch videos, download or measure speed usually has the opposite effect. Mux only needs to be enabled on the client side, and the server side automatically adapts.

`MuxObject` corresponds to the `mux` item in `OutboundObject`.

```json
{
    "enabled": false,
    "concurrency": 8
}
```

> `Enabled`: true | false

Whether to enable Mux forwarding requests, the default value is `false`.

> `concurrency`: number

The maximum number of concurrent connections. The minimum value is `1`, the maximum value is `1024`, and the default value is `8`.

Fill in a negative number, such as `-1`, do not load the mux module (v4.22.0+).

This value indicates the maximum number of Mux connections carried on a TCP connection. When the client sends 8 TCP requests and `concurrency=8`, V2Ray will only send an actual TCP connection, and all 8 requests of the client are transmitted by this TCP connection.
