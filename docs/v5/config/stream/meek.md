# Meek

Meek 是一个将请求编码为普通 HTTP 请求/响应的传输协议。您可以使用任何支持转发 HTTP 请求的服务（如 CDN）来转发 meek 连接。(v5.7.0+)

这个传输协议的传输速度较低，但可以绕过某些网络限制，适用于其他传输协议无法使用的情况。

## Meek 流传输协议

* 名称: `meek`
* 类型: 传输协议
* ID: `stream.meek`

## 配置

```json
{
  "url": "https://example.com/meek"
}
```

> `url`: string

服务器地址链接。必须是一个完整的 HTTP 或 HTTPS URL。

* 在客户端：指向中继服务器的 URL，所有流量将通过此 URL 进行传输
* 在服务端：通常不需要配置此字段

## 工作原理

Meek 通过将所有流量伪装成普通的 HTTP/HTTPS 请求来工作：

1. 客户端将数据编码为 HTTP POST 请求
2. 请求通过中继服务器（如 CDN）转发到实际的 V2Ray 服务器
3. 服务端解码 HTTP 请求，提取原始数据
4. 响应数据同样编码为 HTTP 响应返回

这使得流量看起来像普通的网页访问，可以利用 CDN 的全球分布节点。

## 使用示例

### 客户端配置示例

```json
{
  "outbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "vnext": [
          {
            "address": "server.example.com",
            "port": 443,
            "users": [
              {
                "id": "uuid-here"
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "network": "meek",
        "meekSettings": {
          "url": "https://cdn.example.com/meek-relay"
        },
        "security": "tls"
      }
    }
  ]
}
```

### 服务端配置示例

```json
{
  "inbounds": [
    {
      "port": 443,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "uuid-here"
          }
        ]
      },
      "streamSettings": {
        "network": "meek",
        "security": "tls",
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

## 使用场景

1. **绕过深度包检测（DPI）**：流量完全伪装成 HTTPS 流量
2. **利用 CDN 节点**：通过配置 CDN 作为中继，可以隐藏真实服务器 IP
3. **受限网络环境**：在只允许 HTTP/HTTPS 访问的网络中使用

## 注意事项

* Meek 的性能相对较低，因为每个连接都需要额外的 HTTP 封装开销
* 建议配合 TLS 使用以确保连接安全
* 如果使用 CDN 作为中继，需要确保 CDN 支持 POST 请求和双向通信
* URL 必须可达且正确配置，否则连接会失败
