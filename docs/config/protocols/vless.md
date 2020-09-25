# VLESS

- 名称：`vless`
- 类型：入站 / 出站

**当前版本：VLESS PREVIEW 2（v2ray-core v4.29.0+）**

**终极配置：[VLESS over TCP with XTLS + 回落 & 分流 to WHATEVER](<https://github.com/v2fly/v2ray-examples/tree/master/VLESS-TCP-XTLS-WHATEVER>)**

:::warning
目前 VLESS 没有自带加密，请用于可靠信道，如 TLS。目前 VLESS 不支持分享。</br>
VLESS 处于公测阶段，测试期间请确保客户端与服务端的 v2ray-core 均为最新版本。</br>
VLESS 的内测仓库为 [rprx/v2ray-vless](https://github.com/rprx/v2ray-vless)，其中 PREVIEW 系列的新版本会在发布一段时间后并入 [v2fly/v2ray-core](https://github.com/v2fly/v2ray-core)。
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
                    "flow": "",
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
    "flow": "",
    "encryption": "none",
    "level": 0
}
```

> `id`: string

VLESS 的用户 ID，必须是一个合法的 UUID，你可以用 [在线工具](../../awesome/tools.md#%E5%9C%A8%E7%BA%BF%E5%B7%A5%E5%85%B7) 生成它。

> `flow`: string

v4.29.0+，流控，目前仅用于选择 [XTLS](#xtls-黑科技) 的算法。

> `encryption`: "none"

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
            "flow": "",
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

注意这里是 decryption，和 clients 同级。现阶段同样需要填 `"none"`，不能留空。decryption 和 encryption 的位置不同，是因为若套一层约定加密，服务端需要先解密才能知道是哪个用户。</br>
若未正确设置 decryption 的值，使用 v2ray 或 -test 时会收到错误信息。

> `fallbacks`: \[ [FallbackObject](#fallbackobject) \]

一个数组，包含一系列强大的回落分流配置（可选）。

### ClientObject

```json
{
    "id": "27848739-7e62-4138-9fd3-098a63964b6b",
    "flow": "",
    "level": 0,
    "email": "love@v2fly.org"
}
```

> `id`: string

VLESS 的用户 ID，必须是一个合法的 UUID，你也可以用 [V2Ctl](../../guide/command.md#v2ctl) 生成它。

> `flow`: string

v4.29.0+，流控，目前仅用于选择 [XTLS](#xtls-黑科技) 的算法。

> `level`: number

用户等级，详见 [本地策略](../policy.md)。

> `email`: string

用户邮箱，用于区分不同用户的流量（日志、统计）。

## FallbackObject

**强烈建议使用：基于首包长度分流（VLESS 原创）的新型协议回落模式，相较于其它协议回落方案，更简洁、高效、安全，功能也更强大。**

```json
{
    "alpn": "",
    "path": "",
    "dest": 80,
    "xver": 0
}
```

**`fallbacks` 是一个数组（v4.27.2+），这里是其中一个子元素的配置说明，参数不同于以前的 fallback 项。**

`fallbacks` 项是可选的，只能用于 TCP+TLS 传输组合。**该项有子元素时，[inbound TLS](../../config/transport.md#tlsobject) 需设置 `"alpn":["http/1.1"]`。**</br>
通常，你需要先设置一组 `alpn` 和 `path` 均省略或为空的默认回落，然后再按需配置其它分流。</br>
VLESS 会把 TLS **解密后** 首包长度 < 18 或协议版本无效、身份认证失败的流量转发到 `dest` 指定的地址。</br>

其它传输组合必须删掉 `fallbacks` 项或所有子元素，此时也不会开启协议回落模式，VLESS 会等待读够所需长度，协议版本无效或身份认证失败时，将直接断开连接。

> `alpn`: string

（新手先忽略）尝试匹配 TLS ALPN **协商结果**，空为任意，默认为空。**建议只按需用两种填法：省略、填 `"h2"`。**

智能：有需要时，VLESS 才会尝试读取 TLS ALPN 协商结果，若成功，输出 info `realAlpn =` 到日志。</br>
用途：解决了 Nginx 的 h2c 服务不能同时兼容 http/1.1 的问题，Nginx 需要写两行 listen，分别用于 1.1 和 h2c。</br>
注意：fallbacks alpn 存在 `"h2"` 时，[inbound TLS](../../config/transport.md#tlsobject) 需设置 `"alpn":["h2","http/1.1"]`，以支持 h2 访问。

:::tip
VLESS fallbacks 设置的 "alpn" 是匹配实际协商出的 ALPN，而 inbound TLS 设置的 "alpn" 是握手时可选的 ALPN 列表，两者含义不同。
:::

> `path`: string

（新手先忽略）尝试匹配 **首包中的** HTTP PATH，空为任意，默认为空。**非空则必须以 `"/"` 开头，不支持 h2c。**

智能：有需要时，VLESS 才会尝试看一眼 PATH（最快算法，并不完整解析 HTTP），若成功，输出 info `realPath =` 到日志。</br>
用途：分流其它 inbound 的 WebSocket 流量或 HTTP 伪装流量，没有多余处理、纯粹转发流量，[实测比 Nginx 反代更强](https://github.com/badO1a5A90/v2ray-doc/blob/master/v2ray%20speed%20test%20v4.27.2.md)。</br>
注意：**千万注意 fallbacks 所在入站本身必须是 TCP+TLS**，这是分流至其它 WS 入站用的，被分流的入站则无需配置 TLS 了。

> `dest`: string | number

决定 TLS **解密后** 流量的去向，目前支持两类地址：（该项必填，否则无法启动）

1. TCP，格式为 `"addr:port"`，其中 addr 支持域名、IPv4、IPv6，若填写域名，将直接发起连接（而不走内置的 DNS）。
2. Unix domain socket，格式为绝对路径，形如 `"/dev/shm/domain.socket"`，可在开头加 `"@"` 代表 [abstract](https://www.man7.org/linux/man-pages/man7/unix.7.html)。

若只填 port，数字或字符串均可，形如 `80`、`"80"`，通常指向一个明文 http 服务（addr 会被补为 `"127.0.0.1"`）。

> `xver`: number

（新手先忽略）发送 [PROXY protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt)，专用于传递请求的真实来源 IP 和端口，填版本 1 或 2，默认为 0，即不发送。若有需要建议填 1。

目前填 1 或 2，功能完全相同，只是结构不同，且前者可打印，后者为二进制。V2Ray 的 TCP 和 WS 入站均已支持接收 PROXY protocol。

:::tip
若你正在 [配置 Nginx 接收 PROXY protocol](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#configuring-nginx-to-accept-the-proxy-protocol)，除了设置 proxy_protocol 外，还需设置 set_real_ip_from，否则可能会出问题。
:::

fallbacks 的匹配会选择最精确的那个，与子元素的排列顺序无关。若配置了几个 alpn 和 path 均相同的子元素，则会以最后的为准。

## XTLS 黑科技

[rprx/v2ray-vless/releases](https://github.com/rprx/v2ray-vless/releases) 有关于 [XTLS Project](https://github.com/XTLS/Go) 原理的一些介绍。

经实测，XTLS 在低性能或没有 AES 硬解的设备上效果出众，如在硬路由上换用 XTLS，同样跑满 CPU 时实现网速 **翻倍**，或是相同网速时 CPU 占用率减半，树莓派上也有明显提升。</br>
但对于性能充足的设备，XTLS 带来的提升似乎并不明显，更具体的仍有待测试。而对于移动设备，计算量减少意味着省电。XTLS 以后还会推出其它的算法，进一步减少计算量。

**配置方法**

1. 确认服务端与客户端的 v2ray-core 均为 v4.29.0+，并已配置 VLESS over TCP with TLS + 回落 & 可选分流，或者直接参考 [终极配置](https://github.com/v2fly/v2ray-examples/tree/master/VLESS-TCP-XTLS-WHATEVER)。
2. 将服务端与客户端 VLESS streamSettings 的 `tls`、`tlsSettings` 改为 `xtls`、`xtlsSettings`（服务端 XTLS 可以接收普通 TLS 请求，也不影响回落分流）。
3. 服务端与客户端的 VLESS flow 均填写 `xtls-rprx-origin` 即可，服务端的代表允许，客户端的代表使用（该用户仍可不填 flow、用普通 TLS 连上服务端）。

**注意事项**

1. 为了防止上层应用使用 QUIC，启用 XTLS 时客户端 VLESS 会自动拦截 UDP/443 的请求。若不需拦截，请在客户端填写 `xtls-rprx-origin-udp443`，服务端不变。
2. 可设置环境变量 `V2RAY_VLESS_XTLS_SHOW = true` 以显示 XTLS 的输出，适用于服务端与客户端（仅用于确信 XTLS 生效了，千万别设成永久性的，不然会很卡）。
3. 不能开启 Mux。XTLS 需要获得原始的数据流，所以原理上也不会支持 WebSocket、不适用于 VMess。

根据使用多台服务器进行 [测试](https://github.com/badO1a5A90/v2ray-doc/tree/master/speed%20test) 的结果，XTLS 现在的算法仍有很大提升空间，也会继续优化（主要是接收方行为）。

## 一些说明

[v2ray-examples](https://github.com/v2fly/v2ray-examples) 有完整的 VLESS 配置示例供参考。（但目前不能保证其它协议的配置示例质量）

VLESS 和 VMess 的日志策略不同，遇到了异常情况，前者通常是 Warning，后者通常是 Info。

待补充

## 新型协议回落模式解析

待补充

## 客户端指引

1. VLESS 协议本身还会有不兼容升级，但客户端配置文件参数基本上是只增不减的。**所以如果你开发了用 core 的客户端，现在就可以适配。** iOS 客户端的协议实现则需紧跟升级。
2. **视觉标准：UI 标识请统一用 VLESS**，而不是 VLess / Vless / vless，配置文件不受影响，代码内则顺其自然。
3. `encryption` 应做成输入框而不是选择框，新配置的默认值应为 `none`，若用户置空则应代填 `none`。`flow` 也应做成输入框，新配置的默认值应为空。

**以下为已支持图形化配置 VLESS 的部分客户端列表，推荐使用：**（按实现时间先后顺序排列）

- [Qv2ray](https://github.com/Qv2ray/Qv2ray)（v2.6.3+），支持 Linux、macOS、Windows
- [v2rayN](https://github.com/2dust/v2rayN)（v3.21+），支持 Windows
- [v2rayNG](https://github.com/2dust/v2rayNG)（v1.3.0+），支持 Android
- [PassWall](https://github.com/xiaorouji/openwrt-package)（v3.9.35+），支持 OpenWrt
- [v2rayA](https://github.com/mzz2017/v2rayA)（v1.0.0+），支持 Linux

## VLESS 分享链接标准

v2ray-core v4.28.0 会增强 TLS，~~VLESS 的分享链接标准也会同时出炉~~。为了避免生态混乱，在此之前请勿支持分享，更勿自创分享链接方案。

更新：经过综合考虑，VLESS 应于正式版再出分享链接标准（不是近期）。
