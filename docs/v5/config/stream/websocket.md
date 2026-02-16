# WebSocket

WebSocket 是一个基于 HTTP 的传输协议，提供了全双工通信通道。它被广泛支持，可以通过大多数 HTTP 代理、CDN 和防火墙。

## WebSocket Stream

stream.ws

## 配置

```json
{
  "path": "/v2ray",
  "headers": {
    "User-Agent": "Mozilla/5.0",
    "Host": "example.com"
  },
  "maxEarlyData": 2048,
  "earlyDataHeaderName": "Sec-WebSocket-Protocol",
  "useBrowserForwarding": false,
  "acceptProxyProtocol": false
}
```

> `acceptProxyProtocol`: true | false

仅用于入站，是否接收 Proxy Protocol，默认值为 `false`。该值为 `true` 时，底层 TCP 连接建立后，请求方必须先发送 Proxy Protocol，否则连接将被关闭。

[Proxy Protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt) 用于传递请求的真实来源 IP 和端口。适用于在反向代理后部署时保留客户端真实 IP。

> `path`: string

WebSocket 所使用的 HTTP 协议路径，默认值为 `"/"`。

* 可以自定义为任意路径，如 `"/v2ray"`, `"/ws"` 等
* 建议使用不容易被识别的路径以提高隐蔽性
* 在使用反向代理时，确保路径配置正确

> `headers`: map \{string: string\}

自定义 HTTP 头，一个键值对，每个键表示一个 HTTP 头的名称，对应的值是字符串。默认值为空。

常见的头部包括：
* `User-Agent`：浏览器标识
* `Host`：主机名
* `Accept-Language`：语言偏好
* 其他自定义头部

示例：
```json
"headers": {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Accept-Language": "en-US,en;q=0.9"
}
```

> `maxEarlyData`: number

所要发送的前置数据的最长长度，用于减少连接建立的时间。

* 单位：字节
* 数据会以 Base64 RawURLEncoding 的形式附加在 path 之后
* 转发时需要根据前缀进行匹配
* 如果设置 `earlyDataHeaderName` 则会将前置数据放置于该 HTTP 头
* 对于接收端，设置为任何非 0 数值都代表启用前置数据支持

> `earlyDataHeaderName`: string

发送的前置数据的 HTTP 头的名字，设置后启用基于 HTTP 头的前置数据。

* 如果留空则使用基于路径的前置数据
* 当且仅当 HTTP 头的名字为 `"Sec-WebSocket-Protocol"` 时可以启用基于 HTTP 头的前置数据浏览器转发功能
* 基于 HTTP 头的方式更加标准，推荐使用

> `useBrowserForwarding`: true | false

是否启用浏览器转发。如果启用浏览器转发，相应的 WebSocket 连接就会经过浏览器转发模块进行转发后再发送至互联网。

* v4.37.0+ 服务器端程序会自动适配客户端的浏览器转发功能，无需额外设置
* 只兼容基于路径的前置数据或者 HTTP 头的名字为 `"Sec-WebSocket-Protocol"` 的基于 HTTP 头的前置数据
* 相关配置请参考 [浏览器转发模块文档](../service/browser.md)

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
        "network": "ws",
        "security": "tls",
        "wsSettings": {
          "path": "/v2ray"
        },
        "tlsSettings": {
          "serverName": "server.example.com"
        }
      }
    }
  ]
}
```

### 示例 2：带自定义 HTTP 头的配置

```json
{
  "streamSettings": {
    "network": "ws",
    "security": "tls",
    "wsSettings": {
      "path": "/ws",
      "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Host": "www.example.com"
      }
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
        "network": "ws",
        "security": "tls",
        "wsSettings": {
          "path": "/v2ray"
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

### 示例 4：启用前置数据

```json
{
  "streamSettings": {
    "network": "ws",
    "wsSettings": {
      "path": "/ws",
      "maxEarlyData": 2048,
      "earlyDataHeaderName": "Sec-WebSocket-Protocol"
    }
  }
}
```

### 示例 5：配合 Nginx 反向代理

客户端配置：
```json
{
  "streamSettings": {
    "network": "ws",
    "security": "tls",
    "wsSettings": {
      "path": "/ray",
      "headers": {
        "Host": "example.com"
      }
    }
  }
}
```

对应的 Nginx 配置：
```nginx
location /ray {
    proxy_pass http://127.0.0.1:10000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

V2Ray 服务端配置：
```json
{
  "inbounds": [
    {
      "port": 10000,
      "listen": "127.0.0.1",
      "protocol": "vmess",
      "settings": {
        "clients": [{"id": "uuid"}]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/ray"
        }
      }
    }
  ]
}
```

### 示例 6：使用 Proxy Protocol

```json
{
  "inbounds": [
    {
      "port": 10000,
      "protocol": "vmess",
      "settings": {
        "clients": [{"id": "uuid"}]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/ws",
          "acceptProxyProtocol": true
        }
      }
    }
  ]
}
```

## 使用场景

1. **CDN 加速**：配合 Cloudflare 等 CDN 使用，隐藏真实服务器 IP
2. **反向代理后端**：在 Nginx、Caddy、Apache 等反向代理后部署
3. **防火墙穿透**：WebSocket 流量通常不会被企业防火墙拦截
4. **广泛兼容性**：几乎所有的 HTTP 代理都支持 WebSocket
5. **伪装流量**：看起来像普通的网站 WebSocket 连接

## 最佳实践

1. **必须使用 TLS**：在公网环境下务必启用 TLS 加密
2. **自定义路径**：避免使用默认的 `/` 路径，选择不容易被识别的路径
3. **添加 HTTP 头**：通过 `headers` 添加常见的浏览器请求头，提高伪装效果
4. **反向代理配置**：正确配置反向代理的 WebSocket 转发规则
5. **启用前置数据**：使用 `maxEarlyData` 和 `earlyDataHeaderName` 减少握手时间
6. **路径一致性**：确保客户端和服务端的 `path` 配置完全一致

## 兼容性说明

:::tip
V2Ray 的 WebSocket 前置数据实现已经完成与其他项目的兼容，正确设置后可以连接其他实现的服务器端。

其他项目的客户端可能无法连接 V2Ray 服务器端。
:::

## 注意事项

* WebSocket 需要 HTTP/1.1 协议支持
* 使用 CDN 时确保 CDN 支持 WebSocket 协议
* `acceptProxyProtocol` 只能在服务端入站使用
* 前置数据功能需要客户端和服务端都支持
* 在反向代理后使用时，需要正确配置 WebSocket 升级头
* `headers` 中的值会覆盖默认的 HTTP 头
