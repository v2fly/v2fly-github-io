# 服务器端点配置

## ServerEndpointObject

`ServerEndpointObject` 定义了代理协议的服务器端点信息，用于配置客户端连接到远程服务器的参数。

### Structure

```json
{
  "address": "example.com",
  "port": 443,
  "user": []
}
```

### Fields

> `address`: string

服务器地址。可以是：

* 域名：如 `"example.com"`、`"proxy.example.org"`
* IPv4 地址：如 `"1.2.3.4"`
* IPv6 地址：如 `"[2001:db8::1]"`（需要使用方括号）

建议使用域名，以便于服务器 IP 变更时无需修改配置。

> `port`: uint32

服务器端口号。

* 必须是 1-65535 之间的有效端口号
* 常用端口：443（HTTPS）、80（HTTP）、10086 等
* 确保该端口在服务器上已正确开放并配置

> `user`: [[User](user.md#userobject)]

用户列表。一个包含多个 [UserObject](user.md#userobject) 的数组，定义了可以连接到此服务器的用户身份信息。

* 每个 UserObject 包含用户的认证信息（如 UUID、密码等）
* 可以配置多个用户，实现多用户共享同一服务器
* 具体的用户配置格式取决于所使用的协议

## 使用示例

### VMess 协议的服务器端点配置

```json
{
  "address": "server.example.com",
  "port": 10086,
  "user": [
    {
      "id": "27848739-7e62-4138-9fd3-098a63964b6b",
      "alterId": 0,
      "security": "auto",
      "level": 0
    }
  ]
}
```

### Shadowsocks 协议的服务器端点配置

```json
{
  "address": "ss.example.com",
  "port": 8388,
  "user": [
    {
      "method": "aes-256-gcm",
      "password": "your-password-here",
      "level": 0
    }
  ]
}
```

### Trojan 协议的服务器端点配置

```json
{
  "address": "trojan.example.com",
  "port": 443,
  "user": [
    {
      "password": "your-password-here",
      "email": "user@example.com",
      "level": 0
    }
  ]
}
```

## 相关配置

ServerEndpointObject 通常在以下场景中使用：

* **出站配置**：在客户端的 outbound 配置中，指定要连接的服务器
* **多服务器配置**：可以配置多个 ServerEndpointObject 实现负载均衡或故障转移
* **协议特定配置**：不同协议对 user 字段的要求不同，需参考具体协议文档

## 注意事项

* 确保 `address` 可以被客户端正确解析
* `port` 必须与服务器端配置一致
* `user` 数组中至少要有一个有效的用户配置
* 使用 IPv6 地址时必须用方括号包裹
* 建议使用 TLS/HTTPS 端口（如 443）以避免被识别为代理流量
