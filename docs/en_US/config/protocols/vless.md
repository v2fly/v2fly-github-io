# VLESS

- Name: `vless`
- Type: Inbound / Outbound

:::warning
VLESS is currently unencrypted. Only use VLESS over a secured or private channel, such as a TLS tunnel. VLESS does not currently support sharing.
:::

VLESS is an inbound/outbound protocol. VLESS is a stateless lightweight transport which is divided into inbound and outbound components, and can act as a bridge between a V2Ray client and a server.

Unlike [VMess](vmess.md), VLESS does not rely on system time. While the authentication method is also UUID-based, it does not require an `alterId`.

VLESS's configuration is divided into two parts, `InboundConfigurationObject` and `OutboundConfigurationObject`, corresponding to the `settings` element in the inbound and outbound protocol configuration respectively.

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
                    "encryption": "none",
                    "level": 0
                }
            ]
        }
    ]
}
```

> `vnext`: \[ [ServerObject](#serverobject) \]

An array, where each element is a [ServerObject](#ServerObject).

### ServerObject

```json
{
    "address": "example.com",
    "port": 443,
    "users": []
}
```

> `address`: address

Remote VLESS server address. Supports IPv4, IPv6, or domain names.

> `port`: number

Remote VLESS server port.

> `users`: \[ [UserObject](#userobject) \]

An array of users recognized by the server. Each element is a [UserObject](#UserObject).

### UserObject

```json
{
    "id": "27848739-7e62-4138-9fd3-098a63964b6b",
    "encryption": "none",
    "level": 0
}
```

> `id`: string

VLESS's user IDs must be valid UUIDs, which you can generate using [online tools](../../awesome/tools.md) or [V2Ctl](../../guide/command.md#v2ctl).

> `encryption`: "none"

Currently, only ``"none"`` is available, but it is a required field. This requirement is to remind users that there is no encryption currently available, and also to prevent users from incorrectly configuring the encryption option when it becomes available in the future, accidentally configuring the tunnel to use plaintext only.

If `encryption` is not set correctly, you will receive an error message when using `v2ray` or `-test`.

> `level`: number

User level, default is `0`. See [Local Policy](../policy.md).

## InboundConfigurationObject

```json
{
    "clients": [
        {
            "id": "27848739-7e62-4138-9fd3-098a63964b6b",
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

An array of users recognized by the server. Each element is a [ClientObject](#ClientObject).

> `decryption`: "none"

The decryption algorithm needs to be the same as the client's setting. For now, you also need to use `"none"`, as it is a required field (see also [UserObject](#UserObject)). The options for decryption and encryption are different for every user, because if encryption is enabled, the server needs to decrypt it first to know which user it is.

If `decryption` is not set correctly, you will receive an error message when using `v2ray` or `-test`.

> `fallbacks`: \[ [FallbackObject](#fallbackobject) \]

An array containing a series of fallback stream configurations (optional, see [FallbackObject](#FallbackObject)).

### ClientObject

```json
{
    "id": "27848739-7e62-4138-9fd3-098a63964b6b",
    "level": 0,
    "email": "love@v2fly.org"
}
```

> `id`: string

The VLESS user ID, which must be a valid UUID. You can also use [V2Ctl](../../guide/command.md#v2ctl) to generate it.

> `level`: number

User level, default is `0`. See [Local Policy](../policy.md).

> `email`: string

The user's email is used to distinguish between different users in metrics (logs, statistics, etc.).

## FallbackObject

```json
{
    "alpn": "",
    "path": "",
    "dest": 80,
    "xver": 0
}
```

:::tip
Since v4.27.2, `fallbacks` is now an array. This is the configuration description of one of its child elements, and the parameters are different from the old fallback element.

`fallbacks` elements are optional and can only be used in a TCP+TLS transport combination.
:::

**When fallback are configured, [Inbound TLS](../transport.md#TlsObject) must be set to `"alpn":["http/1.1"]`.**

Usually, you need to set a default fallback with `alpn` and `path` both omitted, and then configure other traffic splitting as needed.

VLESS will forward traffic that is decrypted if the length of the first packet of TLS `< 18`, if the protocol version is invalid, or if the authentication fails, to the address specified by `dest`.

Other unsupported transport combinations cannot use `fallbacks`. If VLESS detects any fallback conditions being met with an unsupported traffic configuration, it will simply disconnect.

> `alpn`: string

Pattern to match the TLS ALPN negotiation result. Empty for any, default to "".

When necessary, VLESS will try to read the TLS ALPN negotiation result, and if successful, output `realAlpn =` to the log.

`alpn` can be used to work around the problem whereby Nginx's `h2c` service is incompatible with HTTP/1.1. Nginx needs to write two lines for listen, one for HTTP/1.1 and one for `h2c`.

Note: When `"h2"` is set in `alpn`, [Inbound TLS](../../config/transport.md#tlsobject) needs to be set to `"alpn":["h2","http/1.1"]`, to support `h2` access.

:::tip
The `alpn` set in Fallback is to match the actual negotiated ALPN, while the `alpn` set in Inbound TLS is the optional ALPN list used during the handshake, which have different meanings.
:::

> `path`: string

Pattern to match the first packet's HTTP hyperlink, empty for any. Default to empty, non-empty values must start with `"/"`. Does not support `h2c`.

When necessary, VLESS will try to observe the HTTP hyperlink (no more than 55 bytes; simple algorithm, incomplete parsing of full length of hyperlink), and if successful, outputs the info `realPath =` to the log.

`path` can be used to split traffic from other WebSocket inbounds, or masquerade certain HTTP traffic. It has minimal overhead, being purely traffic forwarding, and is [generally more effective than Nginx reverse-proxies](https://github.com/badO1a5A90/v2ray-doc/blob/master/v2ray%20speed%20test%20v4.27.2.md).

Note: **The inbound where fallbacks are used must be TCP+TLS only**, which is used to split traffic to other WebSocket inbounds. The inbound being split does not need to be configured with TLS.

> `dest`: string | number

Determines the destination of TCP traffic after TLS decryption. Required. Currently supports two types of destinations:

1. TCP, in the format of `"addr:port"`, where `addr` is an IPv4 or IPv6 address, or a domain name. If a domain name is used, a TCP connection will be initiated directly (without querying the [built-in DNS](../dns.md)).
2. Unix domain socket, in the format of an absolute path, such as `"/dev/shm/domain.socket"`, with `"@"` prepended to represent [abstract sockets](https://www.man7.org/linux/man-pages/man7/unix.7.html), or `"@@"` to represent abstract sockets with padding.

If only a port is configured, numbers or strings can be used, such as `80` or `"80"`, which usually points to a local web service (destination is assumed to be `"127.0.0.1"`).

> `xver`: number

Utilize the [PROXY protocol](https://www.haproxy.org/download/2.2/doc/proxy-protocol.txt) to forward the incoming IP and port of the request. Version `1` or `2` are supported, with the default being `0` (disabled). If needed, it is recommended to be set to `1`.

Currently, versions `1` and `2` are effectively the same, but the data structures are different, and the former can be printed for human-readable text, while the latter is encoded in binary. V2Ray's TCP and WebSocket inbounds all support receiving the PROXY protocol.

:::tip
If you are [configuring Nginx to parse incoming PROXY protocol](https://docs.nginx.com/nginx/admin-guide/load-balancer/using-proxy-protocol/#configuring-nginx-to-accept-the-proxy-protocol), in addition to setting `proxy_protocol`, you may also need to set `set_real_ip_from`, otherwise it may not function.
:::

**Additional Info**

1. The most relevant `FallbackObject` will be matched. If there are several child elements with the same `alpn` and `path`, the last one will be used.
2. The fallback traffic routing forwards TCP (Transport Layer) data directly after decryption, not HTTP (Application Layer) data, and only the first packet's hyperlink path is parsed when necessary.
3. Domain name traffic routing is not supported. If this is needed, it is recommended to use Nginx or other tools to configure Stream SNI traffic routing.
