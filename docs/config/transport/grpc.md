# gRPC

V2Ray v4.36.0 加入了 gRPC 传输方式。

gRPC 传输方式是「基于 gRPC 协议实现的 Gun 传输协议」的实现，借鉴自 [Qv2ray/gun](https://github.com/Qv2ray/gun)。

gRPC 传输方式类似 WebSocket，可通过 Nginx 进行转发 / 分流，自带基于 HTTP/2 的连接复用（mux）功能。其 TLS ALPN 为 `h2` , 与 WebSocket 的 `http/1.1` 不同。

## grpcObject

```json
{
  "serviceName": "GunService"
}
```

> `serviceName`: string

gRPC 服务的名称。其作用类似 `path` 的功能，可用于防止恶意客户端探测是否部署了本传输协议。建议使用复杂的随机字符串。
