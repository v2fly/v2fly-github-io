# VLite

VLite is a packet acceleration, protection, stabilization, and forwarding protocol.

It is designed for UDP based traffic with a focus on Peer to Peer applications. It does not support TCP traffic proxying.

:::tip
Use router to send only UDP Packet Addr traffic to VLite. Example is shown below:
```
"router": {
    "domainStrategy": "AsIs",
    "rule": [
      {
        "tag": "vlite",
        "domain": [
          {
            "type":"RootDomain",
            "value": "packet-addr.v2fly.arpa"
          }
        ]
      }
    ]
  }
```
:::

## VLite UDP Outbound
* Name: `vliteu`
* Type: Outbound Protocol
* ID: `outbound.vliteu`

> `address`: string

The server address.

> `port`: number

The server port number.

> `password`: string

The password. Need to be same on corresponding server.

> `scramblePacket`: true | false

Whether to enable packet scrambling. Need to be the same on the corresponding server.

This will hide the data packet's DTLS signature so that looks like unknown traffic once the handshake is finished.

> `enableFec`: true | false

Whether to enable forward error correction. Need to be the same on the corresponding server.

This will instruct vlite to consume more traffic to compensate for packet loss.

> `enableStabilization`: true | false

Whether to enable unified connection stabilization. Need to be the same on the corresponding server.

This will instruct vlite to stabilise connections actively by reincarnating broken connections by connecting to the server again and recovering connection status when the connection is interrupted.

> `enableRenegotiation`: true | false

Whether to enable unified connection stabilization protocol renegotiation. Need to be the same on the corresponding server.

This will instruct vlite to stabilise by renegotiating stateful protocols while keeping underlying payload connections intact.

> `handshakeMaskingPaddingSize`: number

Whether to mask unified connection stabilization handshake so it appears as random data. Recommended to be the same on the corresponding server.

Write a number to define the packet length to pad the handshake message to.

## VLite UDP Inbound
* Name: `vliteu`
* Type: Inbound Protocol
* ID: `inbound.vliteu`

> `password`: string

The password. Need to be same on corresponding client.

> `scramblePacket`: true | false

Whether to enable packet scrambling. Need to be the same on the corresponding client.

This will hide the data packet's DTLS signature so that looks like unknown traffic once the handshake is finished.

> `enableFec`: true | false

Whether to enable forward error correction. Need to be the same on the corresponding client.

This will instruct vlite to consume more traffic to compensate for packet loss.

> `enableStabilization`: true | false

Whether to enable unified connection stabilization. Need to be the same on the corresponding client.

This will instruct vlite to stabilise connections actively by reincarnating broken connections by connecting to the server again and recovering connection status when the connection is interrupted.

> `enableRenegotiation`: true | false

Whether to enable unified connection stabilization protocol renegotiation. Need to be the same on the corresponding client.

This will instruct vlite to stabilise by renegotiating stateful protocols while keeping underlying payload connections intact.

> `handshakeMaskingPaddingSize`: number

Whether to mask unified connection stabilization handshake so it appears as random data. Recommended to be the same on the corresponding client.

Write a number to define the packet length to pad the handshake message to.
