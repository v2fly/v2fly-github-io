# Remote control API

Some V2Ray APIs can be opened for remote control. These APIs are based on [gRPC](https://grpc.io/). This API is mostly for advanced users.

When remote control is turned on, V2Ray will build an outbound proxy by itself, which is identified by the value of the `tag` configuration. The user must manually point all inbound gRPC connections to this outbound proxy through [routing](routing.md).

## ApiObject

`ApiObject` corresponds to the `api` item of the configuration file.

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

Outbound proxy ID.

> `services`: \[string\]

The list of available APIs, see [API list](#list-of-supported-apis) for details.

## List of supported APIs

### HandlerService

Some of the APIs that modify the inbound and outbound proxy:

* Add a new inbound proxy;
* Add a new outbound proxy;
* Delete an existing inbound proxy;
* Delete an existing outbound proxy;
* Add a user to an inbound proxy (only support VMess, VLESS, Trojan);
* Delete a user in an inbound proxy (only support VMess, VLESS, Trojan);

### LoggerService

Supports the restart of the built-in Logger, and can cooperate with logrotate to perform some operations on the log file.

### StatsService

The built-in data statistics service, please refer to [Statistics](stats.md) for details.

### ObservatoryService

[Connection Observatory](observatory.md) API (v4.38.0+).
