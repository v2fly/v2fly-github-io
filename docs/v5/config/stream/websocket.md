# WebSocket

## WebSocket Stream
stream.ws

> `acceptProxyProtocol`: true | false

仅用于入站，是否接收 Proxy Protocol，默认值为 `false`。该值为 `true` 时，底层 TCP 连接建立后，请求方必须先发送 Proxy Protocol，否则连接将被关闭。

[Proxy Protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt) 用于传递请求的真实来源 IP 和端口。

> `path`: string

WebSocket 所使用的 HTTP 协议路径，默认值为 `"/"`。

> `headers`: map \{string: string\}

自定义 HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是字符串。默认值为空。

> `maxEarlyData`: number

所要发送的前置数据的最长长度。用于减少连接建立的时间。
数据会以 Base64 RawURLEncoding 的形式附加在 path 之后，转发时需要根据前缀进行匹配。

如果设置 `earlyDataHeaderName` 则会将前置数据放置于该 HTTP 头。

对于接收端，设置为任何非 0 数值都代表启用前置数据支持。

> `useBrowserForwarding`: true | false

是否启用浏览器转发。如果启用浏览器转发，相应的 WebSockets 连接就会经过浏览器转发模块进行转发后再发送至互联网。

v4.37.0+ 服务器端程序会自动适配客户端的浏览器转发功能，无需额外设置。

只兼容基于基于路径的前置数据或者 HTTP 头的名字为 "Sec-WebSocket-Protocol" 的启用基于 HTTP 头的前置数据。

相关配置请参考浏览器转发模块文档。[service.browser](../service/browser.md)

> `earlyDataHeaderName`: string
> 
发送的前置数据的 HTTP 头的名字，设置后启用基于 HTTP 头的前置数据。如果留空则使用基于路径的前置数据。

当且仅当 HTTP 头的名字为 "Sec-WebSocket-Protocol" 时可以启用基于 HTTP 头的前置数据浏览器转发功能。

:::tip
V2Ray 的 WebSocket 前置数据实现已经完成与其他项目的兼容，正确设置后可以连接其他实现的服务器端。

其他项目的客户端可能无法连接 V2Ray 服务器端。
:::
