# TCP

## TcpObject

`TcpObject` corresponds to the `tcpSettings` element of the transport configuration.

```json
{
    "acceptProxyProtocol": false,
    "header": {
        "type": "none"
    }
}
```

> `acceptProxyProtocol`: true | false

(Since v4.27.1) For inbounds only, whether to use PROXY connections. Default value is `false`. When set to `true`, after establishing the TCP connection, the client must follow up with PROXY protocol v1 or v2; otherwise the connection will be immediately closed.

[PROXY protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt) is used for transmitting the true origin IP and port of requests for routing purposes. **This is for advanced usage only; please ignore it if you do not understand.**. Most common proxy software (such as HAProxy, Nginx) can be configured to utilize PROXY, and VLESS Fallbacks `xver` can also utilize it.

> `header`: NoneHeaderObject | HttpHeaderobject

Packet header obfuscation settings, default value is `NoneHeaderObject`. HTTP obfuscation cannot be load balanced by other HTTP servers (such as Nginx), but can be load-balanced by a VLESS Fallbacks `path`.

## NoneHeaderObject

A dummy object which disables obfuscation.

```json
{
    "type": "none"
}
```

> `type`: "none"

Specifies to perform no obfuscation.

## HttpHeaderObject

HTTP obfuscation must be configured on the corresponding inbound and outbound at the same time, and the configuration must be symmetrical.

```json
{
    "type": "http",
    "request": {},
    "response": {}
}
```

> `type`: "http"

Specifies to obfuscation as HTTP.

> `request`: [HTTPRequestObject](#httprequestobject)

HTTP request, see [HTTPRequestObject](#HTTPRequestObject).

> `response`: [HTTPResponseObject](#httpresponseobject)

HTTP response, see [HTTPResponseObject](#HTTPResponseObject).

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

HTTP version. Default value is `"1.1"`.

> `method`: string

HTTP method. Default value is `"GET"`.

> `path`: \[ string \]

An array of strings representing URLs to query. Default value is `["/"]`. If multiple values are present, a random value is selected for each request.

> `headers`: map{ string, \[ string \]}

HTTP request headers. Key-value pairs where each key represents the name of an HTTP header, and the corresponding value is an array of values for the header. All keys will be attached as headers to each request, and a random value corresponding to the key will be selected from its array, if multiple are present. Defaults are as shown in the example above.

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

HTTP version. Default value is `"1.1"`.

> `status`: string

HTTP status. Default value is `"200"`.

> `reason`: string

HTTP status message. Default value is `"OK"`.

> `headers`: map {string, \[ string \]}

HTTP response headers. Key-value pairs where each key represents the name of an HTTP header, and the corresponding value is an array of values for the header. All keys will be attached as headers to each request, and a random value corresponding to the key will be selected from its array, if multiple are present. Defaults are as shown in the example above.
