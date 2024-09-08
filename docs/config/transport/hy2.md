# Hysteria2

魔改 quic-go 拥塞控制的代理协议。

1. 得益于 QUIC 的全加密和填充，大大地增加中间防火墙嗅探的负担
2. 强制要求使用 TLS 1.3
3. 真正的多路复用，还从根本上解决了 TLS 和多路复用带来的队头阻塞问题

## 协议修改说明

- 在 V2ray 中，Hysteria2 TCP 被分成了两个部分：

1. `TLS + HTTP3` 传输层；包含认证、协商、拥塞控制等
2. `Proxy Header` 代理层；包含解析目标地址、Padding 等

Hysteria2 可以作为传输层与 Vmess、Shadowsocks、Trojan 搭配使用，也可以兼用官方版。若把 Hysteria2 作为传输层，只能使用其 Stream，也就是说传输 UDP 时就是 UDP Over Stream。

- Padding 目前为固定长度和内容，不影响实际使用和兼容性

## Hysteria2Object

`Hysteria2Object` 对应传输配置的 `hysteria2Settings` 项。

```json
{
  "password": "password",
  "use_udp_extension": true,
  "congestion": {
    "type": "bbr",
    "up_mbps": 50,
    "down_mbps": 100
  }
}
```

> `password`: string

认证密码，留空为不认证

> `use_udp_extension`: bool

是否启用 UDP，默认不启用

> `congestion`: [CongestionObject](#CongestionObject)

拥塞算法配置

## CongestionObject

用于控制本地网络的发包速度。理论上能够充分利用网络带宽，做到效益最大化，即为最佳拥塞算法。不同的拥塞算法会影响 Hysteria2 的性能表现。

```json
{
  "type": "bbr",
  "up_mbps": 50,
  "down_mbps": 100
}
```

> `type`: string

可选：

- `bbr` 被广泛使用的，推荐在移动网络环境下使用（默认)
- `brutal` 需要正确地设置好本机实际带宽才能生效，推荐在带宽稳定的环境下使用

> `up_mbps`: int

本机的上传速度，单位 Mbit/s

选择 `brutal` 时，必填；留空或 0 时转换成 `bbr`

> `down_mbps`: int

本机的下传速度，单位 Mbit/s

选择 `brutal` 时，必填；留空或 0 时转换成 `bbr`
