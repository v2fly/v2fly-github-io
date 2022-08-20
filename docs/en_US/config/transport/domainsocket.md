# DomainSocket

:::warning
Since v4.32.0, it is recommended to use [InboundObject](../../config/inbounds.md)'s new `listen` parameter instead, which provides the same features, combined with another supported transport such as TCP, WebSocket, or HTTP/2. DomainSocket as a TransportObject  may become deprecated in the future.
:::

Domain Socket uses the standard Unix domain socket to transfer data. Its main advantage is that it utilizes the existing network stack of the operating system, and does not tend to hog the networking cache. Compared to a traditional loopback, the Domain Socket can be slightly faster.

Domain Socket is currently only available on platforms which support Unix domain sockets, such as Linux and macOS. It is unavailable on Windows 10 builds older than 17036.

If Domain Socket is specified as the active transport, the port and/or IP address configured in relevant inbounds and outbounds will be completely ignored, and all transfers will be handled by the domain socket instead.

## DomainSocketObject

The `DomainSocketObject` corresponds to the `dsSettings` element in the transport configuration.

```json
{
    "path": "/path/to/ds/file",
    "abstract": false,
    "padding": false
}
```

> `path`: string

A valid file path pointing to the Domain Socket. This file must not exist before V2Ray starts.

> `abstract`: true | false

Whether the target is an abstract domain socket. The default is `false`.

> `padding`: true | false

(Since v4.28.1) Whether the target is an abstract domain socket with padding. The default is `false`.
