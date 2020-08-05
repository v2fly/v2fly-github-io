---
refcn: config/protocols/vless
refen: en/config/protocols/vless
---

# VLESS

- 名称：`vless`
- 类型：入站 / 出站

**当前版本：VLESS PREVIEW 1.3（v2ray-core v4.27.0+）**

:::warning
VLESS 处于公测阶段，测试阶段请确保客户端与服务端的 v2ray-core 均为最新版本。</br>
VLESS 的内测仓库为 [rprx/v2ray-vless](https://github.com/rprx/v2ray-vless)，其中 PREVIEW 系列的新版本会在发布一段时间后并入 [v2fly/v2ray-core](https://github.com/v2fly/v2ray-core)。
:::

VLESS 是一个无状态的轻量传输协议，它分为入站和出站两部分，可以作为 V2Ray 客户端和服务器之间的桥梁。

VLESS 不依赖于系统时间，认证方式同样为 UUID，但不需要 alterId。

VLESS 的配置分为两部分，`InboundConfigurationObject` 和 `OutboundConfigurationObject`，分别对应入站和出站协议配置中的 `settings` 项。

## OutboundConfigurationObject

```json
{
    "vnext": [
        {
            "address": "example.com",
            "port": 443,
            "users": [
                {
                    "id": "27848739-7e62-4138-9fd3-098a63964b6b",
                    "encryption": "none",
                    "level": 0
                }
            ]
        }
    ]
}
```

> `vnext`：\[ [ServerObject](#serverobject) \]

一个数组，包含一系列指向服务端的配置。

### ServerObject

```json
{
    "address": "example.com",
    "port": 443,
    "users": []
}
```

> `address`: address

地址，指向服务端，支持域名、IPv4、IPv6。

> `port`: number

端口，通常与服务端监听的端口相同。

> `users`: \[ [UserObject](#userobject) \]

一组服务端认可的用户。

### UserObject

```json
{
    "id": "27848739-7e62-4138-9fd3-098a63964b6b",
    "encryption": "none",
    "level": 0
}
```

> `id`：string

VLESS 的用户 ID，必须是一个合法的 UUID，你可以用 [在线工具](https://www.v2fly.org/awesome/tools.html#%E5%9C%A8%E7%BA%BF%E5%B7%A5%E5%85%B7) 生成它。

> `encryption`："none"

现阶段需要填 `"none"`，不能留空。该要求是为了提醒使用者没有加密，也为了以后出加密方式时，防止使用者填错属性名或填错位置导致裸奔。</br>
若未正确设置 encryption 的值，使用 v2ray 或 -test 时会收到错误信息。

> `level`: number

用户等级，详见 [本地策略](../policy.md)。

## InboundConfigurationObject

```json
{
    "clients": [
        {
            "id": "27848739-7e62-4138-9fd3-098a63964b6b",
            "level": 0,
            "email": "love@v2fly.org"
        }
    ],
    "decryption": "none",
    "fallback": {},
    "fallback_h2": {}
}
```

> `clients`: \[ [ClientObject](#clientobject) \]

一组服务端认可的用户。

> `decryption`："none"

注意这里是 decryption，和 clients 同级。现阶段同样需要填 `"none"`，不能留空。decryption 和 encryption 的位置不同，是因为若套一层约定加密，服务端需要先解密才能知道是哪个用户。</br>
若未正确设置 decryption 的值，使用 v2ray 或 -test 时会收到错误信息。

> `fallback`：\[ [FallbackObject](#fallbackobject) \]

可选 & 强烈建议使用：基于首包长度分流（VLESS 原创）的新型协议回落模式，相对于其它协议回落方案，更简洁、高效、安全，功能也更强大。

### ClientObject

```json
{
    "id": "27848739-7e62-4138-9fd3-098a63964b6b",
    "level": 0,
    "email": "love@v2fly.org"
}
```

> `id`: string

VLESS 的用户 ID，必须是一个合法的 UUID，你也可以用 [v2ctl](https://www.v2fly.org/guide/command.html#v2ctl) 生成它。

> `level`: number

用户等级，详见 [本地策略](../policy.md)。

> `email`: string

用户邮箱，用于区分不同用户的流量（日志、统计）。

## FallbackObject

**强烈建议使用：基于首包长度分流（VLESS 原创）的新型协议回落模式，相对于其它协议回落方案，更简洁、高效、安全，功能也更强大。**

```json
{
    "addr": "127.0.0.1",
    "port": 80,
    "unix": "/dev/shm/domain.socket",
    "xver": 0
}
```

**`fallback`** 项是可选的，通常用于 TCP+TLS 传输组合。**该项存在时，[inbound TLS](https://www.v2fly.org/config/transport.html#tlsobject) 需设置 `"alpn":["http/1.1"]`。**</br>
VLESS 会把首包长度 < 18，或协议版本无效或身份认证失败的流量转发到该项指定的地址。</br>
其它传输组合不建议填写该项，此时也不会开启协议回落模式，VLESS 会等待读够所需长度，协议版本无效或身份认证失败时，将直接断开连接。

**`fallback_h2`** 项也是可选的，和前者的参数完全相同。**该项存在时，[inbound TLS](https://www.v2fly.org/config/transport.html#tlsobject) 需设置 `"alpn":["h2","http/1.1"]`。**</br>
VLESS 若发现连接是 TLS 且 ALPN 协商结果为 h2，回落时会把流量转发到该项指定的地址。</br>
这个设定解决了 Nginx 的 h2c 服务不能同时兼容 http/1.1 的问题，也就是说此时 Nginx 需要开两个 http 服务，一个 1.1，一个 2。

> `addr`: string

地址，支持域名、IPv4、IPv6，默认值为 `127.0.0.1`。若填写域名，将直接发起连接（而不走内置的 DNS）。

> `port`: number

端口，通常为一个明文 http 服务，无默认值。fallback 项存在且未填写 unix 时，该值必填，否则无法启动。

> `unix`: string

UNIX domain socket，绝对路径，可在开头加 @ 代表 [abstract](https://www.man7.org/linux/man-pages/man7/unix.7.html)，默认为空。若填写了该值，addr 和 port 将被忽略。

> `xver`: number

[PROXY protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt)，专用于传递请求的真实来源 IP 和端口，填版本 1 或 2，默认为 0，即不启用。</br>
目前填 1 或 2，功能完全相同，只是结构不同，且前者可打印，后者为二进制。1 的开销小一些，若有需要建议填 1。

:::tip
若你正在 [配置 Nginx 接收 PROXY protocol](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#configuring-nginx-to-accept-the-proxy-protocol)，除了设置 proxy_protocol 外，还需设置 set_real_ip_from，否则可能会出问题。
:::

## 一些说明

待补充

## 新型协议回落模式解析

待补充

## 客户端指引

待补充

## VLESS 分享链接标准

待补充
