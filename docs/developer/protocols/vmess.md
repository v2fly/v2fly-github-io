# VMess 协议

VMess 是 V2Ray 原创的加密通讯协议。

## 版本

当前版本号为 1。

## 依赖

### 底层协议

VMess 是一个基于 TCP 的协议，所有数据使用 TCP 传输。

### 用户 ID

ID 等价于 [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier)，是一个 16 字节长的随机数，它的作用相当于一个令牌（Token）。
一个 ID 形如：de305d54-75b4-431b-adb2-eb6b9e546014，几乎完全随机，可以使用任何的 UUID 生成器来生成，比如[这个](https://www.uuidgenerator.net/)。

用户 ID 可在[配置文件](../../config/protocols/vmess.md)中指定。

### 函数

* MD5: [MD5 函数](https://en.wikipedia.org/wiki/MD5)
  * 输入参数为任意长度的 byte 数组
  * 输出为一个 16 byte 的数组
* HMAC: [HMAC 函数](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code)
  * 输入参数为：
    * H：散列函数
    * K：密钥，任意长度的 byte 数组
    * M：消息，任意长度的 byte 数组
* Shake: [SHA3-Shake128 函数](https://en.wikipedia.org/wiki/SHA-3)
  * 输入参数为任意长度的 byte 数组
  * 输出为任意长度的 byte 数组

## 通讯过程

VMess 是一个无状态协议，即客户端和服务器之间不需要握手即可直接传输数据，每一次数据传输对之前和之后的其它数据传输没有影响。
VMess 的客户端发起一次请求，服务器判断该请求是否来自一个合法的客户端。如验证通过，则转发该请求，并把获得的响应发回给客户端。
VMess 使用非对称格式，即客户端发出的请求和服务器端的响应使用了不同的格式。

## 客户端请求

| 16 字节 | X 字节 | 余下部分 |
|---------|----------|--------|
| 认证信息| 指令部分 | 数据部分|

### 认证信息

认证信息是一个 16 字节的哈希（hash）值，它的计算方式如下：

* H = MD5
* K = 用户 ID (16 字节)
* M = UTC 时间，精确到秒，取值为当前时间的前后 30 秒随机值 (8 字节, Big-Endian)
* Hash = HMAC(H, K, M)

### 指令部分

指令部分经过 AES-128-CFB 加密：

* Key：MD5(用户 ID + []byte('c48619fe-8f02-49e0-b9e9-edf763e17e21'))
* IV：MD5(X + X + X + X)，X = []byte(认证信息生成的时间) (8 字节, Big-Endian)

| 1 字节 | 16 字节 | 16 字节 | 1 字节 | 1 字节 | 4 位 | 4 位 | 1 字节 | 1 字节 | 2 字节 | 1 字节 | N 字节 | P 字节 | 4 字节 |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 版本号 Ver | 请求加密 IV | 请求加密 Key | 响应认证 V | 选项 Opt | 余量 P | 加密方式 Sec | 保留 | 指令 Cmd | 端口 Port | 地址类型 T | 地址 A | 随机值 | 校验 F |

选项 Opt 细节：（当某一位为 1 时，表示该选项启用）

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| X | X | X | A | P | M | R | S |

其中：

* 版本号 Ver：始终为 1；
* 请求加密 IV：随机值；
* 请求加密 Key：随机值；
* 响应认证 V：随机值；
* 选项 Opt：
  * S (0x01)：标准格式的数据流（默认开启）；
  * R (0x02)：客户端期待重用 TCP 连接（V2Ray 2.23+ 弃用）；
    * 只有当 S 开启时，这一项才有效；
  * M (0x04)：开启元数据混淆（建议开启）；
    * 只有当 S 开启时，这一项才有效；
    * 当其项开启时，客户端和服务器端需要分别构造两个 Shake 实例，分别为 RequestMask = Shake(请求加密 IV), ResponseMask = Shake(响应加密 IV)。
  * P (0x08): 请求全局填充；
    * 只有当 M 开启时，这一项才有效；
    * 数据部分的加密方式只能是 AES-128-GCM 或 ChaCha20-Poly1305；
    * 当其项开启时，客户端和服务器端会根据上文提到的 Shake 实例生成随机长度的填充字节，并附在密文之后；
  * A (0x10)：启用认证的数据包长度实验；
  * X：保留；
* 余量 P：在校验值之前加入 P 字节的随机值；
* 加密方式：指定数据部分的加密方式：
  * 0x01：Legacy (AES-128-CFB)；
  * 0x03：AES-128-GCM；
  * 0x04：ChaCha20-Poly1305；
  * 0x05：None；
* 指令 Cmd：
  * 0x01：TCP 数据；
  * 0x02：UDP 数据；
* 端口 Port：Big Endian 格式的整型端口号；
* 地址类型 T：
  * 0x01：IPv4；
  * 0x02：域名；
  * 0x03：IPv6；
* 地址 A：
  * 当 T = 0x01 时，A 为 4 字节 IPv4 地址；
  * 当 T = 0x02 时，A 为 1 字节长度（L） + L 字节域名；
  * 当 T = 0x03 时，A 为 16 字节 IPv6 地址；
* 校验 F：指令部分除 F 外所有内容的 FNV1a hash (Big-Endian)；

### 数据部分

数据部分有两种格式，默认为基本格式。

#### 基本格式 （弃用）

**此格式仅作为向后兼容所用，在之后的版本中可能被删除。**

所有数据均认为是请求的实际内容。这些内容将被发往指令部分所指定的地址。当 Cmd = 0x01 时，这些数据将以 TCP 的形式发送；当 Cmd = 0x02 时，这些数据将以 UDP 形式发送。

此格式支持 None 和 AES-128-CFB 两种加密方式，加密的 Key 和 IV 由指令部分指定。

#### 标准格式

当 Opt(S) 开启时，数据部分使用此格式。实际的请求数据被分割为若干个小块，每个小块的格式如下。服务器校验完所有的小块之后，再按基本格式的方式进行转发。

| 2 字节 | L-P 字节 | P 字节 |
|:------:|:-----:|:-----:|
| 长度 L | 数据包 | 随机值 |

其中：

* 长度 L：
  * Big Endian 格式的整型，最大值为 2^14；
  * 当 Opt(M) 关闭时，L 的实际值 = 数据值；
  * 当 Opt(M) 开启时，L 的实际值 = 数据值 xor Mask。Mask = (RequestMask.NextByte() << 8) + RequestMask.NextByte()；
* 填充长度 P：
  * 当 Opt(P) 关闭时，P = 0，即无填充字节；
  * 当 Opt(P) 开启时，P = ((RequestMask.NextByte() << 8) + RequestMask.NextByte()) % 64；
* 数据包：由指定的加密方式加密过的数据包；

在传输结束之前，数据包中必须有实际数据，即除了长度和认证数据之外的数据。当传输结束时，客户端必须发送一个空的数据包，即 L = 0（不加密）或认证数据长度（有加密），来表示传输结束。

设数据包长度为 R = L - P，按加密方式不同，数据包的格式如下：

* 不加密：
  * R 字节：实际数据；
* AES-128-CFB：整个数据部分使用 AES-128-CFB 加密
  * 4 字节：实际数据的 FNV1a hash (Big-Endian)；
  * R - 4 字节：实际数据；
* AES-128-GCM：Key 为指令部分的 Key，IV = count (2 字节) + IV (10 字节)。count 从 0 开始递增，每个数据包加 1；IV 为 指令部分 IV 的第 3 至第 12 字节。
  * R - 16 字节：实际数据；
  * 16 字节：GCM 认证信息；
* ChaCha20-Poly1305：Key = MD5(指令部分 Key) + MD5(MD5(指令部分 Key))，IV = count (2 字节) + IV (10 字节)。count 从 0 开始递增，每个数据包加 1；IV 为 指令部分 IV 的第 3 至第 12 字节。
  * R - 16 字节：实际数据；
  * 16 字节：Poly1305 认证信息；

## 服务器应答

应答头部数据使用 AES-128-CFB 加密。响应加密 IV 为 MD5(请求加密 IV)，响应加密 Key 为 MD5(请求加密 Key)。实际应答数据视加密设置不同而不同。

| 1 字节 | 1 字节    | 1 字节   | 1 字节 | M 字节 | 余下部分 |
|--------|----------|---------|--------|--------|----------|
|响应认证 V| 选项 Opt  |指令 Cmd |指令长度 M|指令内容| 实际应答数据|

其中：

* 响应认证 V：必须和客户端请求中的响应认证 V 一致；
* 选项 Opt：
  * 0x01：服务器端准备重用 TCP 连接（V2Ray 2.23+ 弃用）；
* 指令 Cmd：
  * 0x01：动态端口指令；
* 实际应答数据：
  * 如果请求中的 Opt(S) 开启，则使用标准格式，否则使用基本格式；
  * 如果请求中的 Opt(M) 开启，则开启元数据混淆，Shake 实例为 ResponseMask；
  * 如果请求中的 Opt(P) 开启，则请求全局填充，Shake 实例为 ResponseMask；
  * 格式均和请求数据相同；

### 动态端口指令

| 1 字节 | 2 字节    | 16 字节   | 2 字节 | 1 字节 | 1 字节 |
|---------|----------|----------|--------|--------|----------|
| 保留  |端口 Port |用户 ID| AlterID | 用户等级 | 有效时间 T |

其中：

* 端口 Port：Big Endian 格式的整型端口号；
* 有效时间 T：分钟数；

客户端在收到动态端口指令时，服务器已开放新的端口用于通信，这时客户端可以将数据发往新的端口。在 T 分钟之后，这个端口将失效，客户端必须重新使用主端口进行通信。

## 注释

* 为确保向前兼容性，所有保留字段的值必须为 0。
