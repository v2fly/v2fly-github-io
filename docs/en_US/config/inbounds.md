# Inbounds

Inbound connections are used to receive data from the client (browser or upstream proxy server). For available protocols, see the protocol list.

## InboundObject

`InboundObject` corresponds to a child element of the `inbounds` item in the configuration file.

```json
{
    "listen": "127.0.0.1",
    "port": 1080,
    "protocol": "Protocol Name",
    "settings": {},
    "streamSettings": {},
    "tag": "Tag",
    "sniffing": {
        "enabled": true,
        "destOverride": [
            "http",
            "tls"
        ],
        "metadataOnly": false
    },
    "allocate": {
        "strategy": "always",
        "refresh": 5,
        "concurrency": 3
    }
}
```

> `listen`: address

The listening IP address for the inbound. Only IP addresses are allowed. The default value is `"0.0.0.0"` which means accepting connections on all network interfaces. Otherwise, the specified address must be already added to an existing network interface.

v4.32.0+, supports filling in Unix domain sockets. The format is an absolute path, such as `"/dev/shm/domain.socket"`. You can add `"@"` at the beginning to represent [abstract](https://www.man7.org/linux/man-pages/man7/unix.7.html). `"@@"` represents abstract with padding.

When filling in Unix domain sockets, `port` and `allocate` will be ignored, the protocols can temporarily be selected from VLESS, VMess, Trojan, and the transmission methods can be selected from TCP, WebSocket, HTTP/2.

> `port`: number | "env:variable" | string

The listening port for the inbound. Accepted formats are as follows:

* Integer value: the actual port number.

* Environment variable: starts with `"env:"`, followed by the name of an environment variable, such as `"env:PORT"`. V2Ray will parse this environment variable as a string.

* String: can be a numeric string, such as `"1234"`; or a numeric range, such as `"5-10"` which means port 5 to port 10, a total of 6 ports.

When there is only one port, V2Ray will listen for inbound connections on this port. When a port range is specified, it depends on the `allocate` setting.

> `protocol`: string

Connection protocol name. For optional values, see the protocol list.

> `settings`: InboundConfigurationObject

The specific configuration content varies depending on the protocol. For details, see `InboundConfigurationObject` in each protocol.

> `streamSettings`: [StreamSettingsObject](transport.md#streamsettingsobject)

[Low-level transmission configuration](transport.md#streamsettingsobject)

> `tag`: string

The identifier of this inbound connection, used to locate this connection in other configurations. When non-empty, its value must be unique among all `tags`.

> `sniffing`: [SniffingObject](#sniffingobject)

Try to detect the type of traffic.

> `allocate`: [AllocateObject](#allocateobject)

Port allocation settings.

## SniffingObject

```json
{
    "enabled": true,
    "destOverride": [
        "http",
        "tls"
    ],
    "metadataOnly": false
}
```

> `enabled`: true | false

Whether to enable traffic detection.

> `destOverride`: \["http" | "tls" | "quic" | "fakedns" | "fakedns+others"\]

When traffic is of the specified type, the destination of the current connection will be overridden with the destination included in the traffic.

The `fakedns+others` setting will prioritize FakeDNS virtual DNS server matching. If the IP address is within the virtual DNS server's IP address range but no corresponding domain name record is found, the matching results of `http`, `tls`, and `quic` are used. This option is only valid when `metadataOnly` is `false`. (v4.38.0+)

> `metadataOnly`: true | false

Whether to use only metadata to detect the destination address without intercepting the traffic content. Only the metadata traffic destination detection module will be activated.

If using only metadata to detect the destination address is turned off, the client must send data before the proxy server actually establishes a connection. This behavior is incompatible with protocols that require the server to initiate the first message, such as SMTP.

:::tip
["Fake" DNS server](fakedns.md) is a metadata traffic destination address detection module. The `metadataOnly` setting must be turned off to be able to use other traffic detection modules.
:::

## AllocateObject

```json
{
    "strategy": "always",
    "refresh": 5,
    "concurrency": 3
}
```

> `strategy`: "always" | "random"

Port allocation strategy. `"always"` means always allocating all specified ports. V2Ray will listen to the number of ports specified in `port`. `"random"` means randomly opening ports. Every `refresh` minutes, `concurrency` ports will be randomly selected from the `port` range to listen.

> `refresh`: number

The random port refresh interval in minutes. The minimum value is `2` and the recommended value is `5`. This property is only valid when `strategy = random`.

> `concurrency`: number

The random port number. The minimum value is `1` and the maximum value is one third of the `port` range. The recommended value is `3`.
