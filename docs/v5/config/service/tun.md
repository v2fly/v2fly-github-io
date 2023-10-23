# Tun
* 名称 : `tun`
* 类型 : 服务
* ID: `service.tun`

Tun 是一个接受网络层数据包的服务，输入进入操作系统 tun 接口的数据包会被转换为一般数据流被传出代理处理。 (v5.9.0+)

您可以参考 [pull request](https://github.com/v2fly/v2ray-core/pull/2541) 中的示例。

目前支持  amd64 以及 arm64 架构下的 Linux 操作系统.

### Tun

> `name`: string

tun 网络适配器的名字。

> `mtu`: number

tun 网络适配器的最大传输单元。建议设置为 1500.

> `tag`: string

生成的流量的入站流量标签。

> `ips`: [ [IPObject](#IPObject) ]


> `routes`: [ [RouteObject](#RouteObject) ]


> `enablePromiscuousMode`: bool


> `enableSpoofing`: bool


> `packetEncoding`:  \["None" | "Packet"\]

UDP 包的编码方式，默认为 `None`。


### IPObject

> `ip`: [ number ]


> `prefix`: number

### RouteObject

> `ip`: [ number ]

> `prefix`: number
