# VLESS

- 名称：`vless`
- 类型：入站 / 出站

:::tip
目前 VLESS 没有自带加密，请用于可靠信道，如 TLS。目前 VLESS 不支持分享。
:::
:::warning 
VLESS 已被弃用并且可能被移除。

请考虑使用 Trojan 作为替代品。 
:::

VLESS 是一个无状态的轻量传输协议，它分为入站和出站两部分，可以作为 V2Ray 客户端和服务器之间的桥梁。

与 [VMess](vmess.md) 不同，VLESS 不依赖于系统时间，认证方式同样为 UUID，但不需要 alterId。

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

> `vnext`: \[ [ServerObject](#serverobject) \]

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

> `id`: string

VLESS 的用户 ID，必须是一个合法的 UUID，你可以用 [在线工具](../../awesome/tools.md#%E5%9C%A8%E7%BA%BF%E5%B7%A5%E5%85%B7) 生成它。

> `encryption`: "none"

现阶段需要填 `"none"`，不能留空。该要求是为了提醒使用者没有加密，也为了以后出加密方式时，防止使用者填错属性名或填错位置导致裸奔。

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
    "fallbacks": [
        {
            "dest": 80
        }
    ]
}
```

> `clients`: \[ [ClientObject](#clientobject) \]

一组服务端认可的用户。

> `decryption`: "none"

注意这里是 decryption，和 clients 同级。现阶段同样需要填 `"none"`，不能留空。decryption 和 encryption 的位置不同，是因为若套一层约定加密，服务端需要先解密才能知道是哪个用户。

若未正确设置 decryption 的值，使用 v2ray 或 -test 时会收到错误信息。

> `fallbacks`: \[ [FallbackObject](#fallbackobject) \]

一个数组，包含一系列强大的回落分流配置（可选）。

### ClientObject

```json
{
    "id": "27848739-7e62-4138-9fd3-098a63964b6b",
    "level": 0,
    "email": "love@v2fly.org"
}
```

> `id`: string

VLESS 的用户 ID，必须是一个合法的 UUID，你也可以用 [V2Ctl](../../guide/command.md#v2ctl) 生成它。

> `level`: number

用户等级，详见 [本地策略](../policy.md)。

> `email`: string

用户邮箱，用于区分不同用户的流量（日志、统计）。

## FallbackObject

协议回落

```json
{
    "alpn": "",
    "path": "",
    "dest": 80,
    "xver": 0
}
```

**`fallbacks` 是一个数组（v4.27.2+），这里是其中一个子元素的配置说明，参数不同于以前的 fallback 项。**

`fallbacks` 项是可选的，只能用于 TCP+TLS 传输组合

- 该项有子元素时，[Inbound TLS](../../config/transport.md#tlsobject) 需设置 `"alpn":["http/1.1"]`。**

通常，你需要先设置一组 `alpn` 和 `path` 均省略或为空的默认回落，然后再按需配置其它分流。

VLESS 会把 TLS 解密后首包长度 < 18 或协议版本无效、身份认证失败的流量转发到 `dest` 指定的地址。

其它传输组合必须删掉 `fallbacks` 项或所有子元素，此时也不会开启 Fallback，VLESS 会等待读够所需长度，协议版本无效或身份认证失败时，将直接断开连接。

> `alpn`: string

尝试匹配 TLS ALPN 协商结果，空为任意，默认为 ""

有需要时，VLESS 才会尝试读取 TLS ALPN 协商结果，若成功，输出 info `realAlpn =` 到日志。

用途：解决了 Nginx 的 h2c 服务不能同时兼容 http/1.1 的问题，Nginx 需要写两行 listen，分别用于 1.1 和 h2c。

注意：fallbacks alpn 存在 `"h2"` 时，[Inbound TLS](../../config/transport.md#tlsobject) 需设置 `"alpn":["h2","http/1.1"]`，以支持 h2 访问。

:::tip
Fallback 内设置的 "alpn" 是匹配实际协商出的 ALPN，而 Inbound TLS 设置的 "alpn" 是握手时可选的 ALPN 列表，两者含义不同。
:::

> `path`: string

尝试匹配首包 HTTP PATH，空为任意，默认为空，非空则必须以 `"/"` 开头，不支持 h2c。

智能：有需要时，VLESS 才会尝试看一眼 PATH（不超过 55 个字节；最快算法，并不完整解析 HTTP），若成功，输出 info `realPath =` 到日志。

用途：分流其它 inbound 的 WebSocket 流量或 HTTP 伪装流量，没有多余处理、纯粹转发流量，[实测比 Nginx 反代更强](https://github.com/badO1a5A90/v2ray-doc/blob/master/v2ray%20speed%20test%20v4.27.2.md)。

注意：**fallbacks 所在入站本身必须是 TCP+TLS**，这是分流至其它 WS 入站用的，被分流的入站则无需配置 TLS。

> `dest`: string | number

决定 TLS 解密后 TCP 流量的去向，目前支持两类地址：（该项必填，否则无法启动）

1. TCP，格式为 `"addr:port"`，其中 addr 支持 IPv4、域名、IPv6，若填写域名，也将直接发起 TCP 连接（而不走内置的 DNS）。
2. Unix domain socket，格式为绝对路径，形如 `"/dev/shm/domain.socket"`，可在开头加 `"@"` 代表 [abstract](https://www.man7.org/linux/man-pages/man7/unix.7.html)，`"@@"` 则代表带 padding 的 abstract。

若只填 port，数字或字符串均可，形如 `80`、`"80"`，通常指向一个明文 http 服务（addr 会被补为 `"127.0.0.1"`）。

> `xver`: number

发送 [PROXY protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt)，专用于传递请求的真实来源 IP 和端口，填版本 1 或 2，默认为 0，即不发送。若有需要建议填 1。

目前填 1 或 2，功能完全相同，只是结构不同，且前者可打印，后者为二进制。V2Ray 的 TCP 和 WS 入站均已支持接收 PROXY protocol。

:::tip
若你正在 [配置 Nginx 接收 PROXY protocol](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#configuring-nginx-to-accept-the-proxy-protocol)，除了设置 proxy_protocol 外，还需设置 set_real_ip_from，否则可能会出问题。
:::

**补充说明**

1. 将匹配到最精确的子元素，与子元素的排列顺序无关。若配置了几个 alpn 和 path 均相同的子元素，则会以最后的为准。
2. 回落分流均是解密后 TCP 层的转发，而不是 HTTP 层，只在必要时检查首包 PATH。
3. 不支持按域名分流。若有此需求，建议前置 Nginx 等并配置 stream SNI 分流。
