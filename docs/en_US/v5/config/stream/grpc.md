# gRPC

gRPC uses HTTP/2 protocol for transmission.

## gRPC Stream
grpc.stream

> `serviceName`: string

The name of the gRPC service. It is similar to the function of `path` and is used to prevent detection of whether this transport protocol is deployed. It is recommended to use a complex random string.

According to [the official gRPC specification](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md#appendix-a---grpc-for-protobuf), it is not recommended to use characters other than uppercase and lowercase English letters, numbers, underscores, and periods in this field.

:::tip
If you need to use Nginx, Caddy, or other software for traffic diversion, the diversion path should be set to `/${serviceName}/Tun`.
:::

## Credits

[Qv2ray/gun](https://github.com/Qv2ray/gun)
