# Loopback

Loopback 是一个出站协议，可使出站连接被重新路由到指定的入站连接，从而实现流量的再次处理或转发。

## Loopback 出站

outbound.loopback

## 配置

```json
{
  "inboundTag": "inbound-tag-name"
}
```

> `inboundTag`: string

匹配入站来源的标识。该值必须与配置文件中某个入站连接的 `tag` 字段完全一致。

当 Loopback 出站被触发时，该连接会被重定向到指定的入站连接，由该入站连接重新处理。

## 使用场景

### 示例 1：链式代理处理

通过 Loopback 可以实现更复杂的路由逻辑，例如让流量多次经过路由判断：

```json
{
  "inbounds": [
    {
      "tag": "http-in",
      "port": 1080,
      "protocol": "http"
    },
    {
      "tag": "internal-router",
      "port": 0,
      "protocol": "dokodemo-door",
      "settings": {
        "address": "0.0.0.0"
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "loopback",
      "tag": "loop-back",
      "settings": {
        "inboundTag": "internal-router"
      }
    },
    {
      "protocol": "freedom",
      "tag": "direct"
    }
  ],
  "routing": {
    "rules": [
      {
        "type": "field",
        "inboundTag": ["http-in"],
        "domain": ["example.com"],
        "outboundTag": "loop-back"
      },
      {
        "type": "field",
        "inboundTag": ["internal-router"],
        "outboundTag": "direct"
      }
    ]
  }
}
```

### 示例 2：流量重新评估

在某些场景下，你可能需要对经过处理的流量重新应用路由规则：

```json
{
  "inbounds": [
    {
      "tag": "main-in",
      "port": 1080,
      "protocol": "socks"
    },
    {
      "tag": "re-eval",
      "port": 0,
      "protocol": "dokodemo-door"
    }
  ],
  "outbounds": [
    {
      "protocol": "loopback",
      "tag": "re-route",
      "settings": {
        "inboundTag": "re-eval"
      }
    }
  ]
}
```

## 注意事项

* 确保 `inboundTag` 指向的入站连接存在，否则会导致连接失败。
* 避免创建循环引用（如 A → B → A），这会导致无限循环。
* Loopback 不会改变连接的原始目标地址，只是重新触发路由判断。
