# VMess

* Name: `vmess`
* Type: Inbound / Outbound

[VMess](../../developer/protocols/vmess.md) is an inbound/outbound protocol. It is an encrypted tunnel, usually acting as a bridge between a V2Ray client and a server.

VMess relies on system time to function correctly. Please ensure that system UTC time deviation between the V2Ray client and server are within 90 seconds, independent of timezones. The `ntp` service can be used on Linux systems to automatically synchronize system UTC time.

:::tip
Since v4.28.1, the client AlterID setting is 0 by default, which means VMessAEAD is enabled; The server will adapt accordingly, and supports connections from AEAD-enabled and non-AEAD-enabled clients simultaneously.

Since v4.35.0, backwards compatibility of VMess MD5 authentication can be disabled.
:::

The configuration of VMess is divided into two parts, `InboundConfigurationObject` and `OutboundConfigurationObject`, which correspond to the `settings` element in the inbound and outbound protocol configuration respectively.


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
                    "alterId": 0,
                    "security": "auto",
                    "level": 0
                }
            ]
        }
    ]
}
```

> `vnext`: \[ [ServerObject](#serverobject) \]

An array containing a series of [ServerObject](#ServerObject)s, representing remote VMESS servers.

### ServerObject

```json
{
    "address": "127.0.0.1",
    "port": 37192,
    "users": []
}
```

> `address`: address

Remote VMESS server address. Address can be IPv4, IPv6, or a domain name.

> `port`: number

Remote VMESS server address.

> `users`: \[ [UserObject](#userobject) \]

A set of credentials recognized by the server, in the form of [UserObject](#UserObject)s.


### UserObject

```json
{
    "id": "27848739-7e62-4138-9fd3-098a63964b6b",
    "alterId": 0,
    "security": "auto",
    "level": 0
}
```

> `id`: string

The primary ID of the VMess user. Must be a valid UUID.

> `alterId`: number

In order to further evade detection, a user can generate multiple secondary IDs based on the main ID. Only the amount of additional IDs needs to be specified here. The recommended value is 0, which enables VMessAEAD instead. If not specified, the default value is `0`. The maximum value is `65535`. This value cannot exceed the value specified by the server.

:::tip
The client can force VMessAEAD to be disabled by setting the environment variable `V2RAY_VMESS_AEAD_DISABLED=true` (unrecommended, only for compatibility with servers prior to v4.28.1 **and** only if `alterId=0`)
:::

> `level`: number

User level, default is `0`. See [Local Policy](../policy.md).

> `security`: "aes-128-gcm" | "chacha20-poly1305" | "auto" | "none" | "zero"

Chooses the encryption algorithm to use. the client sends data using the configured encryption method, which the server automatically recognizes and does not need to be configured for.

* `"aes-128-gcm"`: Recommended for use on computers
* `"chacha20-poly1305"`: Recommended for mobile / embedded devices
* `"auto"`: Default value, automatically selects a suitable algorithm (AMD64, ARM64, or s390x architectures use `aes-128-gcm`, otherwise use `Chacha20-Poly1305`)
* `"none"`: Unencrypted
* `"zero"`: Unencrypted, message authentication disabled (Since v4.35.0)

:::tip
`auto` is recommended as it will allow the client to automatically switch to new, suitable algorithms for future versions of VMESS.

The `"none"` pseudo-encryption algorithm only calculates and verifies the checksum data of the data packet. As the authentication checksum algorithm does not have hardware support, on some platforms the speed may even be slower than `"aes-128-gcm"` encryption method due to CPU-based hardware acceleration.

The `"zero"` pseudo-encryption algorithm does not encrypt messages nor calculate checksum data, so in theory it may be faster than any other algorithms. Actual speed may be affected by environmental factors.

It is not recommended to use the `"none"` or `"zero"` pseudo-encryption algorithms without first enabling TLS encryption on top and forcing certificate verification. If you use a content delivery network, or other intermediate services that decrypt the TLS traffic to establish connections (such as Cloudflare), it is highly unrecommended to use the `"none"` or `"zero"` pseudo-encryption algorithms, as your provider will be able to view plaintext traffic.

Regardless of which encryption algorithm is being used, the VMess authentication headers will be protected by its own encryption and authentication protocol.
:::

> `experiments`: string

Experimental flags of the VMess protocol. (Functions provided here are unstable and may be deprecated or removed at any time.) Multiple enabled experimental flags can be separated by `|` pipe characters (e.g. `"AuthenticatedLength|NoTerminationSignal"`).

(Since v4.41.0) `"AuthenticatedLength"` enables experimental data packet length authentication. This experiment requires that the client and server both have it enabled at the same time and use the same version of VMESS.

(Since v4.41.0) `"NoTerminationSignal"` disables sending the disconnect signal. This experiment may affect the stability of the proxied connection.


## InboundConfigurationObject

```json
{
    "clients": [
        {
            "id": "27848739-7e62-4138-9fd3-098a63964b6b",
            "level": 0,
            "alterId": 0,
            "email": "love@v2ray.com"
        }
    ],
    "default": {
        "level": 0,
        "alterId": 0
    },
    "detour": {
        "to": "DETOUR_TAG"
    },
    "disableInsecureEncryption": false
}
```

> `clients`: \[ [ClientObject](#clientobject) \]

An array of credentials that the server recognizes, in the form of [ClientObject](#ClientObject)s. Optional. If dynamic ports are configured, V2Ray will automatically create users.

> `detour`: [DetourObject](#detourobject)

Indicates the configured outbound to use another target server (see [DetourObject](#DetourObject)).

> `default`: [DefaultObject](#defaultobject)

The default configuration for `clients`. Optional. Only effective when used in conjunction with `detour`.

> `disableInsecureEncryption`: true | false

Whether to disable insecure encryption methods for clients. When the client specifies the following encryption methods, the server will automatically close the connection. The default value is `false`.

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

The user ID of the VMess user. Must be a valid UUID.

> `level`: number

User level, default is `0`. See [Local Policy](../policy.md).

> `alterId`: number

In order to further evade detection, a user can generate multiple secondary IDs based on the main ID. Only the amount of additional IDs needs to be specified here. The recommended value is 0, which enables VMessAEAD instead. If not specified, the default value is `0`. The maximum value is `65535`. This value cannot exceed the value specified by the server.

> `email`: string

Email address, optional. Used to identify users.

### DetourObject

```json
{
    "to": "tag_to_detour"
}
```

> `to`: string

The `tag` of an inbound protocol. See also [InboundObject](../inbounds.md#inboundobject). The specified `tag` must be an inbound VMess.


### DefaultObject

```json
{
    "level": 0,
    "alterId": 0
}
```

> `level`: number

User level, default is `0`. See [Local Policy](../policy.md).

> `alterId`: number

The default `alterId` of the dynamic port. Default value is `0`.

## VMess MD5 Authentication Tainting Mechanism

:::tip
This section concerns the deprecated MD5 Authentication protocol.
:::

(Since v4.24) In order to further counter possible detection and blocking, each cached server-side VMess authentication header will include a one-time, write-only "tainted" flag, with the initial state being untainted. When the server detects a replay detection, or if the incoming connection fails due to other reasons, resulting in the verification data being incorrect, the request authentication data corresponding to the connection will be "tainted".

"Tainted" authentication data cannot be used to establish a connection. When an attacker or client tries to use "tainted" authentication data to establish a connection, the server returns an error containing "`invalid user`" "`ErrTainted`" and closes the connection.

If the server is not affected by an active replay attack, this mechanism has no effect on normal client connections. If the server is under a replay attack, the connection may become unstable.

Malicious programs that possess the server UUID and other connection data may use this mechanism to launch a denial of service attack against the server. Servers that are subject to such attacks can disable the server's security protection mechanism against such attacks by modifying the `atomic.CompareAndSwapUint32(pair.taintedFuse, 0, 1)` statement in the `func (v *TimedUserValidator) BurnTaintFuse(userHash []byte)` error function in the `proxy/vmess/validator.go` file to `atomic.CompareAndSwapUint32(pair.taintedFuse, 0, 0)`. Newer clients using the VMessAEAD authentication mechanism are not affected by the VMess MD5 Authentication Tainting Mechanism.

## VMess MD5 Authentication Deprecation Mechanism

The VMessAEAD protocol has been peer-reviewed and integrated with corresponding modifications. The VMess MD5 Authentication deprecation mechanism is currently active.

As of January 1, 2022, servers will default to disabling MD5 Authentication support. Any clients still using MD5 Authentication will not be able to connect to a server which has disabled VMess MD5 authentication.

(Since v4.35.0) For server operators, compatibility with MD5 Authentication can be manually disabled by setting the environment variable `v2ray.vmess.aead.forced` = `true`. MD5 authentication support can be forced enabled by setting this to `false`.
