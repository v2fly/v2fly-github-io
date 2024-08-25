# Transport

The underlying transport mode (transport) is the way the current V2Ray node is connected to other nodes. The underlying transmission mode provides a stable data transmission channel. Generally speaking, a symmetrical transmission mode is required at both ends of a network connection. For example, if one end uses WebSocket, the other end must also use WebSocket, otherwise the connection cannot be established.

The underlying transport (transport) configuration is divided into two parts, one is global settings ([TransportObject](#transportobject)), and the other is sub-protocol configuration ([StreamSettingsObject](#streamsettingsobject)). Sub-protocol configuration can specify how each individual inbound and outbound protocol is transmitted. Generally speaking, the outbound and inbound protocols corresponding to the client and server need to use the same transmission method. When the sub-protocol transmission configuration specifies a transmission method, but does not fill in its settings, this transmission method will use the settings in the global configuration.

## TransportObject

`TransportObject` corresponds to the `transport` item of the configuration file.

```json
{
    "tcpSettings": {},
    "kcpSettings": {},
    "wsSettings": {},
    "httpSettings": {},
    "quicSettings": {},
    "dsSettings": {}
}
```

> `tcpSettings`: [TcpObject](transport/tcp.md)

Configuration for TCP connection.

> `kcpSettings`: [KcpObject](transport/mkcp.md)

Configuration for mKCP connection.

> `wsSettings`: [WebSocketObject](transport/websocket.md)

Configuration for WebSocket connection.

> `httpSettings`: [HttpObject](transport/h2.md)

Configuration for HTTP/2 connection.

> `quicSettings`: [QuicObject](transport/quic.md)

Configuration for QUIC connection.

> `dsSettings`: [DomainSocketObject](transport/domainsocket.md)

Configuration for Domain Socket connection.

## StreamSettingsObject

`StreamSettingsObject` corresponds to the `streamSettings` item in the outbound inbound protocol. Each inbound and outbound connection can be configured with different transmission configurations, and you can set `streamSettings` to configure some transmissions.

```json
{
    "network": "tcp",
    "security": "none",
    "tlsSettings": {},
    "tcpSettings": {},
    "kcpSettings": {},
    "wsSettings": {},
    "httpSettings": {},
    "quicSettings": {},
    "dsSettings": {},
    "sockopt": {
        "mark": 0,
        "tcpFastOpen": false,
        "tproxy": "off"
    }
}
```

> `network`: "tcp" | "kcp" | "ws" | "http" | "domainsocket" | "quic"

The network type used by the data stream, the default value is `"tcp"`

> `security`: "none" | "tls"

Whether to enable transport layer encryption, the supported options are `"none"` means no encryption (default value), and `"tls"` means use [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security).

> `tlsSettings`: [TLSObject](#tlsobject)

TLS configuration. TLS is provided by Golang, supports TLS 1.3, does not support DTLS.

> `tcpSettings`: [TcpObject](transport/tcp.md)

The TCP configuration of the current connection is only valid when the connection uses TCP. The configuration content is the same as the global configuration above.

> `kcpSettings`: [KcpObject](transport/mkcp.md)

The mKCP configuration of the current connection is valid only when the connection uses mKCP. The configuration content is the same as the global configuration above.

> `wsSettings`: [WebSocketObject](transport/websocket.md)

The WebSocket configuration of the current connection is valid only when this connection uses WebSocket. The configuration content is the same as the global configuration above.

> `httpSettings`: [HttpObject](transport/h2.md)

The HTTP/2 configuration of the current connection is only valid when the connection uses HTTP/2. The configuration content is the same as the global configuration above.

> `quicSettings`: [QUICObject](transport/quic.md)

The QUIC configuration of the current connection is only valid when the connection uses QUIC. The configuration content is the same as the global configuration above.

> `dsSettings`: [DomainSocketObject](transport/domainsocket.md)

The domain socket configuration of the current connection is valid only when this connection uses Domain socket. The configuration content is the same as the global configuration above.

> `sockopt`: [SockoptObject](#sockoptobject)

Used as a transparent proxy configuration.

## TLSObject

```json
{
    "serverName": "v2ray.com",
    "allowInsecure": false,
    "alpn": [
        "h2",
        "http/1.1"
    ],
    "certificates": [],
    "disableSystemRoot": false
}
```

> `serverName`: string

Specify the domain name of the server certificate, which is useful when the connection is established by IP. When the target connection is specified by a domain name, such as receiving a domain name when Socks is inbound, or a domain name detected by the sniffing function, this domain name will be automatically used for `serverName` without manual configuration.

> `alpn`: \[ string \]

An array of strings that specifies the ALPN value specified during the TLS handshake. The default value is `["h2", "http/1.1"]`.

> `allowInsecure`: true | false

Whether to allow insecure connections (only for clients). The default value is `false`. When the value is `true`, V2Ray will not check the validity of the TLS certificate provided by the remote host.

> `disableSystemRoot`: true | false

(V2Ray 4.18+) Whether to disable the CA certificate that comes with the operating system. The default value is `false`. When the value is `true`, V2Ray will only use the certificate specified in `certificates` for TLS handshake. When the value is `false`, V2Ray will only use the CA certificate that comes with the operating system for TLS handshake.

> `certificates`: \[ [CertificateObject](#certificateobject) \]

A list of certificates, where each item represents a certificate (fullchain is recommended).

### CertificateObject

```json
{
    "usage": "encipherment",
    "certificateFile": "/path/to/certificate.crt",
    "keyFile": "/path/to/key.key",
    "certificate": [
        "-----BEGIN CERTIFICATE-----",
        "MIICwDCCAaigAwIBAgIRAO16JMdESAuHidFYJAR/7kAwDQYJKoZIhvcNAQELBQAw",
        "ADAeFw0xODA0MTAxMzU1MTdaFw0xODA0MTAxNTU1MTdaMAAwggEiMA0GCSqGSIb3",
        "DQEBAQUAA4IBDwAwggEKAoIBAQCs2PX0fFSCjOemmdm9UbOvcLctF94Ox4BpSfJ+",
        "3lJHwZbvnOFuo56WhQJWrclKoImp/c9veL1J4Bbtam3sW3APkZVEK9UxRQ57HQuw",
        "OzhV0FD20/0YELou85TwnkTw5l9GVCXT02NG+pGlYsFrxesUHpojdl8tIcn113M5",
        "pypgDPVmPeeORRf7nseMC6GhvXYM4txJPyenohwegl8DZ6OE5FkSVR5wFQtAhbON",
        "OAkIVVmw002K2J6pitPuJGOka9PxcCVWhko/W+JCGapcC7O74palwBUuXE1iH+Jp",
        "noPjGp4qE2ognW3WH/sgQ+rvo20eXb9Um1steaYY8xlxgBsXAgMBAAGjNTAzMA4G",
        "A1UdDwEB/wQEAwIFoDATBgNVHSUEDDAKBggrBgEFBQcDATAMBgNVHRMBAf8EAjAA",
        "MA0GCSqGSIb3DQEBCwUAA4IBAQBUd9sGKYemzwPnxtw/vzkV8Q32NILEMlPVqeJU",
        "7UxVgIODBV6A1b3tOUoktuhmgSSaQxjhYbFAVTD+LUglMUCxNbj56luBRlLLQWo+",
        "9BUhC/ow393tLmqKcB59qNcwbZER6XT5POYwcaKM75QVqhCJVHJNb1zSEE7Co7iO",
        "6wIan3lFyjBfYlBEz5vyRWQNIwKfdh5cK1yAu13xGENwmtlSTHiwbjBLXfk+0A/8",
        "r/2s+sCYUkGZHhj8xY7bJ1zg0FRalP5LrqY+r6BckT1QPDIQKYy615j1LpOtwZe/",
        "d4q7MD/dkzRDsch7t2cIjM/PYeMuzh87admSyL6hdtK0Nm/Q",
        "-----END CERTIFICATE-----"
    ],
    "key": [
        "-----BEGIN RSA PRIVATE KEY-----",
        "MIIEowIBAAKCAQEArNj19HxUgoznppnZvVGzr3C3LRfeDseAaUnyft5SR8GW75zh",
        "bqOeloUCVq3JSqCJqf3Pb3i9SeAW7Wpt7FtwD5GVRCvVMUUOex0LsDs4VdBQ9tP9",
        "GBC6LvOU8J5E8OZfRlQl09NjRvqRpWLBa8XrFB6aI3ZfLSHJ9ddzOacqYAz1Zj3n",
        "jkUX+57HjAuhob12DOLcST8np6IcHoJfA2ejhORZElUecBULQIWzjTgJCFVZsNNN",
        "itieqYrT7iRjpGvT8XAlVoZKP1viQhmqXAuzu+KWpcAVLlxNYh/iaZ6D4xqeKhNq",
        "IJ1t1h/7IEPq76NtHl2/VJtbLXmmGPMZcYAbFwIDAQABAoIBAFCgG4phfGIxK9Uw",
        "qrp+o9xQLYGhQnmOYb27OpwnRCYojSlT+mvLcqwvevnHsr9WxyA+PkZ3AYS2PLue",
        "C4xW0pzQgdn8wENtPOX8lHkuBocw1rNsCwDwvIguIuliSjI8o3CAy+xVDFgNhWap",
        "/CMzfQYziB7GlnrM6hH838iiy0dlv4I/HKk+3/YlSYQEvnFokTf7HxbDDmznkJTM",
        "aPKZ5qbnV+4AcQfcLYJ8QE0ViJ8dVZ7RLwIf7+SG0b0bqloti4+oQXqGtiESUwEW",
        "/Wzi7oyCbFJoPsFWp1P5+wD7jAGpAd9lPIwPahdr1wl6VwIx9W0XYjoZn71AEaw4",
        "bK4xUXECgYEA3g2o9WqyrhYSax3pGEdvV2qN0VQhw7Xe+jyy98CELOO2DNbB9QNJ",
        "8cSSU/PjkxQlgbOJc8DEprdMldN5xI/srlsbQWCj72wXxXnVnh991bI2clwt7oYi",
        "pcGZwzCrJyFL+QaZmYzLxkxYl1tCiiuqLm+EkjxCWKTX/kKEFb6rtnMCgYEAx0WR",
        "L8Uue3lXxhXRdBS5QRTBNklkSxtU+2yyXRpvFa7Qam+GghJs5RKfJ9lTvjfM/PxG",
        "3vhuBliWQOKQbm1ZGLbgGBM505EOP7DikUmH/kzKxIeRo4l64mioKdDwK/4CZtS7",
        "az0Lq3eS6bq11qL4mEdE6Gn/Y+sqB83GHZYju80CgYABFm4KbbBcW+1RKv9WSBtK",
        "gVIagV/89moWLa/uuLmtApyEqZSfn5mAHqdc0+f8c2/Pl9KHh50u99zfKv8AsHfH",
        "TtjuVAvZg10GcZdTQ/I41ruficYL0gpfZ3haVWWxNl+J47di4iapXPxeGWtVA+u8",
        "eH1cvgDRMFWCgE7nUFzE8wKBgGndUomfZtdgGrp4ouLZk6W4ogD2MpsYNSixkXyW",
        "64cIbV7uSvZVVZbJMtaXxb6bpIKOgBQ6xTEH5SMpenPAEgJoPVts816rhHdfwK5Q",
        "8zetklegckYAZtFbqmM0xjOI6bu5rqwFLWr1xo33jF0wDYPQ8RHMJkruB1FIB8V2",
        "GxvNAoGBAM4g2z8NTPMqX+8IBGkGgqmcYuRQxd3cs7LOSEjF9hPy1it2ZFe/yUKq",
        "ePa2E8osffK5LBkFzhyQb0WrGC9ijM9E6rv10gyuNjlwXdFJcdqVamxwPUBtxRJR",
        "cYTY2HRkJXDdtT0Bkc3josE6UUDvwMpO0CfAETQPto1tjNEDhQhT",
        "-----END RSA PRIVATE KEY-----"
    ]
}
```

> `usage`: "encipherment" | "verify" | "issue"

The purpose of the certificate, the default value is `"encipherment"`.

* `"encipherment"`: The certificate is used for TLS authentication and encryption.
* `"verify"`: The certificate is used to verify the remote TLS certificate. When using this option, the current certificate must be a CA certificate.
* `"issue"`: The certificate is used to issue other certificates. When using this option, the current certificate must be a CA certificate.

:::tip
On the Windows platform, a self-signed CA certificate can be installed in the system to verify the remote TLS certificate.
:::

:::tip
When there is a new client request, assuming that the specified `serverName` is `"v2ray.com"`, V2Ray will first look for a certificate that can be used for `"v2ray.com"` from the certificate list. If it is not found, then Use any `usage` to issue a certificate for `"v2ray.com"` with a certificate for `"issue"`, valid for one hour. And add the new certificate to the certificate list for subsequent use.
:::

> `certificateFile`: string

The path of the certificate file, if it is generated using OpenSSL, the extension is .crt.

:::tip
Use `v2ctl cert -ca` to generate a self-signed CA certificate.
:::

> `certificate`: \[ string \]

A string array representing the content of the certificate, the format is as shown in the sample. Choose one of `certificate` and `certificateFile`.

> `keyFile`: string

The path of the key file, if generated using OpenSSL, the suffix is .key. Currently, key files that require a password are not supported.

> `key`: \[ string \]

An array of strings, representing the key content, the format is as shown in the example. Choose one of `key` and `keyFile`.

When `certificateFile` and `certificate` are specified at the same time, V2Ray preferentially uses `certificateFile`. The same goes for `keyFile` and `key`.

:::tip
When `usage` is `"verify"`, both `keyFile` and `key` can be empty.
:::

## SockoptObject

```json
{
    "mark": 0,
    "tcpFastOpen": false,
    "tcpFastOpenQueueLength": 4096,
    "tproxy": "off",
    "tcpKeepAliveInterval": 0,
    "bindToDevice": "eth0",
    "mptcp": false
}
```

> `mark`: number

An integer. When its value is non-zero, mark SO_MARK on the outbound connection.

* Only applicable to Linux systems.
* Requires CAP_NET_ADMIN permission.

> `tcpFastOpen`: true | false

Whether to enable [TCP Fast Open](https://zh.wikipedia.org/wiki/TCP%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80). When its value is `true`, TFO is forcibly turned on; when its value is `false`, TFO is forcibly turned off; when this item does not exist, the system default setting is used. Can be used for inbound and outbound connections.

* Only available in the following versions (or later versions) of the operating system:
  * Windows 10 (1604)
  * Mac OS 10.11 / iOS 9
  * Linux 3.16: The system is turned on by default and no configuration is required.
  * FreeBSD 10.3

> `tcpFastOpenQueueLength`: number

[TCP Fast Open](https://zh.wikipedia.org/wiki/TCP%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80) queue length for inbound connections. Default value is `4096`. Only available in Linux. (v4.43.0+)

> `tproxy`: "redirect" | "tproxy" | "off"

Whether to enable transparent proxy (only for Linux).

* `"redirect"`: Transparent proxy using Redirect mode. Only TCP/IPv4 and UDP connections are supported.
* `"tproxy"`: Use TProxy mode transparent proxy. Supports TCP and UDP connections.
* `"off"`: Turn off the transparent proxy.

Transparent proxy requires Root or CAP\_NET\_ADMIN authority.

:::tip
When `followRedirect` is specified in [Dokodemo-door](protocols/dokodemo.md) and `sockopt.tproxy` is empty, the value of `sockopt.tproxy` will be set to `"redirect"`.
:::

> `tcpKeepAliveInterval`: number

The interval in seconds between sending TCP keep-alive packets (only for Linux). (v4.39.0+)

0 means keep the default value.

> `bindToDevice`: string

Bind the connection to the specified network device (Linux: v5.0.6+, Windows/Darwin: v5.2.0+).

> `mptcp`: true | false

Whether to enable Multipath TCP (only for Linux).

* `true`: MPTCP is turned on. If the host on the other side doesn't support MPTCP, MPTCP will fall back to using TCP.
* `false`: MPTCP is turned off.

When this item does not exist, the system default setting is used. Can be used for inbound and outbound connections.
