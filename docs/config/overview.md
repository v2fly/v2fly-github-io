# 配置文件格式

## Overview

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
    "reverse": {}
}
```

> `log`: [LogObject](#logobject)

日志配置，表示 V2Ray 如何输出日志。

> `api`: [ApiObject](#apiobject)

内置的远程控制 API，详见[远程控制配置](#apiobject)。

> `dns`: [DnsObject](dns.md)

内置的 DNS 服务器，若此项不存在，则默认使用本机的 DNS 设置。详见[DNS 配置](dns.md)

> `routing`: [RoutingObject](routing.md)

[路由配置](routing.md)

> `policy`: [PolicyObject](policy.md)

本地策略可进行一些权限相关的配置，详见[本地策略](policy.md)

> `inbounds`: \[[InboundObject](inbounds.md#inboundobject)\]

一个数组，每个元素是一个[入站连接配置](inbounds.md#inboundobject)。

> `outbounds`: \[[OutboundObject](outbounds.md#outboundobject)\]

一个数组，每个元素是一个[出站连接配置](outbounds.md#outboundobject)。列表中的第一个元素作为主出站协议。当路由匹配不存在或没有匹配成功时，流量由主出站协议发出。

> `transport`: [TransportObject](transport.md)

用于配置 V2Ray 如何与其它服务器建立和使用网络连接。详见[底层传输配置](transport.md)

> `stats`: [StatsObject](stats.md)

当此项存在时，开启[统计信息](stats.md)。

> `reverse`: [ReverseObject](reverse.md)

[反向代理](reverse.md)配置。

## LogObject

```json
{
    "access": "文件地址",
    "error": "文件地址",
    "loglevel": "warning"
}
```

> `access`: string

访问日志的文件地址，其值是一个合法的文件地址，如`"/tmp/v2ray/_access.log"`（Linux）或者`"C:\\Temp\\v2ray\\_access.log"`（Windows）。当此项不指定或为空值时，表示将日志输出至 stdout。V2Ray 4.20 加入了特殊值`none`，即关闭 access log。

> `error`: string

错误日志的文件地址，其值是一个合法的文件地址，如`"/tmp/v2ray/_error.log"`（Linux）或者`"C:\\Temp\\v2ray\\_error.log"`（Windows）。当此项不指定或为空值时，表示将日志输出至 stdout。V2Ray 4.20 加入了特殊值`none`，即关闭 error log（跟`loglevel: "none"`等价）。

> `loglevel`: "debug" | "info" | "warning" | "error" | "none"

错误日志的级别。默认值为 `"warning"`。

* `"debug"`：只有开发人员能看懂的信息。同时包含所有 `"info"` 内容。
* `"info"`：V2Ray 在运行时的状态，不影响正常使用。同时包含所有 `"warning"` 内容。
* `"warning"`：V2Ray 遇到了一些问题，通常是外部问题，不影响 V2Ray 的正常运行，但有可能影响用户的体验。同时包含所有 `"error"` 内容。
* `"error"`：V2Ray 遇到了无法正常运行的问题，需要立即解决。
* `"none"`：不记录任何内容。

## ApiObject

V2Ray 中可以开放一些 API 以便远程调用。这些 API 都基于 [gRPC](https://grpc.io/)。大多数用户并不会用到 API，新手可以直接忽略这一项。

当远程控制开启时，V2Ray 会自建一个出站代理，以 `tag` 配置的值为标识。用户必须手动将所有的 gRPC 入站连接通过 [路由](routing.md) 指向这一出站代理。

```json
{
    "tag": "api",
    "services": [
        "HandlerService",
        "LoggerService",
        "StatsService"
    ]
}
```

> `tag`: string

出站代理标识

> `services`: \[string\]

开启的 API 列表，可选的值见 [API 列表](#支持的-api-列表)。

### 支持的 API 列表

### HandlerService

一些对于入站出站代理进行修改的 API，可用的功能如下：

* 添加一个新的入站代理；
* 添加一个新的出站代理；
* 删除一个现有的入站代理；
* 删除一个现有的出站代理；
* 在一个入站代理中添加一个用户（仅支持 VMess）；
* 在一个入站代理中删除一个用户（仅支持 VMess）；

### LoggerService

支持对内置 Logger 的重启，可配合 logrotate 进行一些对日志文件的操作。

### StatsService

内置的数据统计服务，详见 [统计信息](stats.md)。
