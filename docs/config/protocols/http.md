# HTTP

* Name: `http`
* Type: Inbound/Outbound

The HTTP configuration is divided into two parts, `InboundConfigurationObject` and `OutboundConfigurationObject`, which correspond to the `settings` items in the inbound and outbound protocol configuration respectively.

## InboundConfigurationObject

```json
{
    "timeout": 0,
    "accounts": [
        {
            "user": "my-username",
            "pass": "my-password"
        }
    ],
    "allowTransparent": false,
    "userLevel": 0
}
```

:::tip
It should be noted that although `http inbound` can provide public services, the http protocol does not encrypt the transmission and is not suitable for transmission over the public network. It is more likely to be a broiler for attacks. A more meaningful usage of `http inbound` is to monitor in a local area network or local environment to provide local services for other programs.
:::

> `timeout`: number

The timeout setting (seconds) for reading data from the client, 0 means unlimited time. The default value is 300. After V2Ray 3.1, it is equivalent to the `connIdle` strategy corresponding to the user level.

> `accounts`: \[[AccountObject](#accountobject)\]

An array, each element in the array is a user account. The default value is empty.

When `accounts` is not empty, the HTTP proxy will perform HTTP Basic Authentication for inbound connections.

> `allowTransparent`: true | false

When `true`, all HTTP requests will be forwarded, not just proxy requests. If not configured properly, turning on this option will cause an endless loop.

> `userLevel`: number

User level, all connections use this level.

### AccountObject

```json
{
    "user": "my-username",
    "pass": "my-password"
}
```

> `user`: string

User name, string type. Required.

> `pass`: string

Password, string type. Required.

:::tip
Use the following environment variables in Linux to use the global HTTP proxy in the current session (many software supports this setting, and some do not).

* `export http_proxy=http://127.0.0.1:8080/` (The address must be changed to the HTTP inbound proxy address you configured)
* `export https_proxy=$http_proxy`
:::

## OutboundConfigurationObject

```json
{
    "servers": [
        {
            "address": "192.168.108.1",
            "port": 3128,
            "users": [
                {
                    "user": "my-username",
                    "pass": "my-password"
                }
            ]
        }
    ]
}
```

(V2Ray 4.21.0+)

:::tip
It should be noted that although `http outbound` can be used as a configuration for external access, the `http proxy` protocol does not encrypt the transmission, which is not suitable for transmission over the public network, and because it does not support UDP transmission, the core functions will be limited (Routing's DNS queries may not be available). The more meaningful usage of `http outbound` is that under special circumstances, you can only use `http proxy` to access the internal network externally, as a pre-proxy for connecting to proxy servers for other protocols (see `ProxySettingsObject` of `OutboundObject`) . In addition, because `http proxy` can only proxy the TCP protocol, none of the UDP protocols can pass.
:::

(V2Ray 4.21.1+)

:::tip
In version 4.20.0, http outbound was introduced as the pre-proxy usage of other protocols, and it lacked support for TLS configuration. In the 4.21.1 patch version, the `security` and `tlsSettings` in `streamSettings` remain effective. In the current usage of front proxy, three protocol methods such as vmess/tcp, vmess/tcp-tls and shadowsocks can be used. The usage of front proxy for other transmission protocols needs to be developed and supported in subsequent versions.
:::

> `servers`: array

HTTP proxy server configuration, if you configure more than one, use (RoundRobin) circularly.

> `address`: string

HTTP proxy server address, required.

> `port`: int

HTTP proxy server port, required.

> `user`: \[[AccountObject](#accountobject)\]

An array, each element in the array is a user account. The default value is empty.
