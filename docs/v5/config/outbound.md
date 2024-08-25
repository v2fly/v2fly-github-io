# Outbounds
outbound

出站连接用于向远程网站或下一级代理服务器发送数据，可用的协议请见协议列表。

```json
{
  "protocol": "vmess",
  "settings": {},
  "sendThrough": "1.2.3.4",
  "tag": "demo",
  "streamSettings": {},
  "proxySettings": {},
  "mux": {
    "enabled": false,
    "concurrency": 8
  }
}
```

> `protocol`: name of `<outbound>`

出站协议名称。

> `settings`: settings of `<outbound>`

出站协议设置。

> `sendThrough`: string

用于发送数据的 IP 地址，当主机有多个 IP 地址时有效，默认值为 `"0.0.0.0"`。

> `tag`: string

此出站连接的标识，用于在其它的配置中定位此连接。当其值不为空时，必须在所有 tag 中唯一。

> `streamSettings`: [StreamObject](stream.md)

底层传输配置。

> `proxySettings`: [ProxyObject](#proxyobject)

出站代理配置。当出站代理生效时。

> `mux`: [MuxObject](#muxobject)

Mux 配置。


> `domainStrategy`: [ "AsIs" | "UseIP" | "UseIP4" | "UseIP6" | "" ]

控制如何如何处理传出连接中的域名. (v5.12.0+)

- "AsIs" : 让操作系统来解析。
- "UseIP" : 使用内置 dns 解析它，并使用结果中的任意 IP 地址。
- "UseIP4" : 使用内置 dns 解析它，并使用结果中的任意 IPv4 地址。
- "UseIP6" : 使用内置 dns 解析它，并使用结果中的任意 IPv6 地址。

## 支持的代理协议

* [SOCKS](proxy/socks.md)
* [VMess](proxy/vmess.md)
* [VLite](proxy/vlite.md)
* [Shadowsocks](proxy/shadowsocks.md)
* [Shadowsocks2022](proxy/shadowsocks2022.md)
* [Freedom](proxy/freedom.md)
* [Loopback](proxy/loopback.md)
* [Blackhole](proxy/blackhole.md)
* [DNS](proxy/dns.md)
* [Trojan](proxy/trojan.md)
* [VLESS](proxy/vless.md)

## ProxyObject

```json
{
    "tag": "another-outbound-tag",
    "transportLayer": false
}
```

> `tag`: string

当指定另一个出站连接的标识时，此出站连接发出的数据，将被转发至所指定的出站连接发出。

> `transportLayer`: true | false

是否启用传输层转发支持。在启用后,此出站连接的传输层协议将保持生效（如果传输层协议支持）。

如果不启用此选项, 在转发时传输层协议将失效，只能使用默认的 TCP 传输协议。

## MuxObject

Mux 功能实现了在一条 TCP 连接上分发多条 TCP 连接的数据。协议细节详见 [Mux.Cool](../../developer/protocols/muxcool.md)。

```json
{
    "enabled": false,
    "concurrency": 8
}
```

> `enabled`: true | false

是否启用 Mux，默认值为 `false`。

> `concurrency`: number

最大并发连接数。最小值 `1`，最大值 `1024`，默认值 `8`。

如果填负数，如 `-1`，则不加载 Mux 模块。

此数值表示了一个 TCP 连接上最多承载的 Mux 连接数量。当客户端发出了 8 个 TCP 请求，而 `concurrency=8` 时，V2Ray 只会发出一条实际的连接，客户端的 8 个请求全部由这条连接传输。
