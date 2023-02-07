# Stream

```json
{
  "transport":"tcp",
  "transportSettings":{},
  "security":"none",
  "securitySettings":{}
}
```

> `transport`: name of `<transport>`

> `transportSettings`: settings of `<transport>`

> `security`: name of `<security>`

It has to be one of supported Security Protocol.

> `securitySettings`: settings of `<security>`

> `socketSettings`: [SocketConfigObject](#SocketConfigObject)

### Supported Streams

* [WebSocket](stream/websocket.md)
* [mKCP](stream/kcp.md)
* [tcp](stream/tcp.md)

## TLS
* Name: `tls`
* Type: Security Protocol
* ID: `security.tls`

> `serverName`: string

The server name indication domain name for TLS connection.

> `nextProtocol` : [string]

The ALPN for TLS connections.

> `disableSystemRoot`: true | false

Whether system level Certificate Authority Store should be trusted.

> `pinnedPeerCertificateChainSha256` : [string]  

Pinned Peer Certificate Chain SHA256 Hash. Should be represented in base64 format.

> `certificate`: [[CertificateObject](#CertificateObject)]


# CertificateObject

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


## uTLS
* Name: `utls`
* Type: Security Protocol
* ID: `security.utls`

uTLS is a fork of TLS aimed at trying to imitate the client hello fingerprint of popular TLS implementation to hide the client identity of a Go language program. (v5.2.0+)

It is only supports client mode and in certain transports. If you use it in a context where it is not supported,  the process will crash.

uTLS is supported in the following transports:
- TCP
- WebSocket

When you are using uTLS in some transport, the APLN will be overridden for its correct function.  It may be a slightly different fingerprint than specified.

> `tlsConfig`: [TLSConfig](#TLS)

The Embedded TLS Setting for uTLS connections. Only some of its field are effective.

Supported Fields:
- Certificate Authority Settings (allowInsecure is ignored)

> `imitate`: string

The TLS client fingerprint to use for the uTLS connection.

- `randomized`
- `randomizedalpn`
- `randomizednoalpn`
- `firefox_auto`
- `firefox_55`
- `firefox_56`
- `firefox_63`
- `firefox_65`
- `firefox_99`
- `firefox_102`
- `firefox_105`
- `chrome_auto`
- `chrome_58`
- `chrome_62`
- `chrome_70`
- `chrome_72`
- `chrome_83`
- `chrome_87`
- `chrome_96`
- `chrome_100`
- `chrome_102`
- `ios_auto`
- `ios_11_1`
- `ios_12_1`
- `ios_13`
- `ios_14`
- `android_11_okhttp`
- `edge_auto`
- `edge_85`
- `edge_106`
- `safari_auto`
- `safari_16_0`
- `360_auto`
- `360_7_5`
- `360_11_0`
- `qq_auto`
- `qq_11_1`

> `noSNI`: bool

Do not send Server Name Indication in the client hello. This may result in failed connection.

> `forceAlpn` : "TRANSPORT_PREFERENCE_TAKE_PRIORITY" | "NO_ALPN" | "UTLS_PRESET"

Controls data source for Application-Layer Protocol Negotiation (ALPN) extension. You can use this setting to make connect resemble the imitated program better. In correct setting will result in connection failure. (v5.3.0+)

- `TRANSPORT_PREFERENCE_TAKE_PRIORITY` : Default value. If user have set an ALPN at TLS setting, use that. Otherwise the default from transport will be used.
- `NO_ALPN` : Do not send ALPN TLS extension.
- `UTLS_PRESET`: Use value from uTLS template.
