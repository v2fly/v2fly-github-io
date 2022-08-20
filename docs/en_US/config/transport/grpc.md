# gRPC

(Available since v4.36.0) gRPC uses the HTTP/2 protocol to transfer data and has a built-in connection multiplexing (mux) function.

## grpcObject

```json
{
  "serviceName": "GunService"
}
```

> `serviceName`: string

The name of the gRPC service. Its function is similar to that of a `path`, and can be used to hamper detection of the protocol being utilized as a transport. It is recommended to use a complex, randomized string.

According to [gRPC specifications](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md#appendix-a ---grpc-for-protobuf), it is unrecommended to use any non-alphanumerical characters other than underlines and periods (full stops).

:::tip
If you need to use software such as Nginx or Caddy for load distribution, set this to `/${serviceName}/Tun`.
:::

## Credits

[Qv2ray/gun](https://github.com/Qv2ray/gun)
