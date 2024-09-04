# Inbounds

入站连接用于接收从客户端（浏览器或上一级代理服务器）发来的数据，可用的协议请见协议列表。

## InboundObject

`InboundObject` 对应配置文件中 `inbounds` 项的一个子元素。

```json
{
    "listen": "127.0.0.1",
    "port": 1080,
    "protocol": "协议名称",
    "settings": {},
    "streamSettings": {},
    "tag": "标识",
    "sniffing": {
        "enabled": true,
        "destOverride": [
            "http",
            "tls"
        ],
        "metadataOnly": false
    },
    "allocate": {
        "strategy": "always",
        "refresh": 5,
        "concurrency": 3
    }
}
```

> `listen`: address

监听地址，只允许 IP 地址，默认值为 `"0.0.0.0"`，表示接收所有网卡上的连接。除此之外，必须指定一个现有网卡的地址。

v4.32.0+，支持填写 Unix domain socket，格式为绝对路径，形如 `"/dev/shm/domain.socket"`，可在开头加 `"@"` 代表 [abstract](https://www.man7.org/linux/man-pages/man7/unix.7.html)，`"@@"` 则代表带 padding 的 abstract。

填写 Unix domain socket 时，`port` 和 `allocate` 将被忽略，协议暂时可选 VLESS、VMess、Trojan，传输方式可选 TCP、WebSocket、HTTP/2。

> `port`: number | "env:variable" | string

端口。接受的格式如下:

* 整型数值：实际的端口号。
* 环境变量：以 `"env:"` 开头，后面是一个环境变量的名称，如 `"env:PORT"`。V2Ray 会以字符串形式解析这个环境变量。
* 字符串：可以是一个数值类型的字符串，如 `"1234"`；或者一个数值范围，如 `"5-10"` 表示端口 5 到端口 10，这 6 个端口。

当只有一个端口时，V2Ray 会在此端口监听入站连接。当指定了一个端口范围时，取决于 `allocate` 设置。

> `protocol`: string

连接协议名称，可选的值见协议列表。

> `settings`: InboundConfigurationObject

具体的配置内容，视协议不同而不同。详见每个协议中的 `InboundConfigurationObject`。

> `streamSettings`: [StreamSettingsObject](transport.md#streamsettingsobject)

[底层传输配置](transport.md#streamsettingsobject)

> `tag`: string

此入站连接的标识，用于在其它的配置中定位此连接。当其不为空时，其值必须在所有 `tag` 中唯一。

> `sniffing`: [SniffingObject](#sniffingobject)

尝试探测流量的类型

> `allocate`: [AllocateObject](#allocateobject)

端口分配设置

## SniffingObject

```json
{
    "enabled": true,
    "destOverride": [
        "http",
        "tls"
    ],
    "metadataOnly": false
}
```

> `enabled`: true | false

是否开启流量探测。

> `destOverride`: \["http" | "tls" | "quic" | "fakedns" | "fakedns+others"\]

当流量为指定类型时，按其中包括的目标地址重置当前连接的目标。

`fakedns+others` 选项会优先进行 FakeDNS 虚拟 DNS 服务器匹配。如果 IP 地址处于虚拟 DNS 服务器的 IP 地址区间内，但是没有找到相应的域名记录时，使用 `http`、`tls` 和 `quic` 的匹配结果。此选项仅在 `metadataOnly` 为 `false` 时有效。(v4.38.0+)

> `metadataOnly`: true | false

是否仅使用元数据推断目标地址而不截取流量内容。只有元数据流量目标侦测模块会被激活。

如果关闭仅使用元数据推断目标地址，客户端必须先发送数据，代理服务器才会实际建立连接。此行为与需要服务器首先发起第一个消息的协议如 SMTP 协议不兼容。

:::tip
[虚拟 DNS 服务器](fakedns.md) 是一个元数据流量目标地址侦测模块。其他流量探测模块需要关闭 metadataOnly 才能被激活。
:::

## AllocateObject

```json
{
    "strategy": "always",
    "refresh": 5,
    "concurrency": 3
}
```

> `strategy`: "always" | "random"

端口分配策略。`"always"` 表示总是分配所有已指定的端口，`port` 中指定了多少个端口，V2Ray 就会监听这些端口。`"random"` 表示随机开放端口，每隔 `refresh` 分钟在 `port` 范围中随机选取 `concurrency` 个端口来监听。

> `refresh`: number

随机端口刷新间隔，单位为分钟。最小值为 `2`，建议值为 `5`。这个属性仅当 `strategy = random` 时有效。

> `concurrency`: number

随机端口数量。最小值为 `1`，最大值为 `port` 范围的三分之一。建议值为 `3`。
