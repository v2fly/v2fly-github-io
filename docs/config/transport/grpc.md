# gRPC

* 名称：`loopback`
* 类型：传输方式
* 最低版本：v4.36.0+

gRPC 使用 HTTP/2 协议传输，内置连接复用（mux）功能。

## grpcObject

```json
{
  "serviceName": "GunService"
}
```

> `serviceName`: string

gRPC 服务的名称。其作用类似 `path` 的功能，用于防止探测是否部署了本传输协议。建议使用复杂的随机字符串。


## Credits

[Qv2ray/gun](https://github.com/Qv2ray/gun)