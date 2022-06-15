# HTTP

* Name: `http`
* Type: Inbound/Outbound

HTTP's configuration is divided into two parts, `InboundConfigurationObject` and `OutboundConfigurationObject`, corresponding to the `settings` element in the inbound and outbound protocol configuration respectively.

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
Note that although inbound HTTP can provide public services, the HTTP protocol is not encrypted and is thus not suitable for transmission over public networks, as it would be highly vulnerable to MITM attacks. A more meaningful use of inbound HTTP is to open the inbound only to the local machine (loopback), Local Area Network, or other internal networks to provide services for other programs.
:::

> `timeout`: number

Timeout for client HTTP requests in seconds, 0 for no timeout. The default value is 300. (Since v3.1) Equivalent to the `connIdle` policy of the corresponding user level.

> `accounts`: \[[AccountObject](#accountobject)\]

An array, each element of which is an [AccountObject](#AccountObject). The default value is empty.

When `accounts` is non-empty, HTTP will perform Basic Authentication (`WWW-Authenticate`) on inbound connections.

> `allowTransparent`: true | false

When set to `true`, all HTTP requests will be forwarded, not just proxy requests. If incorrectly configured, enabling this option may cause a loop.

> `userLevel`: number

User level, default value is `0`. See [Local Policy](../policy.md).

### AccountObject

```json
{
    "user": "USERNAME",
    "pass": "PASSWORD"
}
```

> `user`: string

Username, can be any string. Required.

> `pass`: string

Password, can be any string. Required.

:::tip
In Linux, you can set the following environment variables to use a global HTTP proxy in the current user session (most but not all applications respect this setting).

* `export http_proxy=http://127.0.0.1:8080/` (the address must be changed to the HTTP inbound proxy address you configured)
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
                    "user": "USERNAME",
                    "pass": "PASSWORD"
                }
            ]
        }
    ]
}
```

(Since v4.21.0)

:::tip
Note that although outbound HTTP can be used as a configuration for external access, the HTTP protocol is not encrypted and is thus not suitable for usage over public networks. Additionally, because HTTP does not support UDP routing, it will limit available networking functionality for supplementary protocols (DNS queries are unavailable for example). A more meaningful use of outbound HTTP is in special cases, where only an HTTP proxy can be used to access an internal network from an external connection, as a pre-proxy for connections of other protocol connections (see `OutboundObject`'s `ProxySettingsObject`).
:::

(Since v4.21.1)

:::tip
Since v4.20.0, outbound HTTP was added as a pre-proxy for other protocols, albeit lacking support for TLS configurations. From v4.21.1 onwards, HTTP will also inherits the effect of `security` and `tlsSettings` in `streamSettings`. Currently, protocols VMESS/TCP, VMESS/TCP-TLS, and Shadowsocks can be used for such a pre-proxy, and pre-proxy usage of other transport protocols are pending implementation in future versions.
:::

> `servers`: array

An array of HTTP proxies to use. If multiple items are present, they are picked round-robin.

> `address`: string

Remote HTTP proxy server address. Required.

> `port`: int

Remote HTTP proxy server port. Required.

> `user`: \[[AccountObject](#accountobject)\]

An array of credentials , each element of which is an [AccountObject](#AccountObject). Optional, default is no authentication.
