# VLite

VLite 是一个数据包 加速，保护，稳定，转发 协议。

它为基于 UDP 的流量而设计，并有针对对等式网络 （P2P） 的应用优化。其不支持转发基于TCP的流量。

:::tip
使用路由功能仅将 UDP Packet Addr 流量转发至 VLite。下方是示例配置：
```
"router": {
    "domainStrategy": "AsIs",
    "rule": [
      {
        "tag": "vlite",
        "domain": [
          {
            "type":"RootDomain",
            "value": "packet-addr.v2fly.arpa"
          }
        ]
      }
    ]
  }
```
:::

## VLite UDP 出站协议
* 名称: `vliteu`
* 类型: 出站协议
* 标识符: `outbound.vliteu`

> `address`: string

服务器地址，支持 IP 地址或者域名。

> `port`: number

服务器端口号。

> `password`: string

服务器认可的密码。 此项必须与服务器端一致。

> `scramblePacket`: true | false

是否启用数据包混淆。 此项必须与服务器端一致。

启用后将隐藏数据包的 DTLS 特征，使握手后的数据包内容类似随机数据。

> `enableFec`: true | false

是否启用前向错误修复 此项必须与服务器端一致。

启用后将耗费更多流量以对抗丢包。

> `enableStabilization`: true | false

是否启用通用连接稳定机制。 此项必须与服务器端一致。

启用后将通过连接转世机制在连接中断后自动重连并恢复连接状态以主动稳定连接。

> `enableRenegotiation`: true | false

是否启用通用连接稳定重协议协商机制。 此项必须与服务器端一致。

启用后将尝试重新协商协议以提高稳定性。

> `handshakeMaskingPaddingSize`: number

是否混淆通用连接稳定握手消息。 此项建议与服务器端一致。

此处填入握手数据包填充至的长度。

## VLite UDP 入站协议
* 名称: `vliteu`
* 类型: 入站协议
* 标识符: `inbound.vliteu`


> `password`: string

服务器所认可的密码。 此项必须与客户端一致。

> `scramblePacket`: true | false

是否启用数据包混淆。 此项必须与客户端一致。

启用后将隐藏数据包的 DTLS 特征，使握手后的数据包内容类似随机数据。

> `enableFec`: true | false

是否启用前向错误修复 此项必须与客户端一致。

启用后将耗费更多流量以对抗丢包。

> `enableStabilization`: true | false

是否启用通用连接稳定机制。 此项必须与客户端一致。

启用后将通过连接转世机制在连接中断后自动重连并恢复连接状态以主动稳定连接。

> `enableRenegotiation`: true | false

是否启用通用连接稳定重协议协商机制。 此项必须与客户端一致。

启用后将尝试重新协商协议以提高稳定性。

> `handshakeMaskingPaddingSize`: number

是否混淆通用连接稳定握手消息。 此项必须与客户端一致。

此处填入握手数据包填充至的长度。
