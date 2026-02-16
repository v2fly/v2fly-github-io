# Freedom

## Freedom 出站

outbound.freedom

Freedom 是一个出站协议，可以用来向任意网络发送（正常的）TCP 或 UDP 数据。它是 V2Ray 最基本的出站协议，通常用于直接连接目标服务器，而不经过任何代理。

## 配置

```json
{
  "domainStrategy": "AsIs",
  "redirect": "127.0.0.1:1234",
  "userLevel": 0,
  "fragment": {
    "packets": "tlshello",
    "length": "100-200",
    "interval": "10-20"
  }
}
```

> `domainStrategy`: "AsIs" | "UseIP" | "UseIPv4" | "UseIPv6"

域名解析策略。默认值为 `"AsIs"`。

* `"AsIs"`：直接使用域名进行连接，由系统进行 DNS 解析
* `"UseIP"`：使用 V2Ray 内置 DNS 解析域名，使用解析出的任意 IP（v4 或 v6）进行连接
* `"UseIPv4"`：使用 V2Ray 内置 DNS 解析域名，只使用 IPv4 地址进行连接
* `"UseIPv6"`：使用 V2Ray 内置 DNS 解析域名，只使用 IPv6 地址进行连接

:::tip
当目标地址为域名时，Freedom 可以直接向该域名发起连接，或通过 V2Ray 内置 DNS 先解析出 IP 地址再进行连接。
:::

> `redirect`: string

Freedom 会强制将所有数据发送到指定地址（而不是入站协议指定的地址）。

* 格式：`"host:port"`，如 `"127.0.0.1:1234"`
* 其值为一个字符串，可以是一个 IP 地址和端口，也可以是域名和端口
* 当值不为空时，其值会替换所有连接的目标地址

> `userLevel`: number

用户等级。连接会使用这个用户等级对应的本地策略。

* `userLevel` 的值对应 [本地策略](../service/policy.md) 中 `level` 的值
* 如不指定，默认为 0

> `fragment`: [FragmentObject](#fragmentobject)

数据包分片配置，用于对抗某些网络环境下的 DPI（深度包检测）。(v5.3.0+)

## FragmentObject

数据包分片配置可以将 TLS Client Hello 等敏感数据包拆分成多个小包发送，以绕过某些网络限制。

```json
{
  "packets": "tlshello",
  "length": "100-200",
  "interval": "10-20"
}
```

> `packets`: "tlshello" | "1-3"

指定要分片的数据包。

* `"tlshello"`：只对 TLS Client Hello 数据包进行分片
* `"1-3"`：对前 1-3 个数据包进行分片（数字范围格式）

> `length`: string

每个分片的长度范围，格式为 `"min-max"`。

* 例如 `"100-200"` 表示每个分片长度在 100-200 字节之间随机
* 单位：字节
* 建议设置较小的值以达到更好的分片效果

> `interval`: string

分片之间的发送间隔，格式为 `"min-max"`，单位为毫秒。

* 例如 `"10-20"` 表示每个分片之间间隔 10-20 毫秒
* 可以设置为 `"0-0"` 表示无间隔
* 适当的间隔可以让分片更像正常流量

## 使用示例

### 示例 1：直接连接（最简配置）

```json
{
  "protocol": "freedom",
  "tag": "direct",
  "settings": {}
}
```

这是最简单的 Freedom 配置，所有流量将直接连接目标服务器。

### 示例 2：使用内置 DNS 解析

```json
{
  "protocol": "freedom",
  "tag": "direct",
  "settings": {
    "domainStrategy": "UseIPv4"
  }
}
```

使用 V2Ray 内置 DNS 解析域名，只使用 IPv4 地址进行连接。适用于没有 IPv6 网络的环境。

### 示例 3：本地代理转发

```json
{
  "protocol": "freedom",
  "tag": "local-proxy",
  "settings": {
    "redirect": "127.0.0.1:8118"
  }
}
```

将所有流量转发到本地的 8118 端口，可以配合本地 HTTP 代理（如 Privoxy）使用。

### 示例 4：使用分片对抗 DPI

```json
{
  "protocol": "freedom",
  "tag": "direct-fragment",
  "settings": {
    "domainStrategy": "UseIPv4",
    "fragment": {
      "packets": "tlshello",
      "length": "100-200",
      "interval": "10-20"
    }
  }
}
```

对 TLS Client Hello 进行分片，可以在某些有 SNI 阻断的网络环境中使用。

### 示例 5：配合路由规则使用

```json
{
  "routing": {
    "rules": [
      {
        "type": "field",
        "domain": ["geosite:cn"],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "ip": ["geoip:cn", "geoip:private"],
        "outboundTag": "direct"
      }
    ]
  },
  "outbounds": [
    {
      "protocol": "vmess",
      "tag": "proxy"
    },
    {
      "protocol": "freedom",
      "tag": "direct",
      "settings": {
        "domainStrategy": "UseIPv4"
      }
    }
  ]
}
```

国内域名和 IP 直连，其他流量走代理，这是分流配置的经典用法。

## 使用场景

1. **直接连接**：作为最终出站，直接访问目标服务器
2. **国内直连**：配合路由规则，让国内流量直接连接
3. **本地服务转发**：通过 `redirect` 转发到本地其他端口的服务
4. **绕过 DPI**：使用分片功能突破 SNI 阻断等网络限制
5. **IPv4/IPv6 控制**：通过 `domainStrategy` 控制使用哪种 IP 协议

## 注意事项

* Freedom 是最基础的出站协议，本身不提供任何加密或混淆
* 使用 `redirect` 时，所有连接的目标地址都会被替换
* `domainStrategy` 为 `UseIP` 系列时，需要正确配置 V2Ray 的 DNS 设置
* 分片功能会增加延迟，只在必要时使用
* 如果目标服务器不可达，Freedom 连接会失败
