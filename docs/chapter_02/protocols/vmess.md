---
refcn: chapter_02/protocols/vmess
refen: configuration/protocols/vmess
---

# VMess

* 名称：`vmess`
* 类型：入站 / 出站

[VMess](../../developer/protocols/vmess.md) 是一个加密传输协议，它分为入站和出站两部分，通常作为 V2Ray 客户端和服务器之间的桥梁。

VMess 依赖于系统时间，请确保使用 V2Ray 的系统 UTC 时间误差在 90 秒之内，时区无关。在 Linux 系统中可以安装`ntp`服务来自动同步系统时间。

VMess 的配置分为两部分，`InboundConfigurationObject`和`OutboundConfigurationObject`，分别对应入站和出站协议配置中的`settings`项。

## OutboundConfigurationObject

```json
{
    "vnext": [
        {
            "address": "127.0.0.1",
            "port": 37192,
            "users": [
                {
                    "id": "27848739-7e62-4138-9fd3-098a63964b6b",
                    "alterId": 4,
                    "security": "auto",
                    "level": 0
                }
            ]
        }
    ]
}
```

> `vnext`：\[ [ServerObject](#serverobject) \]

一个数组，包含一系列的服务器配置

### ServerObject

```json
{
    "address": "127.0.0.1",
    "port": 37192,
    "users": []
}
```

> `address`: address

服务器地址，支持 IP 地址或者域名。

> `port`: number

服务器端口号。

> `users`: \[ [UserObject](#userobject) \]

一组服务器认可的用户

### UserObject

```json
{
    "id": "27848739-7e62-4138-9fd3-098a63964b6b",
    "alterId": 4,
    "security": "auto",
    "level": 0
}
```

> `id`：string

VMess 用户的主 ID。必须是一个合法的 UUID。

> `alterId`：number

为了进一步防止被探测，一个用户可以在主 ID 的基础上，再额外生成多个 ID。这里只需要指定额外的 ID 的数量，推荐值为 4。不指定的话，默认值是 `0`。最大值 `65535`。这个值不能超过服务器端所指定的值。

> `level`: number

用户等级

> `security`: "aes-128-gcm" | "chacha20-poly1305" | "auto" | "none"

加密方式，客户端将使用配置的加密方式发送数据，服务器端自动识别，无需配置。

* `"aes-128-gcm"`：推荐在 PC 上使用
* `"chacha20-poly1305"`：推荐在手机端使用
* `"auto"`：默认值，自动选择（运行框架为 AMD64、ARM64 或 s390x 时为 aes-128-gcm 加密方式，其他情况则为 Chacha20-Poly1305 加密方式）
* `"none"`：不加密

{% hint style='info' %}
推荐使用`"auto"`加密方式，这样可以永久保证安全性和兼容性。
{% endhint %}

> `testsEnabled`: "VMessAEAD" | "none"

启用某个正在进行中的实验。（ v4.24 版本起）

* `"VMessAEAD"`： 启用 VMessAEAD 头部加密实验（后文详细介绍）。 （ v4.24 版本起）

* `"none"`：不启用任何实验


## InboundConfigurationObject

```json
{
    "clients": [
        {
            "id": "27848739-7e62-4138-9fd3-098a63964b6b",
            "level": 0,
            "alterId": 4,
            "email": "love@v2ray.com"
        }
    ],
    "default": {
        "level": 0,
        "alterId": 4
    },
    "detour": {
        "to": "tag_to_detour"
    },
    "disableInsecureEncryption": false
}
```

> `clients`: \[ [ClientObject](#clientobject) \]

一组服务器认可的用户。clients 可以为空。当此配置用作动态端口时，V2Ray 会自动创建用户。

> `detour`: [DetourObject](#detourobject)

指示对应的出站协议使用另一个服务器。

> `default`: [DefaultObject](#defaultobject)

可选，clients 的默认配置。仅在配合`detour`时有效。

> `disableInsecureEncryption`: true | false

是否禁止客户端使用不安全的加密方式，当客户端指定下列加密方式时，服务器会主动断开连接。默认值为`false`。

* `"none"`
* `"aes-128-cfb"`

### ClientObject

```json
{
    "id": "27848739-7e62-4138-9fd3-098a63964b6b",
    "level": 0,
    "alterId": 4,
    "email": "love@v2ray.com"
}
```

> `id`: string

VMess 的用户 ID。必须是一个合法的 UUID。

> `level`: number

用户等级，详见[本地策略](../policy.md)

> `alterId`: number

与上文出站协议中的含义相同。

> `email`: string

用户邮箱地址，用于区分不同用户的流量。

{% hint style='info' %}
`alterId` 取值的大小和流量特征没有必然联系。对于日常使用，`16` 以内的值已经够用了。
{% endhint %}

### DetourObject

```json
{
    "to": "tag_to_detour"
}
```

> `to`: string

一个入站协议的`tag`，详见[配置文件](../02_protocols.md)。指定的入站协议必须是一个 VMess

### DefaultObject

```json
{
    "level": 0,
    "alterId": 4
}
```

> `level`: number

用户等级，意义同上。默认值为`0`。

> `alterId`: number

动态端口的默认`alterId`，默认值为`32`，填`0`也会被改写成`32`。推荐值`4`。

### VMess MD5 认证信息 玷污机制

为了进一步对抗可能的探测和封锁，自 v4.24 版本起，每个 VMess 认证数据的服务器端结构都会包含一个一次写入的玷污状态标记，初始状态为无瑕状态，当服务器检测到重放探测时或者因为其他原因入站连接出错以致校验数据不正确时，该连接所对应的请求认证数据会被玷污。被玷污的认证数据无法被用于建立连接，当攻击者或客户端使用被玷污的认证数据建立连接时，服务器会输出包含 "invalid user" "ErrTainted" 的错误信息，并阻止该连接。

当服务器没有受到重放攻击时，该机制对正常连接的客户端没有影响。如果服务器正在被重放攻击，可能会出现连接不稳定的情况。拥有服务器 UUID 以及其他连接数据的恶意程序可能根据此机制对服务器发起拒绝服务攻击，受到此类攻击的服务可以通过修改 proxy/vmess/validator.go 文件中 func (v *TimedUserValidator) BurnTaintFuse(userHash []byte) error 函数的 atomic.CompareAndSwapUint32(pair.taintedFuse, 0, 1) 语句为 atomic.CompareAndSwapUint32(pair.taintedFuse, 0, 0) 来解除服务器对此类攻击的安全保护机制。使用 VMessAEAD 认证机制的客户端不受到 VMess MD5 认证信息 玷污机制 的影响。

### VMessAEAD 头部加密实验 （公测阶段）

VMessAEAD 是用于对抗重放和读取长度探测的 VMess 协议的小修改，自 v4.24 版本起可以在客户端通过 testsEnabled 启用。在实验期间，需要客户端和服务器端版本相同。自 v4.24 版本起的服务器端自动启用本实验。本实验所采用的头部加密和认证有助于对抗基于抓包的重放攻击。启用本实验的客户端无法连接版本不匹配的服务器端。

在建立 VMess 连接时，启用了本实验的客户端会输出 "=======VMESSAEADEXPERIMENT ENABLED========"到命令行。本实验也可以通过设置环境变量 "VMESSAEADEXPERIMENT=y" 强制启用，"VMESSAEADEXPERIMENT=n" 强制禁用。

请反馈在实验中遇到的任何问题。 

VMessAEAD 头部加密 将在公测结束后默认启用。届时服务器端将在有限的时间内默认保持对现有协议的兼容。
