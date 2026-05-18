# Google Docs Viewer

Google Docs Viewer Transport 是一种通过 Google Docs Viewer 承载请求的流传输协议。客户端会将请求编码为一系列 HTTP 请求，并请求 Google Docs Viewer 代为执行这些请求。 (v5.51.0+)

此传输方式与 meek 非常相似，但请求不是由 CDN 转发，而是由 Google Docs Viewer 转发。遗憾的是，它同样较慢，只应在其他传输方式不可用时使用。此传输方式受 https://github.com/0xinf0/gdocs-tunnel 启发（该项目可能比当前 V2Ray 实现更快，因为当前 V2Ray 版本尚缺少一些优化）。

::: warning
此传输方式主要由 LLM 生成，目前应视为实验性功能。其配置格式和协议细节后续可能发生不兼容变更。

此协议在发布前尚未经过充分测试。
:::

## Google Docs Viewer 流传输协议

* 名称：`gdocsviewer`
* 类型：传输协议
* ID：`stream.gdocsviewer`

## 客户端示例

```json
{
  "log": {
    "error": {
      "level": "Debug",
      "type": "Console"
    },
    "access": {
      "type": "None"
    }
  },
  "inbounds": [
    {
      "protocol": "socks",
      "listen": "127.0.0.1",
      "port": 1080,
      "settings": {
        "udpEnabled": false,
        "address": "127.0.0.1",
        "packetEncoding": "Packet"
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "address": "www.google.com",
        "port": 443,
        "uuid": "fbaecb02-945e-471f-9790-e768a586894d"
      },
      "streamSettings": {
        "transport": "gdocsviewer",
        "transportSettings": {
          "viewerUrl": "https://drive.google.com/viewerng/viewer?embedded=false",
          "textUrl": "https://drive.google.com/viewerng/text",
          "originUrl": "http://{rand}-0-0-0-0.sslip.io:8080/",
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
          "maxRequestBytes": 872,
          "originUrlReplacementRules": [
            {
              "name": "rand",
              "pattern": "[a-z0-9]{16}"
            }
          ],
          "sharedKey": "0xjCwHGQW/pOpFa4LkjPqetQvnL29QUAeJ50og/pe1E=",
          "h2PoolSize": 4,
          "minRequestIntervalMs": 100,
          "maxViewerBodyBytes": 33554432
        },
        "security": "tls",
        "securitySettings": {
          "serverName": "www.google.com"
        }
      }
    }
  ]
}
```

## 服务器示例

```json
{
  "log": {
    "error": {
      "level": "Debug",
      "type": "Console"
    },
    "access": {
      "type": "None"
    }
  },
  "inbounds": [
    {
      "listen": "0.0.0.0",
      "port": 8080,
      "protocol": "vmess",
      "settings": {
        "users": [
          "fbaecb02-945e-471f-9790-e768a586894d"
        ]
      },
      "streamSettings": {
        "transport": "gdocsviewer",
        "transportSettings": {
          "pathPrefix": "/",
          "maxRequestBytes": 1100,
          "maxResponseBytes": 24000,
          "sharedKey": "0xjCwHGQW/pOpFa4LkjPqetQvnL29QUAeJ50og/pe1E="
        },
        "security": "none"
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom"
    }
  ]
}
```

如果服务器使用默认的 `pathPrefix`，客户端的 `originUrl` 应包含该路径，例如 `http://example.com:8080/gdocsviewer`。如果服务器设置 `"pathPrefix": "/"`，则 `originUrl` 可以指向站点根路径。

## 配置项

> `viewerUrl`: string

（仅客户端）Google Docs Viewer 页面地址。客户端会向该地址添加或覆盖 `url` 查询参数。默认值为 `https://docs.google.com/viewer`。

> `textUrl`: string

（仅客户端）Google Docs Viewer 文本端点地址。客户端会向该地址添加或覆盖 `id` 查询参数；如果未设置 `page`，会自动设置为 `0`。默认值为 `https://drive.google.com/viewerng/text`。

> `originUrl`: string

（仅客户端，必填）可被 Google Docs Viewer 访问的公开源站基础 URL。此值应与服务器上的 `pathPrefix` 匹配。

> `viewerHostHeader`: string

（仅客户端）发送给 `viewerUrl` 和 `textUrl` 的 HTTP Host 头。连接到 Google 前端 IP、同时需要指定不同 Host 头时可使用此项。

> `userAgent`: string

（仅客户端）发送给 Google Docs Viewer 的 `User-Agent`。建议使用真实浏览器的 User-Agent，以避免被 Google 阻止。

> `h2PoolSize`: number

（仅客户端）HTTP/2 连接池大小。默认值由底层 HTTP round tripper 决定。

> `maxViewerBodyBytes`: number

（仅客户端）读取 Google Docs Viewer 页面和文本响应时允许的最大响应体大小。默认值为 `33554432`。

> `minRequestIntervalMs`: number

（仅客户端）两次 Google Docs Viewer 请求之间的最小间隔，单位为毫秒。默认值为 `100`。

> `originUrlReplacementRules`: \[ [OriginUrlReplacementRule](#originurlreplacementrule) \]

（仅客户端）在每次请求构造 `originUrl` 时生成并替换占位符。可用于将 `http://{rand}-origin.example.com/` 中的 `{rand}` 替换为随机标签。

此项用于减少 Google Docs Viewer 基于源站主机名施加的限制。

> `sharedKey`: string

（客户端和服务器）可选的共享密钥。JSONv5 中该字段按 bytes 类型处理，因此应使用 Base64 编码。解码后必须为 32 字节，用作 AES-256-GCM 密钥。客户端和服务器必须配置相同的值。

未设置 `sharedKey` 时，请求路径为 `/r/{session}/{payload}/{nonce}.txt`，服务器成功响应为明文 Base64 文本。设置 `sharedKey` 后，请求路径为 `/t/{encrypted}.log`，请求与响应都会使用 AEAD 加密，并且服务器错误会以加密错误帧返回。

建议使用加密，以避免轻易被 Google 限制，或至少减少元数据泄露。

> `pathPrefix`: string

（仅服务器）服务器接受请求的路径前缀。默认值为 `/gdocsviewer`。设置为 `/` 时，服务器接受根路径下的 `/r/...` 或 `/t/...`。

> `maxRequestBytes`: number

（客户端和服务器）单个请求中可发送的最大负载大小。客户端使用该值作为单次写入请求的上限；服务器会拒绝超过此大小的请求。默认值为 `1100`。

> `maxResponseBytes`: number

（仅服务器）服务器在编码前允许写入单个响应的最大负载大小。默认值为 `65536`。通过 Google Docs Viewer 文本端点传输时，较小的值（例如 `24000`）通常更稳妥。

## OriginUrlReplacementRule

> `name`: string

占位符名称。`originUrl` 中的 `{name}` 会被替换。名称可包含字母、数字、`_`、`-` 和 `.`。

> `pattern`: string

生成替换值的有限模式语法。支持普通字符、反斜线转义、字符类和固定重复次数，例如 `[a-z0-9]{16}`。该字段不是完整的正则表达式；不支持 `+`、`*`、`?`、`|` 或分组。

同一个规则在一次请求中只生成一个值，并替换 `originUrl` 中所有相同占位符。

## 使用注意

* `originUrl` 必须是 Google Docs Viewer 可以直接访问的 HTTP URL。
* 客户端的外层出站目标通常应是可访问 Google 服务的地址，并配合 TLS `serverName` 使用。
* 建议配置 `sharedKey`，否则源站路径和响应内容不具备传输层加密保护。
* 此传输方式会产生多次 HTTP 请求，性能和可靠性受 Google Docs Viewer 行为影响。

（本文档由 LLM 协助生成，并经作者审阅。）
