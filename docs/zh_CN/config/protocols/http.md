# HTTP

* 名称：`http`
* 类型：入站／出站

HTTP 的配置分为两部分，`InboundConfigurationObject` 和 `OutboundConfigurationObject`，分别对应入站和出站协议配置中的 `settings` 项。

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
应该注意，虽然 `http inbound` 可以提供公共服务，但 http 协议没有对传输加密，不适宜经公网中传输，更容易成为被人用作攻击的肉鸡。`http inbound` 更有意义的用法是在局域网或本机环境下监听，为其他程序提供本地服务。
:::

> `timeout`: number

从客户端读取数据的超时设置（秒），0 表示不限时。默认值为 300。 V2Ray 3.1 后等价于对应用户等级的 `connIdle` 策略。

> `accounts`: \[[AccountObject](#accountobject)\]

一个数组，数组中每个元素为一个用户帐号。默认值为空。

当 `accounts` 非空时，HTTP 代理将对入站连接进行 Basic Authentication 验证。

> `allowTransparent`: true | false

当为 `true` 时，会转发所有 HTTP 请求，而非只是代理请求。若配置不当，开启此选项会导致死循环。

> `userLevel`: number

用户等级，所有连接使用这一等级。

### AccountObject

```json
{
    "user": "my-username",
    "pass": "my-password"
}
```

> `user`: string

用户名，字符串类型。必填。

> `pass`: string

密码，字符串类型。必填。

:::tip
在 Linux 中使用以下环境变量即可在当前 session 使用全局 HTTP 代理（很多软件都支持这一设置，也有不支持的）。

* `export http_proxy=http://127.0.0.1:8080/` (地址须改成你配置的 HTTP 入站代理地址)
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
应该注意，虽然 `http outbound` 可以作为对外访问的配置，但 `http proxy` 协议没有对传输加密，不适宜经公网中传输，且因不支持 udp 传输将会导致 core 功能受限（Routing 过程的的 DNS 查询不可用）。`http outbound` 更有意义的用法是在特殊情况下，只能使用 `http proxy` 对外访问内部网络中，作为为其他协议连接代理服务器的前置代理使用（见 `OutboundObject` 的 `ProxySettingsObject`）。另因 `http proxy` 只能代理 tcp 协议，udp 系的协议均不能通过。
:::

(V2Ray 4.21.1+)

:::tip
4.20.0 版本中引入了 http outbound 作为其他协议的前置代理用法中，缺乏了对 TLS 配置的支持。4.21.1 的补丁版本中对 `streamSettings` 中的 `security` 和 `tlsSettings` 保留生效。目前前置代理的用法中，vmess/tcp、vmess/tcp-tls 和 shadowsocks 等三种协议方式可使用，其他传输协议的前置代理用法需后续版本开发支持。
:::

> `servers`: 数组

HTTP 代理服务器配置，若配置多个，循环使用 (RoundRobin)。

> `address`: string

HTTP 代理服务器地址，必填。

> `port`: int

HTTP 代理服务器端口，必填。

> `user`: \[[AccountObject](#accountobject)\]

一个数组，数组中每个元素为一个用户帐号。默认值为空。
