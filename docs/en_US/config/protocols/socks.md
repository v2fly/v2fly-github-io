# SOCKS

* Name: `socks`
* Type: Inbound / Outbound

Socks is an inbound/outbound protocol. It is an unencrypted traffic tunnel protocol. This is a standard SOCKS protocol implementation, compatible with [SOCKS 4](http://ftp.icm.edu.pl/packages/socks/socks4/SOCKS4.protocol), SOCKS 4a, and [SOCKS 5](http://ftp.icm.edu.pl/packages/socks/socks4/SOCKS4.protocol).

Socks configuration is divided into two parts, `InboundConfigurationObject` and `OutboundConfigurationObject`, corresponding to the `settings` element in the inbound and outbound protocol configuration respectively.

:::warning
If you share your Socks5 proxy with others over an insecure network, it is recommended to use a firewall.

Reference: [SOCKS 5 Authentication Bypassed over UDP](https://github.com/v2fly/v2fly-github-io/issues/104)
:::

## OutboundConfigurationObject

```json
{
    "servers": [
        {
            "address": "127.0.0.1",
            "port": 1234,
            "users": [
                {
                    "user": "test user",
                    "pass": "test pass",
                    "level": 0
                }
            ]
        }
    ]
}
```

Note that while outbound Socks can be used over the open internet, the Socks protocol is not encrypted and is not suitable for transmission over public networks.

A more meaningful use of outbound Socks is in special cases where only a SOCKS proxy can be used to access an internal network, and it is used as a proxy for other protocols to connect to the internal network (see `OutboundObject`'s `ProxySettingsObject`).

> `servers`: \[ [ServerObject](#serverobject) \]

List of SOCKS servers, where each item is a server configuration.

> `version`: "5" | "4a" | "4"

(Since v4.42.2) SOCKS protocol version.

### ServerObject

```json
{
    "address": "127.0.0.1",
    "port": 1234,
    "users": [
        {
            "user": "USERNAME",
            "pass": "PASSWORD",
            "level": 0
        }
    ]
}
```

> `address`: address

Remote SOCKS Server address. Required.

> `port`: number

Remote SOCKS Server port. Required.

> `users`: \[ [UserObject](#userobject) \]

List of users, where each element is a user configuration. If there are any valid configuration available, the Socks client will use this user information for authentication; if not specified, no authentication will be performed.

### UserObject

```json
{
    "user": "USERNAME",
    "pass": "PASSWORD",
    "level": 0
}
```

> `user`: string

SOCKS Username.

> `pass`: string

SOCKS Password.

> `level`: number

User level, default value is `0`. See [Local Policy](../policy.md).

## InboundConfigurationObject

Note that although inbound Socks can bind to public ports, the Socks protocol is not encrypted and is not suitable for transmission over a public network. A more meaningful use of inbound Socks is to provide services for other programs on the local network or environment.

```json
{
    "auth": "noauth",
    "accounts": [
        {
            "user": "USERNAME",
            "pass": "PASSWORD"
        }
    ],
    "udp": false,
    "ip": "127.0.0.1",
    "userLevel": 0
}
```

> `auth`: "noauth" | "password"

The authentication method of the SOCKS protocol, supporting `"noauth"` (anonymous mode) and `"password"` (user-password). The default value is `"noauth"`.

> `accounts`: \[ [AccountObject](#accountobject) \]

An array, where each element in the array is an [AccountObject](#AccountObject). The default value is empty. This option is only valid when `auth` is set to `password`.

> `udp`: true | false

Whether to enable forwarding UDP traffic. The default value is `false`.

> `ip`: address

SOCKS5 establishes a UDP session through the `UDP ASSOCIATE` command. In the response to the command from the client, the server specifies the target address of the packet sent by the client.

* v4.34.0 Onwards: The default value is empty, in which case the loopback IPv4/IPv6 address is used for a client connecting through the local IPv4/IPv6 loopback, and the current inbound listening address is used for a client that is not on the local machine.
* v4.33.0 and Earlier: The default value is `127.0.0.1`.

You can configure this option to make V2Ray respond with a specific address. This is optional and only required for complex configurations.

> `userLevel`: number

User level, default value is `0`. See [Local Policy](../policy.md).

### AccountObject

```javascript
{
    "user": "USERNAME",
    "pass": "PASSWORD"
}
```

> `user`: string

Local SOCKS Username.

> `pass`: string

Local SOCKS Password.
