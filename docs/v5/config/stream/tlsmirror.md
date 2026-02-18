# TLSMirror

::: danger
此协议目前尚未发布，仍处于开发者预览阶段。请仅在充分了解其风险的情况下使用。
:::

TLSMirror 是一种外观类似于 TLS 的协议，旨在看起来像端口转发器或 SNI 代理，同时在未修改的转发流量中秘密传输插入消息。（待发布）

::: info
TLSMirror 拥有从源代码生成的机器规范：[TLSMirror Spec](https://gist.github.com/xiaokangwang/622dffd24ec144a11260dd1b8baf7dc0#file-tlsmirror-spec-md)。
:::

## 协议架构

TLSMirror 通过在转发客户端和转发服务器之间维持一个负载连接，同时在该连接中秘密插入加密的有效载荷流量来运行。该架构涉及四个组件：

1. **转发客户端 (Forwarded Client)**：发起连接的外部 TLS 客户端（例如网页浏览器）。
2. **TLSMirror 客户端 (TLSMirror Client)**：接收负载连接并将其转发给 TLSMirror 服务器。
3. **TLSMirror 服务器 (TLSMirror Server)**：接收转发的连接并将其转发给转发服务器。
4. **转发服务器 (Forwarded Server)**：真实的远程目标服务器（例如 target.example.com）。

### 核心设计原则：不修改握手

TLSMirror **不**修改任何 TLS 握手消息。握手记录在不经修改的情况下被转发，这意味着负载连接流量在握手期间与背景流量的 TLS 流量保持完全相同（bit-identical）。这允许任何 TLS 客户端生成负载连接流量而不会留下指纹。

### 基本操作

TLSMirror 客户端和服务器将 TLS 流解析为单独的帧，并插入包含有效载荷流量的额外加密应用数据（application_data）帧。TLSMirror 的两个端点都会尝试解密每个应用数据帧：

- **成功**：该帧包含应用处理程序的有效载荷数据（由 TLSMirror 消耗，不进行转发）。
- **失败**：该帧来自转发客户端/服务器，将作为转发流量透明地传递。

## TLSMirror 设置

* 名称：`tlsmirror`
* 类型：传输协议
* ID：`stream.tlsmirror`


> `primaryKey` : string

主密钥是一个 32 字节、Base64 编码的密钥，用于有效载荷流量的转换。
虽然使用 AES-GCM 加密来转换流量，但除非另有说明，
流量并非安全加密，有效载荷协议必须完成自身的加密以保护流量机密性。

此值在入站和出站中必须相同。

你可以使用以下命令生成此值：
`cat /dev/urandom|head -c 32|base64`

或者

`v2ray engineering generate-random-data -length 32`


> `forwardTag` : string

入站时用于转发到 [被转发 TLS 服务](#被转发-tls-服务) 的出站标签；出站时用于连接到秘密服务器的出站标签。

这通常指向 `freedom` 或直连出站。

> `forwardPort` : number

::: tip
此值仅在入站中使用。
:::

[被转发 TLS 服务](#被转发-tls-服务) 的端口。

> `forwardAddress` : string
::: tip
此值仅在入站中使用。
:::

[被转发 TLS 服务](#被转发-tls-服务) 的网络主机地址。

> `explicitNonceCiphersuites` : [ number ]

在其加密应用数据中使用显式随机数（explicit nonce）的密码套件标识符列表。

此值应采用 10 进制数字编码，尽管其典型符号是 2 个十六进制编码的字节。


**推荐值：**
`[156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 49195, 49196, 49197, 49198, 49199, 49200, 49201, 49202, 49290, 49291, 49293, 49316, 49317, 49318, 49319, 49320, 49321, 49322, 49323, 49324, 49325, 49326, 49327, 52392, 52393, 52394, 52395, 52396, 52397, 52398]`

这些值涵盖了使用显式随机数的 TLS 1.2 密码套件的综合列表（如 AES-GCM 和 AES-CCM）。包含此完整列表可确保 TLSMirror 能够在一系列背景流量的负载连接流量中正确识别并处理应用数据记录，防止连接失败或因记录解析不正确而导致的探测。


此值在入站和出站中必须相同。

::: note
对于 TLS 1.2，TLSMirror 期望初始随机数为 0。这不适用于所有 TLS 实现。建议你自行测试。
:::

::: danger
此 `explicitNonceCiphersuites` 值必须正确配置，否则流量将中断或变得可识别。
:::

> `transportLayerPadding`: [TransportLayerPadding](#传输层填充设置)

传输层填充设置。此功能目前尚未完全实现，如果不需要前向兼容性，请取消设置此字段。

**填充格式：**
- **带数据 (长度 > 4)**: `[application_data][padding][4-byte data_length]`
- **仅长度 (长度 <= 4)**: `[padding_only]`

> `deferInstanceDerivedWriteTime`: [时间规范](#时间规范)
::: tip
此值通常仅对入站有用。
:::

如果响应由 v2ray 实例生成，则在写回数据之前等待的随机时间。

这是为了防止通过测量往返时间来发现模式的计时攻击（timing attack），因为TLSMirror生成的回复通常比代理转发的流量快。

**延迟计算：**
`delay = baseNanoseconds + random(0, uniformRandomMultiplierNanoseconds)`


> `carrierConnectionTag`: string
::: tip
此值仅在出站中使用。
:::

接收负载连接的出站标签。有效载荷流量随后将覆盖在此连接上。

请仅将 [被转发 TLS 服务](#被转发-tls-服务) 愿意处理的流量路由到此出站。

请注意，目前直到与服务器建立第一个客户端连接之前，此出站端口都不存在。

> `embeddedTrafficGenerator`: [流量生成器设置](#流量生成器设置)

按需产生 TLS 流量的嵌入式流量生成器。如果没有外部流量被路由到 `carrierConnectionTag` 出站，则需要此设置。

对于大多数设置，目前建议使用嵌入式流量生成器。

> `connectionEnrolment` : [连接确认设置](#连接确认设置)

此设置控制连接确认系统，以避免基于重定向攻击的探测。

> `sequenceWatermarkingEnabled`: bool

是否启用序列水印，以避免基于插入帧之间 TLS 帧重新排序的探测。

**水印机制：**
- **目的**：通过使帧具有位置依赖性来挫败帧重排序攻击。
- **应用**：对 application_data 和 alert 记录的最后 16 字节应用 XChaCha20 加密。
- **时机**：在第一帧插入消息**之后**启用。第一帧用于初始化水印流。

## 流量生成器设置

> `securitySettings`: special

如果未设置此值，流量生成器将使用 TLSMirror 传输的底层安全设置。

请取消设置此字段，并使用 TLSMirror 传输的安全设置配置流量生成器的 TLS 设置，因为这是一个工程选项。

> `steps`: [ [流量生成器步骤规范](#流量生成器步骤规范) ]

生成流量所采取的步骤。

流量生成通过这些步骤从第 0 步开始，按照类似马尔可夫的过程进行。

## 流量生成器步骤规范

> `host`: string

要发送在 HTTP host 标头中的主机名。

> `path`: string

生成的 HTTP 请求的路径，例如 `/robots.txt`。

> `method`: string

生成的 HTTP 请求的方法名称。

> `headers`: [ [标头](#标头) ]

在 HTTP 请求中发送的标头。

> `nextStep`: [下一步规范](#下一步规范)

此步骤后执行的概率跳转表。

> `connectionReady`: bool

如果设置为 true，一旦完成此步骤，有效载荷流量就可以开始在此负载连接上转发。

> `waitTime`: [时间规范](#时间规范)
在发送下一个请求之前等待的时间。

除非另有说明，流量生成器将始终完成当前的请求。

> `h2DoNotWaitForDownloadFinish`: bool
如果设置为 true 且协商了 HTTP/2 连接，则在等待时间过后，不等待完整下载响应即可移动到下一步。

## 下一步规范

> `weight`: number

此跳转发生可能性的整数权重。

> `gotoLocation`: number

在步骤规范数组中要跳转到的位置。

## 被转发 TLS 服务

被转发 TLS 服务可以是任何 TLS 端点，只要它提供 TLS 1.2 或 TLS 1.3 流量。与嵌入式流量生成器结合使用时，建议使用 HTTPS 站点。

与其他类似协议不同，TLSMirror 可以正确处理 TLS 1.2，
包括带有显式随机数的 AEAD 密码套件（只要它是一个增加的 int64 计数器，
且传输已正确配置这些密码套件的标识符）。

## 时间规范

::: tip
一秒等于 1,000,000,000 纳秒。
:::

最终的等待时间是：

`baseNanoseconds` + `uniformRandomMultiplierNanoseconds` * `uniformRandom`
其中 `uniformRandom` 是服从均匀随机分布的变量 `∈ [0,1)`。

> `baseNanoseconds`: number

> `uniformRandomMultiplierNanoseconds`: number

## 标头

> `key` : string

HTTP 标头键。

> `value` : string

HTTP 标头值。

## 传输层填充设置

> `enabled`: bool

是否启用传输层填充。

此值在入站和出站中必须相同。


## 连接确认设置

> `primaryIngressOutbound` : string

::: tip
此值仅在入站中使用。
:::

主要连接确认入口的出站标签。客户端的主要出口出站应连接至此处。

> `primaryEgressOutbound` : string

::: tip
此值仅在出站中使用。
:::

主要连接确认出口的出站标签。应连接到服务器上的主要连接确认入口。

如果保留为空，则将尝试进行自确认，以在其自身上创建确认连接。必须配置启动连接确认（Bootstrap enrollment）方法。（v5.42.0+，工程评估阶段）

> `bootstrap_egress_config` : [ special ]

主要出口配置数组。工程设置。（v5.42.0+）

> `bootstrap_ingress_config` : [ special ]

主要入口配置数组。工程设置。（v5.42.0+）


> `bootstrapEgressUrl` : [ string ]

::: tip
此值仅在出站中使用。
:::

用于启动出站连接确认的 URL。(v5.46.0+)

你可以使用以下命令将此 URL 与 JSON 格式相互转换：

`v2ray engineering tlsmirror-enrollment-link -mode json|link`

其中模式指定输出格式（JSON 或 link）。它接受标准输入作为输入，并默认输出到标准输出。

> `bootstrapIngressUrl` : [ string ]

::: tip
此值仅在入站中使用。
:::

用于启动入站连接确认的 URL。(v5.46.0+)


### 连接确认安全性

连接确认可防止**重定向攻击**，即攻击者将被转发的连接直接重定向到真实的转发服务器。如果没有确认：
1. 转发服务器将接收到 TLSMirror 的加密有效载荷帧。
2. 解密将失败，导致服务器拒绝连接。
3. 这种拒绝模式允许审查者识别并屏蔽 TLSMirror 用户。

确认确保客户端仅在通过侧信道验证负载连接实际流经 TLSMirror 服务器的情况下才发送有效载荷数据。

### 控制域约定

启动连接确认验证请求使用特殊的控制域：
`{server_identifier_hex}.tlsmirror-controlconnection.v2fly.arpa`

### 服务器逆角色 (Server Inverse Role)

服务器逆角色通过让 TLSMirror 服务器以**轮询**中继服务器的方式获取确认请求（而不是等待入站请求），从而简化了部署。

**优点：**
- 简化配置（不需要单独的连接确认入站处理程序）。
- 服务器端不需要配置控制域路由（如果仅使用此模式）。
- 多个 TLSMirror 服务器可以共享同一个中继服务器。

轮询机制在后台工作程序中运行，并使用与普通确认相同的 `enrollmentProcessor`。

### 托管注册提供商

我们提供了一个托管服务，用于提供这些引导 URL 以供个人使用。你可以在 `https://v2cloudapi.v2fly.org/` 找到该服务，此网站需要使用 Github 登录。该网站还会生成了一对配置文件的示例。

该服务生成了一对服务器逆角色 Roundtripper 确认配置。

（本文档包含机器生成的内容，并经作者校验。）
