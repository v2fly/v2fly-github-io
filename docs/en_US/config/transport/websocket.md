# WebSocket

Use standard WebSocket as the transport. WebSocket connections can be load-balanced by other HTTP servers (such as Nginx), or a VLESS Fallbacks `path`.

:::tip
WebSocket will recognize the X-Forwarded-For header of the HTTP request to override the source address of the incoming traffic, with a higher priority than specified by any PROXY protocol data.
:::

## WebSocketObject

`WebSocketObject` corresponds to the `wsSettings` item in the transfer configuration.

```json
{
    "acceptProxyProtocol": false,
    "path": "/",
    "headers": {
        "Host": "v2ray.com"
    },
    "maxEarlyData": 1024,
    "useBrowserForwarding": false,
    "earlyDataHeaderName":""
}
```

> `acceptProxyProtocol`: true | false

(Since v4.27.1) For inbounds only, whether to use PROXY connections. Default value is `false`. When set to `true`, after establishing the TCP connection, the client must follow up with PROXY protocol v1 or v2; otherwise the connection will be immediately closed.

[PROXY protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt) is used for transmitting the true origin IP and port of requests for routing purposes. **This is for advanced usage only; please ignore it if you do not understand.**. Most common proxy software (such as HAProxy, Nginx) can be configured to utilize PROXY, and VLESS Fallbacks `xver` can also utilize it.

> `path` string

The HTTP path used by WebSocket. The default value is `"/"`.

> `headers`: map \{string: string\}

Custom HTTP headers. A key-value pair where each key represents the name of an HTTP header, and the corresponding value is a string. Optional.

> `maxEarlyData`: number

(Since v4.37.0) The maximum length of the data to be sent in advance, used to reduce the time to establish a connection.

The data will be appended in a Base64 RawURLEncoding format after the `path`. Forwarding needs to be done according to the prefix.

For the receiving party, setting any non-0 value indicates that early data is supported.

(Since v4.39.0) If `earlyDataHeaderName` is set, the early data will be placed in the specified HTTP header.

> `useBrowserForwarding`: true | false

(Since v4.37.0) Whether to enable browser forwarding. If browser forwarding is enabled, the corresponding WebSockets connection will be forwarded through the browser forwarding module and then sent to its destination.

The server will automatically adapt to the browser forwarding function of the client; no additional configuration is required.

Only compatible with early data (`maxEarlyData`) based on `path` or a HTTP header named "Sec-WebSocket-Protocol".

See also [BrowserForwarderObject](../browserforwarder.md).

> `earlyDataHeaderName` :  string

(Since v4.39.0) The HTTP header to use for early data. Set to enable early data in the HTTP header. If it is left blank, early data based on `path` will be used.

The browser forwarding function can be enabled only when the name of the HTTP header is `"Sec-WebSocket-Protocol"`.

:::tip
The implementation of V2Ray's WebSocket Early Data is compatible with other projects which implement it, and can be connected to other WebSocket servers after being correctly configured.

The clients of other projects may not be able to connect to the V2Ray WebSocket server.
