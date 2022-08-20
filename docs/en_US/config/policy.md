# Local Policy

Local policies can apply different configurations on a per-user basis. Each connection processed by V2Ray corresponds to a user, and overlapping policies are patched sequentially according to the policy's level.

## PolicyObject

`PolicyObject` corresponds to the `policy` element in the configuration file.

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

A set of key-value pairs, each key is a string in the form of a number (which meets JSON requirements), such as `"0"`, `"1"`, etc. Double quotes cannot be omitted. The key corresponds to the user level. The value is a [LevelPolicyObject](#levelpolicyobject).

:::tip
Both inbound and outbound proxies can now set a user level, and V2Ray will apply different local policies according to the effective user level.
:::

> `system`: [SystemPolicyObject](#systempolicyobject)

V2Ray policy, see [SystemPolicyObject](#SystemPolicyObject).

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

The timeout for finishing new connection handshakes, in seconds. The default value is `4`. When an inbound proxy processes a new connection, during the handshake stage (for example, when VMess reads the header data to determine the target server address), if the timeout is hit the connection will be reset.

> `connIdle`: number

The timeout for idle connections, in seconds. The default value is `300`. When an inbound or outbound handles a connection, if no data is transferred within `connIdle` time (including uplink and downlink data), the connection will be closed.

> `uplinkOnly`: number

The timeout after a downstream connection is closed, in seconds. The default value is `2`. When a server (such as the remote website) closes the downstream connection, an outbound will discard the connection after this timeout hits.

> `downlinkOnly`: number

The timeout after an upstream connection is closed, in seconds. The default value is `5`. When a client (such as the user's browser) closes the upstream connection, an outbound will discard the connection after this timeout hits.

:::tip
For HTTP browsing, `uplinkOnly` and `downlinkOnly` can be set to `0` to improve the efficiency of closing connections.
:::

> `statsUserUplink`: true | false

When the value is set to`true`, enable uplink traffic statistics of all users at this level.

> `statsUserDownlink`: true | false

When the value is set to `true`, enable downlink traffic statistics of all users at this level.

> `bufferSize`: number

The size of the buffer used for each connection, in kB. When the value is set to `0`, the internal cache is disabled.

Default values depending on processor architecture, since v4.4:

* On ARM, MIPS, MIPSLE: `0`.
* On ARM64, MIPS64, MIPS64LE: `4`.
* On other platforms: `512`.

v4.3 or older:

* On ARM, MIPS, MIPSLE, ARM64, MIPS64, MIPS64LE: `16`.
* On other platforms: `2048`.

:::tip
The `bufferSize` option overrides the [environment variable](env.md#Cache size for each connection) `v2ray.ray.buffer.size`.
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

When the value is set to `true`, enable uplink traffic statistics of all inbound proxies.

> `statsInboundDownlink`: true | false

When the value is set to `true`, enable downlink traffic statistics of all inbound proxies.

> `statsOutboundUplink`: true | false

(Since v4.26.0) When the value is set to `true`, enable uplink traffic statistics of all outbound proxies.

> `statsOutboundDownlink`: true | false

(Since v4.26.0) When the value is `true`, enable downlink traffic statistics of all outbound proxies.
