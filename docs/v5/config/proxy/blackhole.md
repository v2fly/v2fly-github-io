# Blackhole

## Blackhole 出站
outbound.blackhole

Blackhole（黑洞）是一个出站数据协议，它会阻碍所有数据的出站，配合路由一起使用，可以达到禁止访问某些网站的效果。

## 配置

```json
{
  "response": {
    "type": "none"
  }
}
```

> `response`: [ResponseObject](#responseobject)

响应配置。控制 Blackhole 如何响应外发连接。

## ResponseObject

```json
{
  "type": "none"
}
```

> `type`: "none" | "http"

响应类型。可选值有：

* `"none"`：默认值，表示直接关闭连接。适用于大部分场景。
* `"http"`：返回一段 HTTP 403 Forbidden 响应，然后关闭连接。主要用于 HTTP/HTTPS 流量的屏蔽。

## 使用示例

### 示例 1：屏蔽广告域名

配合路由规则，可以使用 Blackhole 屏蔽广告域名：

```json
{
  "routing": {
    "rules": [
      {
        "type": "field",
        "domain": ["geosite:category-ads-all"],
        "outboundTag": "block"
      }
    ]
  },
  "outbounds": [
    {
      "protocol": "blackhole",
      "tag": "block",
      "settings": {
        "response": {
          "type": "http"
        }
      }
    }
  ]
}
```

### 示例 2：阻止特定 IP 段访问

```json
{
  "routing": {
    "rules": [
      {
        "type": "field",
        "ip": ["geoip:private"],
        "outboundTag": "block"
      }
    ]
  },
  "outbounds": [
    {
      "protocol": "blackhole",
      "tag": "block",
      "settings": {
        "response": {
          "type": "none"
        }
      }
    }
  ]
}
```
