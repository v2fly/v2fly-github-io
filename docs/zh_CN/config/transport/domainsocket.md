# DomainSocket

:::warning
v4.32.0+，推荐写到 [入站](../../config/inbounds.md) 的 `listen` 处，传输方式可选 TCP、WebSocket、HTTP/2，未来这里的 DomainSocket 可能会被弃用。
:::

Domain Socket 使用标准的 Unix domain socket 来传输数据。它的优势是使用了操作系统内建的传输通道，而不会占用网络缓存。相比起本地环回网络（local loopback）来说，Domain socket 速度略快一些。

目前仅可用于支持 Unix domain socket 的平台，如 Linux 和 macOS。在 Windows 10 Build 17036 前不可用。

如果指定了 domain socket 作为传输方式，在入站出站代理中配置的端口和 IP 地址将会失效，所有的传输由 domain socket 取代。

## DomainSocketObject

`DomainSocketObject` 对应传输配置的 `dsSettings` 项。

```json
{
    "path": "/path/to/ds/file",
    "abstract": false,
    "padding": false
}
```

> `path`: string

一个合法的文件路径。在运行 V2Ray 之前，这个文件必须不存在。

> `abstract`: true | false

是否为 abstract domain socket，默认 `false`。

> `padding`: true | false

v4.28.1+，abstract domain socket 是否带 padding，默认 `false`。
