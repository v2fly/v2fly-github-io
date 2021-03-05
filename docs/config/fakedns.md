# 虚拟 DNS 服务器

## FakeDnsObject

`FakeDnsObject` 对应配置文件的 `fakedns` 项。 (4.35.0+)

```json
{
    "ipPool": "240.0.0.0/8",
    "poolSize": 16777214
}
```

> `ipPool`: string: CIDR

虚拟 DNS 服务器分配 IP 的地址空间。由虚拟 DNS 服务器分配的地址会符合这个 CIDR 表达式。

> `poolSize`: number

虚拟 DNS 服务器所记忆的 IP - 域名映射 数量。

## 虚拟 DNS 服务器机制

虚拟 DNS 服务器会返回一个位于自己 `ipPool` 内的 IP 地址为域名的虚构解析结果并记忆该域名与虚构解析结果之间的关系。

当客户端程序基于此解析结果请求连接这个 IP 所指向的主机时，对应 [入站连接](inbounds.md) 的 `fakedns` 流量侦测模块会将目标地址还原为对应的域名。




