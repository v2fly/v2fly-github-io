# 用户配置

## UserObject

`UserObject` 定义了代理协议中用户的身份信息和认证凭据。不同的代理协议对用户账户有不同的要求，但都遵循此基本结构。

### 结构

```json
{
  "level": 0,
  "email": "user@example.com",
  "account": {}
}
```

### 字段

> `level`: uint32

用户等级。用于配置不同用户的策略，如连接限制、速度限制等。

* 取值范围：0-65535
* 默认值：0
* 可以在 [Policy 配置](../service/policy.md) 中根据用户等级设置不同的策略
* 较高的 level 可以配置更宽松的限制或更高的优先级

> `email`: string

用户邮箱地址。用于标识用户，可以在日志和统计中使用。

* 可以是任意字符串，不一定是真实的邮箱地址
* 建议使用易于识别的标识符，如 `"admin@local"` 或 `"user1"`
* 在多用户场景中，email 可以帮助追踪每个用户的流量使用情况
* 可以在路由规则中使用 `userEmail` 进行匹配

> `account`: {}

用户账户，具体结构取决于所使用的协议。参见各协议对应的 AccountObject 定义：

### 支持的协议及其 AccountObject

#### VMess 协议

```json
{
  "id": "27848739-7e62-4138-9fd3-098a63964b6b",
  "alterId": 0,
  "security": "auto"
}
```

* `id`: UUID 格式的用户 ID
* `alterId`: 额外 ID 数量（推荐设置为 0）
* `security`: 加密方式（auto、aes-128-gcm、chacha20-poly1305、none）

参见：[VMess 协议](../proxy/vmess.md)

#### VLESS 协议

```json
{
  "id": "27848739-7e62-4138-9fd3-098a63964b6b",
  "flow": "xtls-rprx-vision",
  "encryption": "none"
}
```

* `id`: UUID 格式的用户 ID
* `flow`: 流控模式（如 xtls-rprx-vision）
* `encryption`: 加密方式（目前仅支持 none）

参见：[VLESS 协议](../proxy/vless.md)

#### Trojan 协议

```json
{
  "password": "your-password-here"
}
```

* `password`: 用户密码

参见：[Trojan 协议 AccountObject](../proxy/trojan.md#accountobject)

#### Shadowsocks 协议

```json
{
  "method": "aes-256-gcm",
  "password": "your-password-here"
}
```

* `method`: 加密方法
* `password`: 用户密码

参见：[Shadowsocks 协议](../proxy/shadowsocks.md)

#### SOCKS 协议

```json
{
  "username": "user",
  "password": "pass"
}
```

* `username`: 用户名（可选）
* `password`: 密码（可选）

参见：[SOCKS 协议](../proxy/socks.md)

## 使用示例

### 服务端多用户配置

```json
{
  "inbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "level": 0,
            "email": "user1@example.com",
            "account": {
              "id": "uuid-1",
              "alterId": 0
            }
          },
          {
            "level": 1,
            "email": "vip@example.com",
            "account": {
              "id": "uuid-2",
              "alterId": 0
            }
          }
        ]
      }
    }
  ]
}
```

### 客户端配置

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
                "level": 0,
                "email": "client@local",
                "account": {
                  "id": "uuid-1",
                  "alterId": 0,
                  "security": "auto"
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```

### 结合策略使用

```json
{
  "policy": {
    "levels": {
      "0": {
        "handshake": 4,
        "connIdle": 300,
        "uplinkOnly": 2,
        "downlinkOnly": 5
      },
      "1": {
        "handshake": 8,
        "connIdle": 600,
        "uplinkOnly": 4,
        "downlinkOnly": 10
      }
    }
  },
  "inbounds": [
    {
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "level": 0,
            "email": "regular@user",
            "account": {"id": "uuid-1"}
          },
          {
            "level": 1,
            "email": "vip@user",
            "account": {"id": "uuid-2"}
          }
        ]
      }
    }
  ]
}
```

## 注意事项

* 每个协议的 `account` 字段格式不同，需参考对应协议文档
* `email` 字段在服务端和客户端可以不同，主要用于本地标识
* `level` 需要与 Policy 配置配合使用才能生效
* 用户凭据（如 UUID、密码）必须在客户端和服务端保持一致
* 建议为不同用户设置不同的 `email`，便于日志分析和流量统计
