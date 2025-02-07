# Reverse Proxy

Reverse proxy is an additional feature of V2Ray that allows forwarding server-side traffic to the client, effectively enabling reverse traffic forwarding.

:::tip
The reverse proxy feature is available in V2Ray 4.0+. It is currently in beta and may have some issues.
:::

The basic working principle of reverse proxy is as follows:

* Suppose there is a web server on host A that has no public IP address and cannot be accessed directly from the internet. There is another host B that can be accessed from the public internet. We need to use B as an entry point to forward traffic from B to A.
* Configure a V2Ray instance called `bridge` on host A, and another V2Ray instance called `portal` on host B.
* `bridge` actively establishes connections to `portal` with a configurable destination address. `portal` receives two types of connections: ones from `bridge` and ones from public internet users. `portal` automatically merges these two types of connections, allowing `bridge` to receive public internet traffic.
* After receiving public traffic, `bridge` forwards it unchanged to the web server on host A. This step requires routing cooperation.
* `bridge` performs dynamic load balancing based on traffic volume.

:::warning
Reverse proxy has [Mux](mux.md) enabled by default. Do not enable Mux again on the outbound proxies it uses.
:::

## ReverseObject

`ReverseObject` corresponds to the `reverse` entry in the configuration file.

```json
{
    "bridges": [
        {
            "tag": "bridge",
            "domain": "test.v2fly.org"
        }
    ],
    "portals": [
        {
            "tag": "portal",
            "domain": "test.v2fly.org"
        }
    ]
}
```

> `bridges`: \[[BridgeObject](#bridgeobject)\]

An array where each item represents a `bridge`. Each `bridge` configuration is a [BridgeObject](#bridgeobject).

> `portals`: \[[PortalObject](#portalobject)\]

An array where each item represents a `portal`. Each `portal` configuration is a [PortalObject](#portalobject).

## BridgeObject

```json
{
    "tag": "bridge",
    "domain": "test.v2fly.org"
}
```

> `tag`: string

An identifier that all connections from the `bridge` will carry. This can be used in [routing](routing.md) with `inboundTag` for identification.

> `domain`: string

A domain name used for connections from `bridge` to `portal`. This domain name is only used for communication between `bridge` and `portal` and doesn't need to actually exist.

## PortalObject

```json
{
    "tag": "portal",
    "domain": "test.v2fly.org"
}
```

> `tag`: string

The `portal` identifier. Used in [routing](routing.md) with `outboundTag` to forward traffic to this `portal`.

> `domain`: string

A domain name. When `portal` receives traffic, if the destination domain matches this domain, `portal` considers it a communication connection from `bridge`. Other traffic is treated as traffic to be forwarded. The `portal`'s job is to identify and merge these two types of connections.

:::tip
Like other configurations, a V2Ray instance can act as a `bridge`, a `portal`, or both simultaneously, depending on your needs.
:::

## Complete Configuration Examples

A `bridge` typically needs two outbound proxies: one for connecting to the `portal` and another for sending actual traffic. This means you need to use routing to distinguish between these two types of traffic.

Reverse proxy configuration:

```json
{
    "bridges": [
        {
            "tag": "bridge",
            "domain": "test.v2fly.org"
        }
    ]
}
```

Outbound proxy:

```json
{
    "tag": "out",
    "protocol": "freedom",
    "settings": {
        "redirect": "127.0.0.1:80" // Forward all traffic to web server
    }
},
{
    "protocol": "vmess",
    "settings": {
        "vnext": [
            {
                "address": "portal's IP address",
                "port": 1024,
                "users": [
                    {
                        "id": "27848739-7e62-4138-9fd3-098a63964b6b"
                    }
                ]
            }
        ]
    },
    "tag": "interconn"
}
```

Routing configuration:

```json
"routing": {
    "rules": [
        {
            "type": "field",
            "inboundTag": [
                "bridge"
            ],
            "domain": [
                "full:test.v2fly.org"
            ],
            "outboundTag": "interconn"
        },
        {
            "type": "field",
            "inboundTag": [
                "bridge"
            ],
            "outboundTag": "out"
        }
    ]
}
```

A `portal` typically needs two inbound proxies: one for receiving connections from `bridge` and another for receiving actual traffic. You also need routing to distinguish between these two types of traffic.

Reverse proxy configuration:

```json
{
    "portals": [
        {
            "tag": "portal",
            "domain": "test.v2fly.org" // Must match bridge configuration
        }
    ]
}
```

Inbound proxy:

```json
{
    "tag": "external",
    "port": 80, // Open port 80 for external HTTP access
    "protocol": "dokodemo-door",
    "settings": {
        "address": "127.0.0.1",
        "port": 80,
        "network": "tcp"
    }
},
{
    "port": 1024, // For receiving bridge connections
    "tag": "interconn",
    "protocol": "vmess",
    "settings": {
        "clients": [
            {
                "id": "27848739-7e62-4138-9fd3-098a63964b6b"
            }
        ]
    }
}
```

Routing configuration:

```json
"routing": {
    "rules": [
        {
            "type": "field",
            "inboundTag": [
                "external"
            ],
            "outboundTag": "portal"
        },
        {
            "type": "field",
            "inboundTag": [
                "interconn"
            ],
            "outboundTag": "portal"
        }
    ]
}
```

:::tip
During operation, it's recommended to start the `bridge` first, then start the `portal`.
:::
