# VMess

[VMess](../../../developer/protocols/vmess.md) 是一个加密传输协议，它分为入站和出站两部分，通常作为 V2Ray 客户端和服务器之间的桥梁。

VMess 依赖于系统时间，请确保使用 V2Ray 的系统 UTC 时间误差在 90 秒之内，时区无关。在 Linux 系统中可以安装`ntp`服务来自动同步系统时间。

## VMess 入站

inbound.vmess

> `users` : [string]

一组服务器认可用户的 ID，必须为合法的 UUID。

## VMess 出站

outbound.vmess

> `address`: string

服务器地址，支持 IP 地址或者域名。

> `port`: number

服务器端口号。

> `uuid`: string

服务器认可的 VMess 用户 ID，必须为合法的 UUID。
