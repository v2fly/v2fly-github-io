# 配置文件格式

## 概述

V2Ray 的配置文件形式如下，客户端和服务器通用一种形式，只是实际的配置不一样。

如果你刚接触 V2Ray，应当从了解 Inbounds 和 Outbounds 开始，只填必须的选项即可启动程序。接下来循序渐进了解其它组件，你会发现 V2Ray 并不难掌握。

```json
{
    "log": {},
    "dns": {},
    "router": {},
    "inbounds": [],
    "outbounds": [],
    "services": [],
    "extension": [],
}
```

> `log`: [LogObject](#logobject)

日志配置，表示 V2Ray 如何输出日志。

> `dns`: [DnsObject](dns.md)

内置的 DNS 服务器，若此项不存在，则默认使用本机的 DNS 设置。

> `router`: [RouterObject](router.md)

路由功能。

> `inbounds`: \[ [InboundObject](inbounds.md) \]

一个数组，每个元素是一个入站连接配置。

> `outbounds`: \[ [OutboundObject](outbounds.md) \]

一个数组，每个元素是一个出站连接配置。列表中的第一个元素作为主出站协议。当路由匹配不存在或没有匹配成功时，流量由主出站协议发出。

> `services`: [ [ServicesObject](services.md) ]

用于配置 V2Ray 如何与其它服务器建立和使用网络连接。

> `extension`: [ [ExtensionObject](extension.md) ]

统计信息。

## LogObject

`LogObject` 对应配置文件的 `log` 项。

```json
{
    "accessLogType": "console",
    "accessLogPath": "文件地址",
    "errorLogType": "console",
    "errorLogPath": "文件地址",
    "errorLogLevel": "warning",
}
```

> `accessLogType`: "console" | "file" | "event" | "none"

访问日志的日志输出方式，默认值为`"none"`。

* `"console"`：将日志输出到标准输入输出。
* `"file"`：将日志输出到文件，须指定`"accessLogPath"`。
* `"event"`：暂未使用。
* `"none"`：不记录任何内容。

> `accessLogPath`: string

访问日志的文件地址，其值是一个合法的文件地址，如`"/var/log/v2ray/access.log"`（Linux）或者`"C:\\Temp\\v2ray\\_access.log"`（Windows）。

> `errorLogType`: "console" | "file" | "event" | "none"

访问日志的日志输出方式，默认值为`"none"`。

* `"console"`：将日志输出到标准输入输出。
* `"file"`：将日志输出到文件，须指定`"errorLogPath"`。
* `"event"`：暂未使用。
* `"none"`：不记录任何内容。

> `errorLogPath`: string

错误日志的文件地址，其值是一个合法的文件地址，如`"/var/log/v2ray/error.log"`（Linux）或者`"C:\\Temp\\v2ray\\_error.log"`（Windows）。当此项不指定或为空值时，表示将日志输出至 stdout。

> errorLogLevel: "debug" | "info" | "warning" | "error"

日志的级别。默认值为 `"warning"`。

* `"debug"`：详细的调试性信息。同时包含所有 `"info"` 内容。
* `"info"`：V2Ray 在运行时的状态，不影响正常使用。同时包含所有 `"warning"` 内容。
* `"warning"`：V2Ray 遇到了一些问题，通常是外部问题，不影响 V2Ray 的正常运行，但有可能影响用户的体验。同时包含所有 `"error"` 内容。
* `"error"`：V2Ray 遇到了无法正常运行的问题，需要立即解决。
