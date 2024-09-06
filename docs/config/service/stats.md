# Stats 统计信息

V2Ray 提供了一些关于其运行状况的统计信息。

## StatsObject

`StatsObject` 对应配置文件的 `stats` 项。

```json
{}
```

目前统计信息没有任何参数，只要 `StatsObject` 项存在，内部的统计即会开启。同时你还需要在 [Policy](policy.md) 中开启对应的项，才可以统计对应的数据。

目前已有的统计信息如下：

## 用户数据

> `user>>>[email]>>>traffic>>>uplink`

特定用户的上行流量，单位为字节。

> `user>>>[email]>>>traffic>>>downlink`

特定用户的下行流量，单位为字节。

:::tip
如果对应用户没有指定 Email，则不会开启统计。
:::

## 全局数据

> `inbound>>>[tag]>>>traffic>>>uplink`

特定入站代理的上行流量，单位为字节。

> `inbound>>>[tag]>>>traffic>>>downlink`

特定入站代理的下行流量，单位为字节。

> `outbound>>>[tag]>>>traffic>>>uplink`

特定出站代理的上行流量，单位为字节。

> `outbound>>>[tag]>>>traffic>>>downlink`

特定出站代理的下行流量，单位为字节。
