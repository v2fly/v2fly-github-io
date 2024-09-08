# Hysteria2

- 名称：`hysteria2`
- 类型：入站 / 出站

## InboundConfigurationObject

无需配置

## OutboundConfigurationObject

```json
{
  "servers": [
    {
      "address": "127.0.0.1",
      "port": 1234
    }
  ]
}
```

### ServerObject

```json
{
  "address": "127.0.0.1",
  "port": 1234
}
```

> `address`: address

服务器地址，支持 IPv4、IPv6 和域名。必填。

> `port`: number

服务器端口，必填。
