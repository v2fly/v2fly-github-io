# GRPC

gRPC 传输方式是基于 gRPC 协议实现的 Gun 传输协议的实现。

gRPC 传输方式类似 WebSockets 可以透过 nginx 进行转发， 自带了基于 HTTP/2 的连接复用功能。

在建立相应的连接的时候， gRPC 传输方式的 TLS ALPN 为 `h2` , 与 WebSocket 的 `http/1.1` 不同。

(v4.36.0+)

## grpcObject

```json
{
  "serviceName":"GunService"
}
```

> `serviceName`: string

gRPC 服务的名称。其的作用类似 `path` 的功能，可以防止恶意客户端探测是否部署了本传输协议。
