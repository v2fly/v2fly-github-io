# QUIC

QUIC stands for Quick UDP Internet Connection, which is a specification proposed by Google that utilizes UDP for multiplexed concurrent transmissions. Its main advantages are:

1. Reduces handshake latency (1-RTT or 0-RTT)
2. Multiplexing without issues from TCP blocking
3. Connection migration (primarily for the client). When switching between different network interfaces (such as WiFi to cellular), the transport won't disconnect.

## Version History

Since v4.7:
* QUIC support added.
* Default settings:
  * 12-byte Connection ID
  * Automatically disconnect after 30 seconds without data transmission (may affect long-lived tunnels)

## QuicObject

`QuicObject` corresponds to the `quicSettings` item in the transport configuration. The configurations of the host and client must be identical, otherwise the connection will fail.

QUIC requires TLS. If TLS is not enabled already, V2Ray will self-sign a cryptographic certificate. When using QUIC as the active transport, VMess encryption can be disabled to reduce overhead.

```json
{
    "security": "none",
    "key": "",
    "header": {
        "type": "none"
    }
}
```

> `security`: "none" | "aes-128-gcm" | "chacha20-poly1305"

Encryption algorithm. The default value is `"none"`.

This encryption is directly applied QUIC packets, preventing packet inspection after encryption.

> `key`: string

The key used for encryption. Can be any string. Valid when `security` is not set to `"none"`.

> `header`: [HeaderObject](#headerobject)

Packet header obfuscation settings (see [HeaderObject](#HeaderObject))

## HeaderObject

```json
{
    "type": "none"
}
```

> `type`: string

Obfuscation type, optional values:

* `"none"`: The default value, no obfuscation, unmodified UDP data stream.
* `"srtp"`: Disguised as an SRTP data stream, used in some video call protocols (such as FaceTime).
* `"utp"`: Disguised as uTP data stream, normally used in the BitTorrent protocol.
* `"wechat-video"`: Disguised as a WeChat video call data stream.
* `"dtls"`: Disguised as a DTLS 1.2 data packet.
* `"wireguard"`: Disguised as a WireGuard data stream (but doesn't use the actual protocol).

:::tip
When encryption and obfuscation are both turned off, QUIC packets are sent without modification, which can be fed into other QUIC tools. To avoid detection, it is recommended to turn on at least one of either encryption or obfuscation.
:::
