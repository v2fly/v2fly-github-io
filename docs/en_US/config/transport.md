# Transport

The transport layer is the current V2Ray node and the way to dock with other nodes. The transport layer provides a stable data transmission channel. Usually, the two ends of a network connection need to have a symmetrical transport mode. For example, if one end uses WebSocket, then the other end must also use WebSocket, otherwise the connection cannot be established.

The transport layer configuration is divided into two parts, one is the global setting ([TransportObject](#transportobject)), and the other is the protocol-specific configuration ([StreamSettingsObject](#streamsettingsobject)). The protocol-specific configuration can specify how each separate inbound and outbound protocol is transported. Usually, the client and server corresponding to the outbound and inbound protocols need to use the same transport mode. When the protocol-specific transport configuration specifies a transport mode, but does not fill in its settings, this transport mode will use the settings in the global configuration.

## TransportObject

`TransportObject` corresponds to the `transport` item in the configuration file.

```json
{
    "tcpSettings": {},
    "kcpSettings": {},
    "wsSettings": {},
    "httpSettings": {},
    "quicSettings": {},
    "dsSettings": {},
    "grpcSettings": {}
}
```

> `tcpSettings`: [TcpObject](transport/tcp.md)

Configuration for TCP connections.

> `kcpSettings`: [KcpObject](transport/mkcp.md)

Configuration for mKCP connections.

> `wsSettings`: [WebSocketObject](transport/websocket.md)

Configuration for WebSocket connections.

> `httpSettings`: [HttpObject](transport/h2.md)

Configuration for HTTP/2 connections.

> `quicSettings`: [QuicObject](transport/quic.md)

Configuration for QUIC connections.

> `dsSettings`: [DomainSocketObject](transport/domainsocket.md)

Configuration for Domain Socket connections.

> `grpcSettings`: [grpcObject](transport/grpc.md)

Configuration for gRPC connections. (v4.36.0+)

## StreamSettingsObject

`StreamSettingsObject` corresponds to the `streamSettings` item in the inbound and outbound protocols. Each inbound and outbound connection can have different transport configurations, and can set `streamSettings` to do some transport configuration.

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
    "grpcSettings": {},
    "sockopt": {
        "mark": 0,
        "tcpFastOpen": false,
        "tcpFastOpenQueueLength": 4096,
        "tproxy": "off",
        "tcpKeepAliveInterval": 0
    }
}
```

> `network`: "tcp" | "kcp" | "ws" | "http" | "domainsocket" | "quic" | "grpc"

The network type used by the data stream, the default value is `"tcp"`

> `security`: "none" | "tls"

Whether to enable transport layer encryption, supported options are `"none"` (default value), `"tls"` indicates using [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security).

> `tlsSettings`: [TLSObject](#tlsobject)

TLS configuration. TLS is provided by Golang and supports TLS 1.3, but does not support DTLS.

> `tcpSettings`: [TcpObject](transport/tcp.md)

The TCP configuration of the current connection, only when this connection uses TCP. The configuration is the same as the global configuration above.

> `kcpSettings`: [KcpObject](transport/mkcp.md)

The mKCP configuration of the current connection, only when this connection uses mKCP. The configuration is the same as the global configuration above.

> `wsSettings`: [WebSocketObject](transport/websocket.md)

The WebSocket configuration of the current connection, only when this connection uses WebSocket. The configuration is the same as the global configuration above.

> `httpSettings`: [HttpObject](transport/h2.md)

The HTTP/2 configuration of the current connection, only when this connection uses HTTP/2. The configuration is the same as the global configuration above.

> `quicSettings`: [QUICObject](transport/quic.md)

The QUIC configuration of the current connection, only when this connection uses QUIC. The configuration is the same as the global configuration above.

> `dsSettings`: [DomainSocketObject](transport/domainsocket.md)

The Domain socket configuration of the current connection, only when this connection uses Domain socket. The configuration is the same as the global configuration above.

> `grpcSettings`: [grpcObject](transport/grpc.md)

The gRPC configuration of the current connection, only when this connection uses gRPC. The configuration is the same as the global configuration above.

> `sockopt`: [SockoptObject](#sockoptobject)

Configuration used for transparent proxy.


## TLSObject

```json
{
    "serverName": "v2ray.com",
    "alpn": [
        "h2",
        "http/1.1"
    ],
    "allowInsecure": false,
    "disableSystemRoot": false,
    "certificates": [],
    "verifyClientCertificate": false,
    "pinnedPeerCertificateChainSha256": ""
}
```

> `serverName`: string

Specifies the domain name of the server certificate. It is useful when the target connection is established by IP. When the target connection is specified by domain name, for example, when the domain name is received during Socks inbound, or when the domain name is detected by Sniffing function, this domain name will be automatically used for `serverName`, without manual configuration.

> `alpn`: \[ string \]

An array of strings that specifies the ALPN value during the TLS handshake. The default value is `["h2", "http/1.1"]`.

> `allowInsecure`: true | false

Whether to allow insecure connections (for clients only). The default value is `false`. When the value is `true`, V2Ray will not check the validity of the TLS certificate provided by the remote host.

> `disableSystemRoot`: true | false

（V2Ray 4.18+）Whether to disable the CA certificate that comes with the operating system. The default value is `false`. When the value is `true`, V2Ray will only use the certificates specified in `certificates` for TLS handshake. When the value is `false`, V2Ray will only use the CA certificate that comes with the operating system for TLS handshake.

> `certificates`: \[ [CertificateObject](#certificateobject) \]

A list of certificates, each of which represents a certificate (fullchain recommended).

> `pinnedPeerCertificateChainSha256`: \[ string \]

The SHA256 hash of the remote server's certificate chain, represented in standard encoding format. After setting, the hash of the remote server's certificate chain must be one of the values in the list. (v4.38.0+)
<!--
This value can be calculated by the certChainHash tool of V2Ray's v2ctl tool according to the server's certificate chain file (generally called fullchain.pem according to management). If there is no intermediate certificate (such as a self-signed certificate), the hash of the certificate chain is the same as the hash of the certificate itself.-->

When the connection fails due to this policy, the certificate chain hash will be displayed. It is not recommended to use this method to obtain the certificate chain hash value, because in this case you do not have the opportunity to verify that the certificate provided by the server at this time is a real certificate.

> `verifyClientCertificate`: true | false

Perform client certificate authentication when connecting. After this option is turned on, the client will need to configure the client certificate to connect to the server side. (4.42.0+)
The client certificate must be issued by the client certificate issuing authority configured by the program. The CA certificate that comes with the system and the CA certificate that is used to authenticate the server side will not be trusted automatically.

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

> `usage`: "encipherment" | "verify" | "issue" | "verifyclient"

The purpose of the certificate, the default value is `"encipherment"`.

* `"encipherment"`: The certificate is used for TLS authentication and encryption.
* `"verify"`: The certificate is used to verify the remote TLS certificate. When this option is used, the current certificate must be a CA certificate.
* `"issue"`: The certificate is used to issue other certificates. When this option is used, the current certificate must be a CA certificate.
* `"verifyclient"`: The CA certificate used to verify the client's identity. When this option is used, the current certificate must be a CA certificate. (4.42.0+)

:::tip
On Windows platforms, you can install a self-signed CA certificate into the system to verify the remote TLS certificate.
:::

:::tip
When there is a new client request, assuming that the specified `serverName` is `"v2ray.com"`, V2Ray will first look for a certificate that can be used for `"v2ray.com"` in the certificate list, and if it is not found, any certificate with `usage` as `"issue"` will be used to issue a certificate for `"v2ray.com"` with a validity period of one hour. The new certificate will be added to the certificate list for future use.
:::

> `certificateFile`: string

The path of the certificate file, such as generated by OpenSSL, with a .crt suffix.

:::tip
Use `v2ctl cert -ca` to generate a self-signed CA certificate.
:::

> `certificate`: \[ string \]

An array of strings that represent the contents of the certificate, in the format shown in the example. `certificate` and `certificateFile` are mutually exclusive.

> `keyFile`: string

The path of the key file, such as generated by OpenSSL, with a .key suffix. Currently, key files that require a password are not supported.

> `key`: \[ string \]

An array of strings that represent the contents of the key, in the format shown in the example. `key` and `keyFile` are mutually exclusive.

When both `certificateFile` and `certificate` are specified, V2Ray uses `certificateFile` first. `keyFile` and `key` are the same.

:::tip
When `usage` is `"verify"`, `keyFile` and `key` can be empty.
:::

## SockoptObject

```json
{
    "mark": 0,
    "tcpFastOpen": false,
    "tcpFastOpenQueueLength": 4096,
    "tproxy": "off",
    "tcpKeepAliveInterval": 0
}
```

> `mark`: number

An integer. When its value is non-zero, it marks SO_MARK on the outgoing connection.

* Only available on Linux systems.
* Requires CAP_NET_ADMIN permissions.

> `tcpFastOpen`: true | false

Whether to enable [TCP Fast Open](https://zh.wikipedia.org/wiki/TCP%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80). When its value is `true`, TFO is forced to be turned on; when its value is `false`, TFO is forced to be turned off; when this option does not exist, the system default is used. It can be used for inbound and outbound connections.

* Only available on the following (or later) versions of the operating system:
  * Windows 10 (1604)
  * Mac OS 10.11 / iOS 9
  * Linux 3.16: The system is enabled by default and does not need to be configured.
  * FreeBSD 10.3

> `tcpFastOpenQueueLength`: number

The [TCP Fast Open](https://zh.wikipedia.org/wiki/TCP%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80) queue length of the inbound connection, the default value is `4096`, only available on Linux (v4.43.0+).

> `tproxy`: "redirect" | "tproxy" | "off"

Whether to enable transparent proxy (only available on Linux).

* `"redirect"`: Use the transparent proxy in Redirect mode. Supports TCP and UDP connections.
* `"tproxy"`: Use the transparent proxy in TProxy mode. Supports TCP and UDP connections.
* `"off"`: Disable transparent proxy.

Transparent proxy requires Root or CAP_NET_ADMIN permissions.

:::tip
When [Dokodemo-door](protocols/dokodemo.md) specifies `followRedirect`, and `sockopt.tproxy` is empty, the value of `sockopt.tproxy` is set to `"redirect"`.
:::

> `tcpKeepAliveInterval`: number

The interval at which TCP keeps active data packets alive, in seconds (only available on Linux). (v4.39.0+)

0 represents the default value.
