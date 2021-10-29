# Geo

## GeoIP

> `cidr` : [CIDRObject](#CIDRObject)

> `inverseMatch` : true | false

当此项为 `true` 时，如果匹配则返回 `false`，否则返回 `true`。

> `code`: string

> `filePath`: string

GeoIP 文件路径。

### CIDRObject


> `ipAddr`: string

> `prefix`: number

## GeoDomain

> `domain` : [DomainObject](#DomainObject)

> `code`: string

> `filePath`: string

GeoDomain 文件路径。

### DomainObject

> `type` : "Plain" | "Regex" | "RootDomain" | "Full"

> `value`: string
