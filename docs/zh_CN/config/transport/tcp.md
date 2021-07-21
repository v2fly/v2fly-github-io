# TCP

## TcpObject

`TcpObject` 对应传输配置的 `tcpSettings` 项。

```json
{
    "acceptProxyProtocol": false,
    "header": {
        "type": "none"
    }
}
```

> `acceptProxyProtocol`: true | false

v4.27.1+，仅用于 inbound，是否接收 PROXY protocol，默认值为 `false`。填写 `true` 时，最底层 TCP 连接建立后，请求方必须先发送 PROXY protocol v1 或 v2，否则连接会被关闭。

[PROXY protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt) 专用于传递请求的真实来源 IP 和端口，**若你不了解它，请先忽略该项**。常见的反代软件（如 HAProxy、Nginx）都可以配置发送它，VLESS fallbacks xver 也可以发送它。

> `header`: NoneHeaderObject | HttpHeaderobject

数据包头部伪装设置，默认值为 `NoneHeaderObject`。HTTP 伪装无法被其它 HTTP 服务器（如 Nginx）分流，但可以被 VLESS fallbacks path 分流。

## NoneHeaderObject

不进行伪装

```json
{
    "type": "none"
}
```

> `type`: "none"

指定不进行伪装

## HttpHeaderObject

HTTP 伪装配置必须在对应的入站出站连接上同时配置，且内容必须一致。

```json
{
    "type": "http",
    "request": {},
    "response": {}
}
```

> `type`: "http"

指定进行 HTTP 伪装

> `request`: [HTTPRequestObject](#httprequestobject)

HTTP 请求

> `response`: [HTTPResponseObject](#httpresponseobject)

HTTP 响应

## HTTPRequestObject

```json
{
    "version": "1.1",
    "method": "GET",
    "path": [
        "/"
    ],
    "headers": {
        "Host": [
            "www.baidu.com",
            "www.bing.com"
        ],
        "User-Agent": [
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_2 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) CriOS/53.0.2785.109 Mobile/14A456 Safari/601.1.46"
        ],
        "Accept-Encoding": [
            "gzip, deflate"
        ],
        "Connection": [
            "keep-alive"
        ],
        "Pragma": "no-cache"
    }
}
```

> `version`: string

HTTP 版本，默认值为 `"1.1"`。

> `method`: string

HTTP 方法，默认值为 `"GET"`。

> `path`: \[ string \]

路径，一个字符串数组。默认值为 `["/"]`。当有多个值时，每次请求随机选择一个值。

> `headers`: map{ string, \[ string \]}

HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是一个数组。每次请求会附上所有的键，并随机选择一个对应的值。默认值见上方示例。

## HTTPResponseObject
```json
{
    "version": "1.1",
    "status": "200",
    "reason": "OK",
    "headers": {
        "Content-Type": [
            "application/octet-stream",
            "video/mpeg"
        ],
        "Transfer-Encoding": [
            "chunked"
        ],
        "Connection": [
            "keep-alive"
        ],
        "Pragma": "no-cache"
    }
}
```

> `version`: string

HTTP 版本，默认值为 `"1.1"`。

> `status`: string

HTTP 状态，默认值为 `"200"`。

> `reason`: string

HTTP 状态说明，默认值为 `"OK"`。

> `headers`: map {string, \[ string \]}

HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是一个数组。每次请求会附上所有的键，并随机选择一个对应的值。默认值见上方示例。
