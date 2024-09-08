# Hysteria2

## Hysteria2 入站

inbound.hysteria2

无需配置

## Hysteria2 出站

outbound.hysteria2

```json
{
  "server": [
    {
      "address": "127.0.0.1",
      "port": 1234
    }
  ]
}
```

> `address`: string

服务器地址，支持 IP 地址或者域名。

> `port`: number

服务器端口号。

## Hysteria2 兼容

若要使用与[官方版](https://hysteria.network/)完全兼容的 Hysteria2，请把传输层也设置成 Hysteria2，并设置密码

:::tip

- 配置 TLS 时，可以使用 allowInsecure 和系统根证书，暂不支持自签证书和 PinnedPeerCertificateChainSha256

- 若不配置 TLS，则默认使用 allowInsecure

  :::

## 最佳实践

- 无需 UDP

如果你不需要代理 UDP，那么 `vmess + hysteria2`、`trojan + hysteria2`、`hysteria2 + hysteria2` （代理层+ 传输层）三者的效果是一样的。 `trojan + hysteria2` 的性能可能会更佳。

- 需 UDP（透明代理、socks5 等）

如果你选择搭配 `vmess + hysteria2`、`trojan + hysteria2`，那么就是 UDP over stream。参考 TUIC 的 `quic` udp 模式。

代理 TCP 时，效果都是一致的。

- 无需再使用 grpc、h2、smux 等多路复用

QUIC 彻头彻尾地解决了多路复用带来的各种小问题，其本身就自带多路复用，无需再多此一举。
