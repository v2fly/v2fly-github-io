# Loopback

* 名称：`loopback` (v4.36.0+)
* 类型：出站协议

Loopback 是一个出站协议，可使出站连接被 V2Ray 重新路由，等价于 「`dokodemo-door` + 改变出站连接地址」。在实现相同功能的前提下，减少了对系统资源的占用。

对于本出站协议，部分出站连接选项不会被应用。

## OutboundConfigurationObject

```json
{
    "inboundTag": "reentry"
}
```

> `inboundTag`: string

进行重新路由时的入站来源标志。
