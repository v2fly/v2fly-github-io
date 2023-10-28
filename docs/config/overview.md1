# 配置文件格式

## 概述

V2Ray 的配置文件形式如下，客户端和服务器通用一种形式，只是实际的配置不一样。

如果你刚接触 V2Ray，应当从了解 Inbounds 和 Outbounds 开始，只填必须的选项即可启动程序。接下来循序渐进了解其它组件，你会发现 V2Ray 并不难掌握。

```json
{
    "log": {},
    "api": {},
    "dns": {},
    "routing": {},
    "policy": {},
    "inbounds": [],
    "outbounds": [],
    "transport": {},
    "stats": {},
    "reverse": {},
    "fakedns": [],
    "browserForwarder": {},
    "observatory": {}
}
```

> `log`: [LogObject](#logobject)

日志配置，表示 V2Ray 如何输出日志。

> `api`: [ApiObject](api.md)

远程控制。

> `dns`: [DnsObject](dns.md)

内置的 DNS 服务器，若此项不存在，则默认使用本机的 DNS 设置。

> `routing`: [RoutingObject](routing.md)

路由功能。

> `policy`: [PolicyObject](policy.md)

本地策略，可进行一些权限相关的配置。

> `inbounds`: \[ [InboundObject](inbounds.md) \]

一个数组，每个元素是一个入站连接配置。

> `outbounds`: \[ [OutboundObject](outbounds.md) \]

一个数组，每个元素是一个出站连接配置。列表中的第一个元素作为主出站协议。当路由匹配不存在或没有匹配成功时，流量由主出站协议发出。

> `transport`: [TransportObject](transport.md)

用于配置 V2Ray 如何与其它服务器建立和使用网络连接。

> `stats`: [StatsObject](stats.md)

统计信息。

> `reverse`: [ReverseObject](reverse.md)

反向代理。

> `fakedns`: \[ [FakeDnsObject](fakedns.md) \]

虚拟 DNS 服务器。


> `browserForwarder`: [BrowserForwarderObject](browserforwarder.md)

浏览器转发模块。

> `observatory`: [ObservatoryObject](observatory.md)

连接观测模块。

## LogObject

`LogObject` 对应配置文件的 `log` 项。

```json
{
    "access": "文件地址",
    "error": "文件地址",
    "loglevel": "warning"
}
```

> `access`: string

访问日志的文件地址，其值是一个合法的文件地址，如`"/var/log/v2ray/access.log"`（Linux）或者`"C:\\Temp\\v2ray\\_access.log"`（Windows）。当此项不指定或为空值时，表示将日志输出至 stdout。V2Ray 4.20 加入了特殊值`none`，即关闭 access log。

> `error`: string

错误日志的文件地址，其值是一个合法的文件地址，如`"/var/log/v2ray/error.log"`（Linux）或者`"C:\\Temp\\v2ray\\_error.log"`（Windows）。当此项不指定或为空值时，表示将日志输出至 stdout。V2Ray 4.20 加入了特殊值`none`，即关闭 error log（跟`loglevel: "none"`等价）。

> `loglevel`: "debug" | "info" | "warning" | "error" | "none"

日志的级别。默认值为 `"warning"`。

* `"debug"`：详细的调试性信息。同时包含所有 `"info"` 内容。
* `"info"`：V2Ray 在运行时的状态，不影响正常使用。同时包含所有 `"warning"` 内容。
* `"warning"`：V2Ray 遇到了一些问题，通常是外部问题，不影响 V2Ray 的正常运行，但有可能影响用户的体验。同时包含所有 `"error"` 内容。
* `"error"`：V2Ray 遇到了无法正常运行的问题，需要立即解决。
* `"none"`：不记录任何内容。
