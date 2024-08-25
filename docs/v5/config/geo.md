# Geo

## GeoIP

> `cidr` : \[[CIDRObject](#cidrobject)\]

一个数组，数组中每一项是一个 [CIDR](https://zh.wikipedia.org/zh-hans/%E6%97%A0%E7%B1%BB%E5%88%AB%E5%9F%9F%E9%97%B4%E8%B7%AF%E7%94%B1) 地址块

> `inverseMatch` : true | false

反向匹配，当此项为 `true` 时，如果匹配则返回 `false`，否则返回 `true`。

> `code`: string

GeoIP 的双字符[国家或地区代码](https://zh.wikipedia.org/wiki/國家地區代碼)，支持所有可以上网的国家和地区。

> `filePath`: string

GeoIP 文件路径。

### CIDRObject

> `ipAddr`: string

IP 地址。

> `prefix`: number

CIDR 地址前缀。

## GeoDomain

> `domain` : [DomainObject](#domainobject)

> `code`: string

GeoDomain 的类别名称（域名列表）。

> `filePath`: string

GeoDomain 文件路径。

### DomainObject

> `type` : "Plain" | "Regex" | "RootDomain" | "Full"

域名匹配模式，可选值为：

* **Plain**：纯字符串匹配模式，当匹配目标域名中任意部分时，该规则生效。比如 `sina.com` 可以匹配 `sina.com`、`sina.com.cn`、`sina.company` 和 `www.sina.com`，但不匹配 `sina.cn`。
* **Regex**：正则表达式匹配模式，当正则表达式匹配目标域名时，该规则生效。例如 `\.goo.*\.com$` 匹配 `www.google.com`、`fonts.googleapis.com`，但不匹配 `google.com`。
* **RootDomain**：根域名匹配模式，当域名是目标域名或其子域名时，该规则生效。例如 `v2ray.com` 匹配 `www.v2ray.com`、`v2ray.com`，但不匹配 `xv2ray.com`。
* **Full**：完整匹配模式，当域名完整匹配目标域名时，该规则生效。例如 `v2ray.com` 匹配 `v2ray.com` 但不匹配 `www.v2ray.com`。

> `value`: string

匹配域名的值。
