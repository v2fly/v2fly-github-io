# WebSocket

使用标准的 WebSocket 来传输数据。WebSocket 连接可以被其它 HTTP 服务器（如 Nginx）分流，也可以被 VLESS fallbacks path 分流。

:::tip
Websocket 会识别 HTTP 请求的 X-Forwarded-For 头来覆写流量的源地址，优先级高于 PROXY protocol。
:::

## WebSocketObject

`WebSocketObject` 对应传输配置的 `wsSettings` 项。

```json
{
    "acceptProxyProtocol": false,
    "path": "/",
    "headers": {
        "Host": "v2ray.com"
    },
    "maxEarlyData": 1024,
    "useBrowserForwarding": false
}
```

> `acceptProxyProtocol`: true | false

v4.27.1+，仅用于 inbound，是否接收 PROXY protocol，默认值为 `false`。填写 `true` 时，最底层 TCP 连接建立后，请求方必须先发送 PROXY protocol v1 或 v2，否则连接会被关闭。

[PROXY protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt) 专用于传递请求的真实来源 IP 和端口，**若你不了解它，请先忽略该项**。常见的反代软件（如 HAProxy、Nginx）都可以配置发送它，VLESS fallbacks xver 也可以发送它。

> `path` string

WebSocket 所使用的 HTTP 协议路径，默认值为 `"/"`。

> `headers`: map \{string: string\}

自定义 HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是字符串。默认值为空。

> `maxEarlyData`: number

所要发送的前置数据的最长长度。用于减少连接建立的时间。(v4.37.0+)

数据会以 Base64 的形式附加在 path 之后，转发时需要根据前缀进行匹配。

对于接收端，任何非0数值都代表接受前置数据。

> `useBrowserForwarding`: true | false

是否启用浏览器转发。如果启用浏览器转发，相应的 WebSockets 连接就会经过浏览器转发模块进行转发后再发送至互联网。(v4.37.0+)

v4.37.0+ 服务器端程序会自动适配客户端的浏览器转发功能，无需额外设置。

相关配置请参考浏览器转发模块文档。[BrowserForwarderObject](../browserforwarder.md)
