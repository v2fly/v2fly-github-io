# Policy

Local policies can configure user-related permissions, such as connection timeout settings. Every connection handled by V2Ray corresponds to a user, and different policies are applied according to the user's level. Local policies can vary based on different levels.

## PolicyObject

`PolicyObject` corresponds to the `policy` entry in the configuration file.

```json
{
    "levels": {
        "0": {
            "handshake": 4,
            "connIdle": 300,
            "uplinkOnly": 2,
            "downlinkOnly": 5,
            "statsUserUplink": false,
            "statsUserDownlink": false,
            "bufferSize": 10240
        }
    },
    "system": {
        "statsInboundUplink": false,
        "statsInboundDownlink": false,
        "statsOutboundUplink": false,
        "statsOutboundDownlink": false
    }
}
```

> `level`: map{string: [LevelPolicyObject](#levelpolicyobject)}

A key-value pair where each key is a number in string format (JSON requirement), such as `"0"`, `"1"`, etc. The quotation marks cannot be omitted. This number corresponds to the user level. Each value is a [LevelPolicyObject](#levelpolicyobject).

:::tip
Each inbound and outbound proxy can now set user levels, and V2Ray will apply different local policies based on the actual user level.
:::

> `system`: [SystemPolicyObject](#systempolicyobject)

System policies for V2Ray

## LevelPolicyObject

```json
{
    "handshake": 4,
    "connIdle": 300,
    "uplinkOnly": 2,
    "downlinkOnly": 5,
    "statsUserUplink": false,
    "statsUserDownlink": false,
    "bufferSize": 10240
}
```

> `handshake`: number

Time limit for connection handshake. Unit is seconds. Default value is `4`. When an inbound proxy processes a new connection during the handshake phase (e.g., VMess reading header data, determining target server address), if the time used exceeds this limit, the connection will be terminated.

> `connIdle`: number

Connection idle time limit. Unit is seconds. Default value is `300`. When processing a connection in inbound/outbound proxies, if no data (including uplink and downlink) is transmitted within `connIdle` time, the connection will be terminated.

> `uplinkOnly`: number

Time limit after downlink connection closure. Unit is seconds. Default value is `2`. When the server (e.g., remote website) closes the downlink connection, the outbound proxy will terminate the connection after waiting for `uplinkOnly` seconds.

> `downlinkOnly`: number

Time limit after uplink connection closure. Unit is seconds. Default value is `5`. When the client (e.g., browser) closes the uplink connection, the inbound proxy will terminate the connection after waiting for `downlinkOnly` seconds.

:::tip
In HTTP browsing scenarios, you can set both `uplinkOnly` and `downlinkOnly` to `0` to improve connection closure efficiency.
:::

> `statsUserUplink`: true | false

When set to `true`, enables uplink traffic statistics for all users at the current level.

> `statsUserDownlink`: true | false

When set to `true`, enables downlink traffic statistics for all users at the current level.

> `bufferSize`: number

Internal buffer size for each connection. Unit is kB. When set to `0`, internal buffer is disabled.

Default values (V2Ray 4.4+):

* On ARM, MIPS, MIPSLE platforms: default is `0`
* On ARM64, MIPS64, MIPS64LE platforms: default is `4`
* On other platforms: default is `512`

Default values (V2Ray 4.3-):

* On ARM, MIPS, MIPSLE, ARM64, MIPS64, MIPS64LE platforms: default is `16`
* On other platforms: default is `2048`

:::tip
The `bufferSize` option overrides the `v2ray.ray.buffer.size` setting in [environment variables](env.md#buffer-size-per-connection).
:::

## SystemPolicyObject

```json
{
    "statsInboundUplink": false,
    "statsInboundDownlink": false,
    "statsOutboundUplink": false,
    "statsOutboundDownlink": false
}
```

> `statsInboundUplink`: true | false

When set to `true`, enables uplink traffic statistics for all inbound proxies.

> `statsInboundDownlink`: true | false

When set to `true`, enables downlink traffic statistics for all inbound proxies.

> `statsOutboundUplink`: true | false

(V2Ray 4.26.0+) When set to `true`, enables uplink traffic statistics for all outbound proxies.

> `statsOutboundDownlink`: true | false

(V2Ray 4.26.0+) When set to `true`, enables downlink traffic statistics for all outbound proxies.
