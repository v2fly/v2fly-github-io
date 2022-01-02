# Stream

```json
{
  "transport":"tcp",
  "transportSettings":{},
  "security":"none",
  "securitySettings":{}
}
```

> `transport`: name of <transport>

> `transportSettings`: settings of <transport>

> `security`: name of <security>

> `securitySettings`: settings of <security>

> `socketSettings`: [SocketConfigObject](#SocketConfigObject)

### Supported Streams

* [WebSocket](stream/websocket.md)
* [mKCP](stream/kcp.md)
* [tcp](stream/tcp.md)

## TLS
security.tls

> `serverName`: string

The server name indication domain name for TLS connection.

> `nextProtocol` : [string]

The ALPN for TLS connections.

> `disableSystemRoot`: true | false

Whether system level Certificate Authority Store should be trusted.

> `pinnedPeerCertificateChainSha256` : [string]  

Pinned Peer Certificate Chain SHA256 Hash. Should be represented in base64 format.

> `certificate`: [CertificateObject](#CertificateObject)


#CertificateObject

> `usage` : string

The purpose of the certificate.

* `"ENCIPHERMENT"`: The certificate is used for TLS authentication and encryption.
* `"AUTHORITY_VERIFY"`: The certificate is used to verify the remote TLS certificate. When using this option, the current certificate must be a CA certificate.
* `"AUTHORITY_VERIFY_CLIENT"`: : The certificate is used to verify the remote TLS client certificate. When using this option, the current certificate must be a CA certificate.
* `"AUTHORITY_ISSUE"`: The certificate is used to issue other certificates. When using this option, the current certificate must be a CA certificate.

> `Certificate`: string

The Certificate file in PEM format.

> `Key`: string

The Certificate private key file in PEM format.

> `certificateFile`: string

The path for the Certificate file.

> `keyFile`: string

The path for the Certificate private key file.
