# Socks

* 名称：`socks`
* 类型：入站 / 出站

标准 Socks 协议实现，兼容 [Socks 4](http://ftp.icm.edu.pl/packages/socks/socks4/SOCKS4.protocol)、Socks 4a 和 [Socks 5](http://ftp.icm.edu.pl/packages/socks/socks4/SOCKS4.protocol)。

Socks 的配置分为两部分，`InboundConfigurationObject` 和 `OutboundConfigurationObject`，分别对应入站和出站协议配置中的 `settings` 项。

:::warning
如果你将 Socks5 代理在不安全的网络环境中分享给其他人使用，建议搭配防火墙使用。

Rfc: [SOCKS 5 的认证在使用 UDP 时可被绕过](https://github.com/v2fly/v2fly-github-io/issues/104)
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

需要注意：虽然 Socks Outbound 可以作为对外访问的配置，但 Socks 协议没有对传输加密，不适宜经公网中传输。

Socks Outbound 更有意义的用法是在特殊情况下，只能使用 Socks Proxy 对外访问内部网络中，作为为其他协议连接代理服务器的前置代理使用（见 `OutboundObject` 的 `ProxySettingsObject`）。

> `servers`: \[ [ServerObject](#serverobject) \]

Socks 服务器列表，其中每一项是一个服务器配置。

> `version`: "5" | "4a" | "4"

Socks 协议版本。 (v4.42.2+)

### ServerObject

```json
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
```

> `address`: address

服务器地址。

> `port`: number

服务器端口

> `users`: \[ [UserObject](#userobject) \]

用户列表，其中每一项一个用户配置。当列表不为空时，Socks 客户端会使用此用户信息进行认证；如未指定，则不进行认证。

### UserObject

```json
{
    "user": "test user",
    "pass": "test pass",
    "level": 0
}
```

> `user`: string

用户名

> `pass`: string

密码

> `level`: number

用户等级

## InboundConfigurationObject

应该注意，虽然 socks inbound 可以公共服务端口，但 socks 协议没有对传输加密，不适宜经公网中传输。socks inbound 更有意义的用法是在局域网或本机环境下，为其他程序提供本地服务。

```json
{
    "auth": "noauth",
    "accounts": [
        {
            "user": "my-username",
            "pass": "my-password"
        }
    ],
    "udp": false,
    "ip": "127.0.0.1",
    "userLevel": 0,
    "packetEncoding": "None"
}
```

> `auth`: "noauth" | "password"

Socks 协议的认证方式，支持 `"noauth"` 匿名方式和 `"password"` 用户密码方式。默认值为 `"noauth"`。

> `accounts`: \[ [AccountObject](#accountobject) \]

一个数组，数组中每个元素为一个用户帐号。默认值为空。此选项仅当 `auth` 为 `password` 时有效。

> `udp`: true | false

是否开启 UDP 协议的支持。默认值为 `false`。

> `ip`: address

SOCKS5 通过 `UDP ASSOCIATE` 命令建立 UDP 会话。服务端在对客户端发来的该命令的回复中，指定客户端发包的目标地址。

* v4.34.0+: 默认值为空，此时对于通过本地回环 IPv4/IPv6 连接的客户端，回复对应的回环 IPv4/IPv6 地址；对于非本机的客户端，回复当前入站的监听地址。
* v4.33.0 及更早版本: 默认值 `127.0.0.1`。

你可以通过配置此项使 V2Ray 固定回复你配置的地址。如果你不知道此项的作用，留空即可。

> `userLevel`: number

用户等级，所有连接使用这一等级。

> `packetEncoding`: "None" | "Packet"

UDP 包编码方式，默认值为 `None`。
当该值为 `None` 时，UDP 将根据目标地址被映射 (Address and Port-Dependent Mapping)。
当该值为 `Packet` 时，UDP 将被端点独立映射 (Endpoint Independent Mapping)，此 UDP 行为也被称为 FullCone 或 NAT1。

### AccountObject

```javascript
{
    "user": "my-username",
    "pass": "my-password"
}
```

> `user`: string

用户名

> `pass`: string

密码
