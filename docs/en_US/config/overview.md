# Configuration File Format

## Overview

Configuration of V2Ray is a file with the following format, both for server and client, but the settings are different.

If you are a beginner of V2Ray, please start from understanding Inbounds and Outbounds. Filling in the necessary settings only and the application should work. Then learn about other components step-by-step. You will find that V2Ray is easy to use.

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

Log configuration, instructing V2Ray how to print logs.

> `api`: [ApiObject](api.md)

Remote control.

> `dns`: [DnsObject](dns.md)

Build-in DNS servers. If this field does not exist, use local DNS by default.

> `routing`: [RoutingObject](routing.md)

Routing.

> `policy`: [PolicyObject](policy.md)

Local policy, permission-related configurations.

> `inbounds`: \[ [InboundObject](inbounds.md) \]

An array, each element of which is an inbound connection configuration.

> `outbounds`: \[ [OutboundObject](outbounds.md) \]

An array, each element of which is an outbound connection configuration. The first element in the list is the primary outbound connection. When the route matching cannot be found or the matching is invalid, the traffic is routed to the primary outbound connection.

> `transport`: [TransportObject](transport.md)

Telling V2Ray how to establish and keep connections with other servers.

> `stats`: [StatsObject](stats.md)

Statistics.

> `reverse`: [ReverseObject](reverse.md)

Reverse proxy.

## LogObject

`LogObject` is a json field which the configuration file uses in `log`.

```json
{
    "access": "file path",
    "error": "file path",
    "loglevel": "warning"
}
```

> `access`: string

File path of log. It should be a valid path string, such as `"/tmp/v2ray/_access.log"` (Linux) or`"C:\\Temp\\v2ray\\_access.log"` (Windows). If it is empty, the log will be printed to stdout by default. V2Ray 4.20 added a special value `none`, which means no access to log.

> `error`: string

File path of error log. It should be a valid path string, such as `"/tmp/v2ray/_error.log"` (Linux) or `"C:\\Temp\\v2ray\\_error.log"` (Windows). If it is empty, the error will be printed to stdout by default. V2Ray 4.20 added a special value `none`, which means no access to error.

> `loglevel`: "debug" | "info" | "warning" | "error" | "none"

Level of log. Default value is `"warning"`。

* `"debug"`：Information for developers. All `"info"` included.
* `"info"`：Running stats of V2Ray，no effect for the functions. All `"warning"` included.
* `"warning"`：V2Ray encountered some problems, usually external problems, which do not affect V2Ray, but may affect the user experience. All `"error"` included.
* `"error"`：V2Ray encountered a problem that needs to be resolved immediately.
* `"none"`：Nothing will be printed.
