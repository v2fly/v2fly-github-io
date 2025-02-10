# 订阅管理器
* 名称: `subscription`
* 类型: Service
* ID: `service.subscription`

订阅管理器自动刷新出站信息并将它们转换为出站实例. (v5.13.0+)

## 订阅
> `imports` : [ [SubscriptionImportObject](#subscriptionimportobject) ]

## SubscriptionImportObject

> `name`: string

订阅源名称

> `url`: string

订阅源的地址：

目前有两种收到支持的发地址
- HTTP(S) 地址 : 通过 HTTP(S) 即  「超文本传输协议」或 「超文本传输安全协议」下载订阅文档。
- DataURL : 链接本身即为订阅文档。文档类型需为 "application/vnd.v2ray.subscription-singular" 才会被接受。

> `tagPrefix`: string

创建的订阅的出站实例前缀。

> `importUsingTag`: string

指定下载订阅文档的出站代理标志。

> `defaultExpireSeconds`: number

默认的订阅过期时间。

> `persistence`: bool

是否启用订阅信息的持久存储。 (v5.28.0+)

英语文档中包含更多细节。
