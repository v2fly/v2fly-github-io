# Configuration File Format (Draft)

:::tip
The document for V4 version of the config can be found [here](/en_US/config/overview.md).
:::

## Overview

In the V5 major release, a new configuration schema for users is introduced. This configuration format is designed to replace the previous version of configuration format. Currently this format is in the drafting phase, and may change at any time.

:::tip
To run your configure file in V5, execute `./v2ray run -c $configure_file_name -format jsonv5`
:::

```json
{
    "log": {},
    "dns": {},
    "router": {},
    "inbounds": [],
    "outbounds": [],
    "services": {}
}
```

> `log`: [LogObject](#logobject)

Log collector setting. Specify the settings regarding the recording of events.

A sensible default will be provided if this entry is not set.

> `dns`: [DnsObject](dns.md)

Built-in DNS client. Specify hostname resolution settings.

Local DNS will be used if this entry is not set.

> `router`: [RoutingObject](router.md)

Routing.

All traffic will be sent to the first outbound if this entry is left empty.

> `inbounds`: \[ [InboundObject](inbound.md) \]

Inbounds. Describe the listener for incoming connections.

> `outbounds`: \[ [OutboundObject](outbound.md) \]

Outbounds. Describe the configuration for outgoing connections.

> `services`: \[ [ServiceObject](service.md) \]

Auxiliary Services. Define additional components.

These settings configure additional functionalities.
They are not required for the essential functionality of the software. However, these settings enable advanced features that enable complex use cases.

## LogObject

`LogObject` is a json field which the configuration file uses in `log`.

```json
{
    "access":{},
    "error":{}
}
```

> `access`: LogSpecObject

Access log settings.

> `error`: LogSpecObject

Error log settings.

## LogSpecObject

> `type`: "None" | "Console" | "File"

* `"None"`：Log will be discarded.
* `"Console"`：Log will be outputed to standard output.
* `"File"`：Log will be outputed to a file.

> `path`: string

File path of log. It should be a valid path string, such as `"/tmp/v2ray/_error.log"` (Linux) or `"C:\\Temp\\v2ray\\_error.log"` (Windows).

> `level`: "Debug" | "Info" | "Warning" | "Error" | "None"

Level of log. Default value is `"warning"`。

* `"Debug"`：Information for developers. All `"Info"` included.
* `"Info"`：Running stats of V2Ray，no effect for the functions. All `"Warning"` included.
* `"Warning"`：V2Ray may have encountered some problem, usually some external problem that does not affect V2Ray but possibly the user experience. All `"Error"` included.
* `"Error"`：V2Ray encountered a problem that needs to be resolved immediately.
* `"None"`：Nothing will be printed.
