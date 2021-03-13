# Loopback

* 名称：`loopback`
* 类型：出站协议

loopback 是一个出站协议，它可以使出站连接重新路由，等价于 `dokodemo` + 改变出站连接的地址。
减少在实现相同功能的情况下，对系统资源的占用。

对于本出站协议，部分出站连接选项不会被应用。

(v4.36.0+)

## OutboundConfigurationObject

```json
{
    "inboundTag": "reentry"
}
```

> `inboundTag`: string

进行重新路由时的入站来源标志。
