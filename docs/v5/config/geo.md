# Geo 地理位置数据

Geo 数据用于在路由规则中根据 IP 地址的地理位置或域名的类别进行匹配。V2Ray 支持使用 GeoIP 和 GeoDomain 数据进行精确的流量分流。

## 概述

V2Ray 使用 Geo 数据库来识别 IP 地址的归属地和域名的分类。这使得用户可以轻松地实现：

* 国内外流量分流
* 广告域名屏蔽
* 特定国家或地区的访问控制
* 基于域名类别的路由规则

## GeoIP

GeoIP 用于根据 IP 地址的地理位置进行匹配。

### 配置

```json
{
  "cidr": [
    {
      "ipAddr": "10.0.0.0",
      "prefix": 8
    },
    {
      "ipAddr": "192.168.0.0",
      "prefix": 16
    }
  ],
  "code": "cn",
  "filePath": "geoip.dat",
  "inverseMatch": false
}
```

> `cidr`: \[[CIDRObject](#cidrobject)\]

一个数组，数组中每一项是一个 [CIDR](https://zh.wikipedia.org/zh-hans/%E6%97%A0%E7%B1%BB%E5%88%AB%E5%9F%9F%E9%97%B4%E8%B7%AF%E7%94%B1) 地址块。

* 可以直接指定 IP 地址范围
* 与 `code` 同时指定时，从文件加载的 IP 会覆盖 `cidr` 的值

> `code`: string

GeoIP 的双字符[国家或地区代码](https://zh.wikipedia.org/wiki/國家地區代碼)，支持所有可以上网的国家和地区。

常用代码：
* `cn` - 中国
* `us` - 美国
* `jp` - 日本
* `hk` - 香港
* `tw` - 台湾
* `private` - 私有地址

> `filePath`: string

GeoIP 文件路径。默认为 `geoip.dat`。

* 可以指定绝对路径或相对路径
* 使用标准的 V2Ray GeoIP 数据格式

> `inverseMatch`: true | false

反向匹配。默认为 `false`。

* 当为 `true` 时，匹配结果取反
* 适用于"不在某地区"的场景

### CIDRObject

CIDR 地址块对象。

```json
{
  "ipAddr": "192.168.1.0",
  "prefix": 24
}
```

> `ipAddr`: string

IP 地址。可以是 IPv4 或 IPv6 地址。

> `prefix`: number

CIDR 地址前缀长度，表示网络掩码的位数。

* IPv4 范围：0-32
* IPv6 范围：0-128

### 使用示例

#### 示例 1：匹配中国 IP

```json
{
  "type": "field",
  "ip": [
    {
      "code": "cn",
      "filePath": "geoip.dat"
    }
  ],
  "outboundTag": "direct"
}
```

#### 示例 2：匹配私有 IP 地址

```json
{
  "type": "field",
  "ip": [
    {
      "code": "private"
    }
  ],
  "outboundTag": "direct"
}
```

#### 示例 3：匹配特定 CIDR 段

```json
{
  "type": "field",
  "ip": [
    {
      "cidr": [
        {"ipAddr": "10.0.0.0", "prefix": 8},
        {"ipAddr": "172.16.0.0", "prefix": 12},
        {"ipAddr": "192.168.0.0", "prefix": 16}
      ]
    }
  ],
  "outboundTag": "direct"
}
```

#### 示例 4：反向匹配（非中国 IP）

```json
{
  "type": "field",
  "ip": [
    {
      "code": "cn",
      "inverseMatch": true
    }
  ],
  "outboundTag": "proxy"
}
```

## GeoDomain

GeoDomain 用于根据域名的类别进行匹配。

### 配置

```json
{
  "domain": [
    {
      "type": "Full",
      "value": "www.google.com"
    },
    {
      "type": "RootDomain",
      "value": "google.com"
    }
  ],
  "code": "google",
  "filePath": "geosite.dat"
}
```

> `domain`: [DomainObject](#domainobject)

域名列表，每一项定义一个域名匹配规则。

> `code`: string

GeoDomain 的类别名称（域名列表）。

常用类别：
* `cn` - 中国大陆常用域名
* `geolocation-!cn` - 非中国大陆域名
* `google` - Google 相关域名
* `netflix` - Netflix 相关域名
* `category-ads-all` - 广告域名
* `apple` - Apple 相关域名
* `microsoft` - Microsoft 相关域名

> `filePath`: string

GeoDomain 文件路径。默认为 `geosite.dat`。

### DomainObject

域名对象，定义域名匹配规则。

```json
{
  "type": "RootDomain",
  "value": "google.com"
}
```

> `type`: "Plain" | "Regex" | "RootDomain" | "Full"

域名匹配模式：

* **Plain**：纯字符串匹配模式（关键字匹配）
  - 当匹配目标域名中任意部分时，该规则生效
  - 例如：`sina.com` 匹配 `sina.com`、`sina.com.cn`、`www.sina.com`
  - 不匹配：`sina.cn`

* **Regex**：正则表达式匹配模式
  - 当正则表达式匹配目标域名时，该规则生效
  - 例如：`\.goo.*\.com$` 匹配 `www.google.com`、`fonts.googleapis.com`
  - 不匹配：`google.com`

* **RootDomain**：根域名匹配模式（推荐）
  - 当域名是目标域名或其子域名时，该规则生效
  - 例如：`v2ray.com` 匹配 `www.v2ray.com`、`v2ray.com`
  - 不匹配：`xv2ray.com`

* **Full**：完整匹配模式
  - 当域名完整匹配目标域名时，该规则生效
  - 例如：`v2ray.com` 匹配 `v2ray.com`
  - 不匹配：`www.v2ray.com`

> `value`: string

匹配域名的值。根据 `type` 不同，值的含义也不同。

### 使用示例

#### 示例 1：匹配中国域名

```json
{
  "type": "field",
  "domain": [
    {
      "code": "cn",
      "filePath": "geosite.dat"
    }
  ],
  "outboundTag": "direct"
}
```

#### 示例 2：屏蔽广告域名

```json
{
  "type": "field",
  "domain": [
    {
      "code": "category-ads-all"
    }
  ],
  "outboundTag": "block"
}
```

#### 示例 3：自定义域名列表

```json
{
  "type": "field",
  "domain": [
    {
      "domain": [
        {"type": "Full", "value": "google.com"},
        {"type": "RootDomain", "value": "google.com"},
        {"type": "Plain", "value": "google"}
      ]
    }
  ],
  "outboundTag": "proxy"
}
```

#### 示例 4：混合匹配

```json
{
  "type": "field",
  "domain": [
    {
      "code": "google"
    },
    {
      "domain": [
        {"type": "Regex", "value": "^.*\\.googlevideo\\.com$"}
      ]
    }
  ],
  "outboundTag": "proxy"
}
```

## 数据文件

### 获取数据文件

V2Ray 使用的 Geo 数据文件：

* **geoip.dat** - IP 地址数据库
* **geosite.dat** - 域名分类数据库

这些文件通常随 V2Ray 一起发布，也可以从以下来源获取：

* [v2fly/geoip](https://github.com/v2fly/geoip) - GeoIP 数据
* [v2fly/domain-list-community](https://github.com/v2fly/domain-list-community) - 域名列表

### 更新数据文件

建议定期更新 Geo 数据文件以获得最新的数据：

```bash
# 下载最新的 geoip.dat
wget -O geoip.dat https://github.com/v2fly/geoip/releases/latest/download/geoip.dat

# 下载最新的 geosite.dat
wget -O geosite.dat https://github.com/v2fly/domain-list-community/releases/latest/download/dlc.dat
```

## 最佳实践

1. **使用 RootDomain 匹配**：对于域名匹配，推荐使用 `RootDomain` 类型，既精确又灵活
2. **使用预定义分类**：优先使用 `geosite.dat` 中的预定义分类，如 `cn`、`category-ads-all`
3. **定期更新数据**：Geo 数据会不断更新，建议定期更新数据文件
4. **合理使用反向匹配**：`inverseMatch` 可以简化配置，但要注意逻辑正确性
5. **组合使用**：可以同时使用 GeoIP 和 GeoDomain 实现精确分流

## 常见应用场景

### 国内外分流

```json
{
  "routing": {
    "rules": [
      {
        "type": "field",
        "domain": [{"code": "cn"}],
        "ip": [{"code": "cn"}],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "domain": [{"code": "geolocation-!cn"}],
        "outboundTag": "proxy"
      }
    ]
  }
}
```

### 广告屏蔽

```json
{
  "routing": {
    "rules": [
      {
        "type": "field",
        "domain": [{"code": "category-ads-all"}],
        "outboundTag": "block"
      }
    ]
  }
}
```

### 流媒体分流

```json
{
  "routing": {
    "rules": [
      {
        "type": "field",
        "domain": [
          {"code": "netflix"},
          {"code": "youtube"}
        ],
        "outboundTag": "streaming-proxy"
      }
    ]
  }
}
```

## 注意事项

* Geo 数据文件需要正确放置在可访问的路径
* `code` 和 `cidr`/`domain` 可以同时使用，但文件加载的数据会覆盖手动指定的数据
* 反向匹配 `inverseMatch` 要谨慎使用，避免逻辑错误
* 正则表达式匹配性能较低，尽量使用其他匹配类型
* 数据文件越大，启动时间可能越长
