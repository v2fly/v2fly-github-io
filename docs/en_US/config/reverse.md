# Reverse Proxy 

Reverse proxy is an additional function of V2Ray which can forward server-side traffic to the client. That is, provide reverse traffic forwarding.

:::tip
The Reverse Proxy was introduced in v4.0. It is still in a beta stage and may not be fully stable.
:::

Reverse Proxy general working principle:

* Assume that there is a web server on host A, which does not have a public IP and cannot be directly accessed on the internet. There is another host B which can be accessed from the public internet. Now we need to use B as a proxy and forward traffic from B to A.
* Configure an instance of V2Ray on host A, called `bridge`, and configure another instance of V2Ray on host B, called `portal`.
* `bridge` will actively establish a connection to `portal`. The target address of this connection can be set manually. `portal` will receive two kinds of connections: one is the connection established by `bridge`, and the other is any connection requested by a client on the public network. `portal` will automatically merge the two types of traffic, so that `bridge` can receive internet traffic.
* After receiving internet traffic, `bridge` will forward it as-is to the web server on host A. This requires a proper routing configuration.
* `bridge` will dynamically load-balance responsively depending on traffic bandwidth.

:::warning
The reverse proxy defaults to [Mux](mux.md)-enabled, do not enable Mux again on the outbound which it uses.
:::

## ReverseObject

`ReverseObject` corresponds to the `reverse` item in the configuration file.

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

An array, where each item represents a `bridge`, which is a [BridgeObject](#bridgeobject).

> `portals`: \[[PortalObject](#portalobject)\]

An array, where each item represents a `portal`, which is a [PortalObject](#bridgeobject).

## BridgeObject

```json
{
    "tag": "bridge",
    "domain": "test.v2fly.org"
}
```

> `tag`: string

A routing label of the `bridge`, applied to all connections sent by `bridge`, which can be used for [routing](routing.md).

> `domain`: string

A domain name. The connection established by `bridge` to `portal` will utilize this domain name. This domain name is only used for routing between the `bridge` and `portal`, and need not actually exist.

## PortalObject

```json
{
    "tag": "portal",
    "domain": "test.v2fly.org"
}
```

> `tag`: string

A routing label of the `portal`. In [routing](routing.md), use `outboundTag` to forward traffic to this `portal`.

> `domain`: string

A domain name. When `portal` receives traffic with this domain as the destination, `portal` treats it as traffic from `bridge`. Other traffic will be regarded as traffic to be forwarded to `bridge`. The purpose of `portal` is to correctly route and splice these two types of connections.

:::tip
A V2Ray instance can be configured as either a `bridge`, a `portal`, or both at the same time for different applications.
:::

## Example: Working Configuration

`bridge` generally requires two outbounds: one for connecting to `portal`, and the other for sending actual traffic. In other words, you need to configure routing to distinguish between the two types of outbound traffic.

Reverse Proxy:

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

Outbound:

```json
{
    "tag": "out",
    "protocol": "freedom",
    "settings": {
        "redirect": "127.0.0.1:80" // Forward all traffic to the web server
    }
},
{
    "protocol": "vmess",
    "settings": {
        "vnext": [
            {
                "address": "portal 的 IP 地址",
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

Routing:

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

`portal` generally requires two inbounds: one for receiving connections from `bridge`, and the other for receiving actual traffic. Again, routing needs to be configured to distinguish between the two types of traffic.

Reverse Proxy:

```json
{
    "portals": [
        {
            "tag": "portal",
            "domain": "test.v2fly.org" // Must be identical to bridge domain
        }
    ]
}
```

Inbound:

```json
{
    "tag": "external",
    "port": 80, // Bind to port 80 to receive HTTP requests
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

Routing:

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
It is recommended to start the `bridge` instance before `portal`.
:::
