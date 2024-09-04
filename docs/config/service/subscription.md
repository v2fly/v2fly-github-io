# 订阅管理器
* 名称: `subscription`
* 类型: Service
* ID: `service.subscription`

订阅管理器自动刷新出站信息并将它们转换为出站实例. (v5.13.0+)

由于[当前代码](https://github.com/v2fly/v2ray-core/blob/cc77e90254b57e552bd745727a7bf402bae3aad9/app/subscription/specs/skeleton.go)在“服务”之外查找与jsonv4配置格式冲突的jsonv5配置格式设置，因此此服务尚不适用于jsonv4配置格式。
