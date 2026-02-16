# HTTPUpgrade

HTTPUpgrade 是一种新型传输协议，在完成一个 HTTP 1.1 协议升级握手后直接使用连接传输数据。它类似于 WebSocket，但避免了使用 WebSocket 库所带来的相关开销，同时保证了流量可以被许多反向代理和 CDN（内容分发网络）转发。(v5.10.0+)

## 工作原理

HTTPUpgrade 利用 HTTP/1.1 的协议升级机制（类似于 WebSocket 的握手过程），完成握手后立即切换到原始数据传输模式。这使得它在保持与 WebSocket 相似兼容性的同时，拥有更低的开销和更好的性能。

## 优势

* **高性能**：无需 WebSocket 帧封装，减少了额外的计算开销
* **广泛兼容**：可以通过大多数 HTTP/1.1 代理和 CDN
* **简单实现**：协议更简单，易于实现和调试
* **TLS 友好**：与 TLS 配合使用时表现良好

## HTTPUpgrade 流传输协议

* 名称: `httpupgrade`
* 类型: 传输协议
* ID: `stream.httpupgrade`

## 配置

```json
{
  "path": "/upgrade",
  "host": "example.com",
  "headers": [
    {
      "key": "User-Agent",
      "value": "Mozilla/5.0"
    }
  ],
  "maxEarlyData": 2048,
  "earlyDataHeaderName": "Sec-WebSocket-Protocol"
}
```

> `path`: string

HTTP 路径，用于协议升级请求。

* 默认值：`"/"`
* 可以自定义为任意路径，如 `"/upgrade"`, `"/v2ray"` 等
* 建议使用不容易被识别的路径

> `host`: string

HTTP Host 头的值。

* 用于指定请求的主机名
* 在使用 CDN 或反向代理时特别重要
* 应该与 TLS 的 SNI 保持一致

> `headers`: [ struct{ key, value string } ]

自定义 HTTP 头，用于增加请求的伪装效果。(v5.24.0+)

* 每个头是一个包含 `key` 和 `value` 的对象
* 可以添加常见的浏览器请求头来提高伪装效果
* 默认值为空

示例：
```json
"headers": [
  {
    "key": "User-Agent",
    "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  },
  {
    "key": "Accept",
    "value": "text/html,application/xhtml+xml"
  }
]
```

> `maxEarlyData`: number

前置数据的最大长度，用于减少连接建立时间。

* 单位：字节
* 前置数据会在协议握手时一起发送，减少往返次数
* 典型值：2048 或 4096
* 设置为 0 表示禁用前置数据

> `earlyDataHeaderName`: string

发送前置数据的 HTTP 头名称。(v5.24.0+)

* 设置后，前置数据将通过指定的 HTTP 头发送
* 如果留空，则使用基于路径的方式附加前置数据
* 推荐值：`"Sec-WebSocket-Protocol"`

## 使用示例

### 示例 1：基础客户端配置

```json
{
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "address": "server.example.com",
        "port": 443,
        "uuid": "b831381d-6324-4d53-ad4f-8cda48b30811"
      },
      "streamSettings": {
        "network": "httpupgrade",
        "security": "tls",
        "httpupgradeSettings": {
          "path": "/upgrade",
          "host": "server.example.com"
        },
        "tlsSettings": {
          "serverName": "server.example.com"
        }
      }
    }
  ]
}
```

### 示例 2：带自定义头的配置

```json
{
  "streamSettings": {
    "network": "httpupgrade",
    "security": "tls",
    "httpupgradeSettings": {
      "path": "/api/upgrade",
      "host": "www.example.com",
      "headers": [
        {
          "key": "User-Agent",
          "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        },
        {
          "key": "Accept-Language",
          "value": "en-US,en;q=0.9"
        }
      ]
    }
  }
}
```

### 示例 3：服务端配置

```json
{
  "inbounds": [
    {
      "port": 443,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "b831381d-6324-4d53-ad4f-8cda48b30811"
          }
        ]
      },
      "streamSettings": {
        "network": "httpupgrade",
        "security": "tls",
        "httpupgradeSettings": {
          "path": "/upgrade"
        },
        "tlsSettings": {
          "certificates": [
            {
              "certificateFile": "/path/to/cert.crt",
              "keyFile": "/path/to/key.key"
            }
          ]
        }
      }
    }
  ]
}
```

### 示例 4：配合 CDN 使用

```json
{
  "streamSettings": {
    "network": "httpupgrade",
    "security": "tls",
    "httpupgradeSettings": {
      "path": "/cdn-upgrade",
      "host": "cdn.example.com",
      "headers": [
        {
          "key": "User-Agent",
          "value": "Mozilla/5.0"
        }
      ]
    },
    "tlsSettings": {
      "serverName": "cdn.example.com",
      "allowInsecure": false
    }
  }
}
```

### 示例 5：启用前置数据

```json
{
  "streamSettings": {
    "network": "httpupgrade",
    "httpupgradeSettings": {
      "path": "/upgrade",
      "host": "example.com",
      "maxEarlyData": 2048,
      "earlyDataHeaderName": "Sec-WebSocket-Protocol"
    }
  }
}
```

## 使用场景

1. **替代 WebSocket**：在需要类似 WebSocket 功能但希望减少开销的场景
2. **CDN 转发**：配合 Cloudflare 等 CDN 使用，隐藏真实服务器 IP
3. **反向代理后端**：在 Nginx、Caddy 等反向代理后使用
4. **性能优化**：相比 WebSocket 有更好的性能表现
5. **简化部署**：比 WebSocket 更容易配置和调试

## 最佳实践

1. **必须使用 TLS**：HTTPUpgrade 应该始终与 TLS 一起使用以确保安全性
2. **自定义路径**：使用不容易被识别的自定义路径，提高隐蔽性
3. **添加浏览器头**：通过 `headers` 配置添加常见的浏览器请求头
4. **配合 CDN**：利用 CDN 的全球节点分布和缓存功能
5. **启用前置数据**：适当配置 `maxEarlyData` 可以减少连接延迟

## 与 WebSocket 的对比

| 特性 | HTTPUpgrade | WebSocket |
|------|-------------|-----------|
| 性能开销 | 低 | 中等 |
| 协议复杂度 | 简单 | 复杂 |
| CDN 兼容性 | 好 | 好 |
| 浏览器支持 | 不需要 | 需要 |
| 帧封装 | 无 | 有 |
| 实现难度 | 易 | 中等 |

## 注意事项

* HTTPUpgrade 需要 v5.10.0 或更高版本支持
* 必须配合 TLS 使用才能保证安全性
* 确保 `path` 和 `host` 配置在客户端和服务端保持一致
* 使用 CDN 时，确保 CDN 支持 HTTP 协议升级
* `headers` 和 `earlyDataHeaderName` 需要 v5.24.0+ 版本
* 前置数据功能需要客户端和服务端都支持

## 相关参考

* [Pull Request #2727](https://github.com/v2fly/v2ray-core/pull/2727) - HTTPUpgrade 实现的原始提案
* [WebSocket 传输](websocket.md) - 类似的传输协议
* [TLS 配置](../stream.md#tlsobject) - TLS 安全层配置
