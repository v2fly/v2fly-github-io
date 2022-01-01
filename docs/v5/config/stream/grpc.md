# gRPC

gRPC 使用 HTTP/2 协议传输。

## gRPC Stream
grpc.stream

> `serviceName`: string

gRPC 服务的名称。其作用类似 `path` 的功能，用于防止探测是否部署了本传输协议。建议使用复杂的随机字符串。

根据 [gRPC 规范官方](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md#appendix-a---grpc-for-protobuf) 规定，此字段不建议使用除英文大小写字母、数字、下划线及英文句号之外的字符组成。

:::tip
如需使用 Nginx、Caddy 等软件进行分流，设置的分流路径应为 `/${serviceName}/Tun`。
:::

## Credits

[Qv2ray/gun](https://github.com/Qv2ray/gun)