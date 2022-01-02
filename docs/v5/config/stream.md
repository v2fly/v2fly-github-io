# Stream

```json
{
  "transport":"tcp",
  "transportSettings":{},
  "security":"none",
  "securitySettings":{}
}
```

> `transport`: name of <transport>

传输层协议名称。

> `transportSettings`: settings of <transport>

传输层协议设置。

> `security`: name of <security>

<!-- 传输层安全协议名称，支持的选项有 `"none"` 表示不使用传输层安全（默认值），`"tls"` 表示使用 [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)。 -->

> `securitySettings`: settings of <security>

> `socketSettings`: [SocketConfigObject](#SocketConfigObject)

## 支持的传输流协议

* [mKCP](stream/kcp.md)
* [TCP](stream/tcp.md)
* [WebSocket](stream/websocket.md)
* [gRPC](stream/grpc.md)


## TLS
security.tls

> `serverName`: string

指定服务器端证书的域名，在连接由 IP 建立时有用。当目标连接由域名指定时，比如在 Socks 入站时接收到了域名，或者由 Sniffing 功能探测出了域名，这个域名会自动用于 `serverName`，无须手动配置。

> `nextProtocol` : [string]

一个字符串数组，指定了 TLS 握手时指定的 ALPN 数值。默认值为 `["h2", "http/1.1"]`。

> `disableSystemRoot`: true | false

是否禁用操作系统自带的 CA 证书。默认值为 `false`。当值为 `true` 时，V2Ray 只会使用 `certificates` 中指定的证书进行 TLS 握手。当值为 `false` 时，V2Ray 只会使用操作系统自带的 CA 证书进行 TLS 握手。

> `pinnedPeerCertificateChainSha256` : [string]

使用 Base64 标准编码格式表示的远程服务器的证书链的SHA256散列值。在设置后，远程服务器的证书链的散列值必须为列表中的数值之一。

在连接因为此策略失败时，会展示此证书链散列。不建议使用这种方式获得证书链散列值，因为在这种情况下您没有机会验证此时服务器提供的证书是否为真实证书。

> `certificate`: [CertificateObject](#CertificateObject)


### CertificateObject

> `usage` : string

证书用途，默认值为 `"ENCIPHERMENT"`。

* `"ENCIPHERMENT"`: 证书用于 TLS 认证和加密。
* `"AUTHORITY_VERIFY"`: 证书用于验证远端 TLS 的证书。当使用此项时，当前证书必须为 CA 证书。
* `"AUTHORITY_VERIFY_CLIENT"`: 用于验证客户端身份的证书颁发机构证书。当使用此项时，当前证书必须为 CA 证书。
* `"AUTHORITY_ISSUE"`: 证书用于签发其它证书。当使用此项时，当前证书必须为 CA 证书。

:::tip
当有新的客户端请求时，假设所指定的 `serverName` 为 `"v2ray.com"`，V2Ray 会先从证书列表中寻找可用于 `"v2ray.com"` 的证书，如果没有找到，则使用任一 `usage` 为 `"issue"` 的证书签发一个适用于 `"v2ray.com"` 的证书，有效期为一小时。并将新的证书加入证书列表，以供后续使用。
:::

> `Certificate`: string

PEM 格式的证书。

> `Key`: string

PEM 格式的私钥。

> `certificateFile`: string

证书文件路径，如使用 OpenSSL 生成，后缀名为 .crt。

> `keyFile`: string

密钥文件路径，如使用 OpenSSL 生成，后缀名为 .key。目前暂不支持需要密码的 key 文件。

## SocketConfigObject

```json
{
    "mark": 0,
    "tcpFastOpen": false,
    "tproxy": "off",
    "tcpKeepAliveInterval": 0
}
```

> `mark`: number

一个整数。当其值非零时，在出站连接上标记 SO_MARK。

* 仅适用于 Linux 系统。
* 需要 CAP_NET_ADMIN 权限。

> `tcpFastOpen`: true | false

是否启用 [TCP Fast Open](https://zh.wikipedia.org/wiki/TCP%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80)。当其值为 `true` 时，强制开启 TFO；当其值为 `false` 时，强制关闭 TFO；当此项不存在时，使用系统默认设置。可用于入站出站连接。

* 仅在以下版本（或更新版本）的操作系统中可用:
  * Windows 10 (1604)
  * Mac OS 10.11 / iOS 9
  * Linux 3.16：系统已默认开启，无需配置。
  * FreeBSD 10.3

> `tcpFastOpenQueueLength`: number
入站连接的 [TCP Fast Open](https://zh.wikipedia.org/wiki/TCP%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80) 队列长度，默认值为 `4096`，仅在 Linux 中可用。

> `tproxy`: "redirect" | "tproxy" | "off"

是否开启透明代理（仅适用于 Linux）。

* `"redirect"`：使用 Redirect 模式的透明代理。支持 TCP 和 UDP 连接。
* `"tproxy"`：使用 TProxy 模式的透明代理。支持 TCP 和 UDP 连接。
* `"off"`：关闭透明代理。

透明代理需要 Root 或 CAP\_NET\_ADMIN 权限。

:::tip
当 [Dokodemo-door](proxy/dokodemo.md) 中指定了 `followRedirect`，且 `sockopt.tproxy` 为空时，`sockopt.tproxy` 的值会被设为 `"redirect"`。
:::

> `tcpKeepAliveInterval`: number

TCP 保持活跃的数据包的发送间隔，以秒为单位（仅适用于 Linux）。

0 代表保持默认值。
