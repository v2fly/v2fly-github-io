
# Inbounds

Inbound connections are used to receive data from clients (such as browsers or downstream proxy servers). The available protocols can be found in the protocols list.

## InboundObject

`InboundObject` corresponds to an object of the `inbounds` array in the configuration file.

```json
{
    "listen": "127.0.0.1",
    "port": 1080,
    "protocol": "PROTOCOL",
    "settings": {},
    "streamSettings": {},
    "tag": "LABEL",
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

A specific IP address from which to listen for inbound connections. The default value `"0.0.0.0"` means that all connections from all network interfaces are accepted. Otherwise, the address of an existing network interface must be specified.

Starting from v4.32.0, a Unix domain socket is also supported, in the format of an absolute path, such as `"/dev/shm/domain.socket"`, with `"@"` prepended to represent [abstract sockets](https://www.man7.org/linux/man-pages/man7/unix.7.html), or `"@@"` to represent abstract sockets with padding.

While a Unix domain socket is configured, `port` and `allocate` will be ignored, and currently only the protocols VLESS, VMess, and Trojan, as well as the transports TCP, WebSocket, and HTTP/2 are supported.

> `port`: number | "env:variable" | string

The port to listen for incoming connections on. Accepted formats are as follows:

* Integer: Actual port number.
* Environment variable: Starts with `"env:"`, followed by the name of an environment variable, such as `"env:PORT"`. V2Ray parses this environment variable as a string.
* String: Can be a numeric string, such as `"1234"`; or a numeric range, such as `"5-10"`, for ports 5 to 10, a total of 6 ports.

When there is only one port specified, V2Ray listens for inbound connections on this port. When a port range is specified, behaviour will depend on the `allocate` setting.

> `protocol`: string

The name of the connection protocol. Available values are listed in the protocol list.

> `settings`: InboundConfigurationObject

Protocol-specific configurations, if applicable. See `InboundConfigurationObject` in each protocol.

> `streamSettings`: [StreamSettingsObject](transport.md#streamsettingsobject)

[Transport-specific configurations](transport.md#StreamSettingsObject)

> `tag`: string

The label or identifier of this inbound connection, used to locate this connection in other configurations. When it is not empty, its value must be unique among all `tag`s.

> `sniffing`: [SniffingObject](#sniffingobject)

Configure whether the server should detect the type of incoming traffic, and change behaviour for specific protocols.

> `allocate`: [AllocateObject](#allocateobject)

Configure how the server should bind to multiple ports, if applicable.

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

Whether to enable detection of and routing by incoming traffic type.

> `destOverride`: \\["http" | "tls" | "quic" | "fakedns" | "fakedns+others"\\]

If traffic of a specific type is detected, the destination of the current connection is rerouted according to the included destination address.

The `fakedns+others` option first attempts to query the FakeDNS virtual DNS server. If the destination IP address is within the targeted IP range of FakeDNS, but no corresponding DNS record is actually available, `http`, `tls`, or `quic` are used depending on original protocol. This option is only valid when `metadataOnly` is set to `false`. (v4.38.0+)

> `metadataOnly`: true | false

Whether to only use protocol metadata to infer the target destination without intercepting actual traffic content. Only metadata detection modules will be active.

When enabled, the client must first send data before the proxy server actually establishes a connection. This behaviour is incompatible with protocols that requires the server to initiate a connection from the first inbound message, such as SMTP.

:::tip
[Virtual DNS server](fakedns.md) is a metadata traffic destination detection module. Traffic detection modules need to disable `metadataOnly` in order for it to function.
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

Chooses the port allocation strategy to use. `"always"` will always allocate every specified port, and V2Ray will listen to as many ports as specified in `port`. `"random"` will randomly bind ports, randomly selecting as many as `concurrency` ports from the `port` range every `refresh` minutes.

> `refresh`: number

The interval of random port refresh, in minutes. The minimum is `2`, and it is recommended to be set to `5`. Ignored when strategy is not set to `random`.

> `concurrency`: number

Amount of ports to randomly bind to at any given time. The minimum is `1`, the maximum is 1/3 of the total port range, and it is recommended to be set to `3`.
