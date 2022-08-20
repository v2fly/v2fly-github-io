# mKCP

mKCP uses UDP to simulate a TCP connection, sacrificing bandwidth in exchange for reduced latency. This generally consumes more traffic than plain TCP. Ensure that any firewall configurations on the host is correct before deploying.

## KcpObject

`KcpObject` corresponds to the `kcpSettings` element in the transport configuration.

```json
{
    "mtu": 1350,
    "tti": 20,
    "uplinkCapacity": 5,
    "downlinkCapacity": 20,
    "congestion": false,
    "readBufferSize": 1,
    "writeBufferSize": 1,
    "header": {
        "type": "none"
    },
    "seed": "Password"
}
```

> `mtu`: number

Maximum transmission unit (MTU) to use. Recommended range is between `576` and `1460`. The default value is `1350`.

> `tti`: number

The transmission time interval (TTI), in milliseconds (ms). mKCP will send data at this frequency. Recommended range is between `10` and `100`. The default value is `50`.

> `uplinkCapacity`: number

The uplink capacity, or the maximum bandwidth used by the host to send data, in MB/s. The default value `5`. Note that Bytes are used instead of Bits. It can be set to `0`, which means that the host will try to maintain a connection using the least amount of bandwidth it can consume.

> `downlinkCapacity`: number

The downlink capacity, or the maximum bandwidth used by the host to receive data, in MB/s. The default value `20`. Note that Bytes are used instead of Bits. It can be set to `0`, which means that the host will try to maintain a connection using the least amount of bandwidth it can consume.

:::tip
`uplinkCapacity` and `downlinkCapacity` determines the overall bandwidth of mKCP. Generally, the smaller of the two values becomes the effective bottleneck. For cases where clients are sending the bulk of the data, it is recommended to set `downlinkCapacity` to a large value, such as 100 MB/s, and `uplinkCapacity` to the actual connection speed. If the transport bandwidth is insufficient, gradually increase the value of `uplinkCapacity` up to about twice the actual connection bandwidth.
:::

> `congestion`: true | false

Whether congestion control is enabled. The default value is `false`. When congestion control is enabled, V2Ray automatically monitors the connection quality. If packet loss is severe, throughput is automatically decreased, and restored when network conditions return to normal.

> `readBufferSize`: number

The read buffer size of a single connection, in MB. The default value is `2`.

> `writeBufferSize`: number

The write buffer size of a single connection, in MB. The default value is `2`.

:::tip
`readBufferSize` and `writeBufferSize` specifies the amount of memory used by a single connection. If high bandwidth is needed, specifying a larger `readBufferSize` and `writeBufferSize` will improve the throughput to some extent, but it will also use more memory. If the bandwidth per client is less than 20MB/s, the default value of 1 MB will suffice; for higher effective bandwidths, you can manually tune the settings of the buffers and up/downlink capacities as needed.
:::

> `header`: [HeaderObject](#headerobject)

Packet header obfuscation parameters, see [HeaderObject](#HeaderObject).

> `seed`: string

(Since v4.24.2) An optional obfuscation key. V2Ray uses the AES-128-GCM algorithm to further encrypt traffic data. The client and server need to have symmetrical keys to connect. Enabling this setting will write "NewAEADAESGCMBasedOnSeed Used" to the log. This obfuscation mechanism CANNOT be used to ensure the confidentiality of communications on its own, but it may be able to resist censorship to some extent, though tests during development have found that this transport does not tend to be censored even without obfuscation enabled.

## HeaderObject

```json
{
    "type": "none"
}
```

> `type`: string

Obfuscation type. Possible values:

* `"none"`: The default value, no obfuscation, unmodified UDP data stream.
* `"srtp"`: Disguised as an SRTP data stream, used in some video call protocols (such as FaceTime).
* `"utp"`: Disguised as uTP data stream, normally used in the BitTorrent protocol.
* `"wechat-video"`: Disguised as a WeChat video call data stream.
* `"dtls"`: Disguised as a DTLS 1.2 data packet.
* `"wireguard"`: Disguised as a WireGuard data stream (but doesn't use the actual protocol).

## Acknowledgments

* [@skywind3000] (https://github.com/skywind3000) invented and implemented the KCP protocol.
* [@xtaci] (https://github.com/xtaci) translated KCP from C to Go.
* [@xiaokangwang] (https://github.com/xiaokangwang) tested the integration of KCP and V2Ray and submitted the initial PR.

## Improvements to the KCP Protocol

### Smaller Protocol Header

The original KCP implementation used a fixed 24-byte header, while mKCP modifies it to 18-byte for data packets and 16-byte for acknowledgement (ACK) packets. A smaller header helps to avoid deep packet inspection and minimize network footprint.

In addition, each KCP acknowledgement packet can only confirm that one data packet has been received. That is, when KCP needs to acknowledge that 100 data packets have been received, it will send 24 \* 100 = 2400 bytes of UDP data, including lots of duplicate header data, resulting in wasted bandwidth. mKCP will compress multiple acknowledgement packets together; 100 acknowledgement packets now only require 16 + 2 + 100 \* 4 = 418 bytes, which is one-sixth compared to the original implementation.

### Acknowledgement Packet Retransmission

The acknowledgement (ACK) packet of the original KCP protocol is only sent once. If the acknowledgement packet is lost, data retransmission is necessitated, resulting in wasted bandwidth. mKCP resends the acknowledgement packet at a certain frequency until the sender also acknowledges. The size of a single acknowledgement packet is 22 bytes, which is much smaller than a data packet of generally more than 1000 bytes.

### Connection Status Control

mKCP can effectively close connections. When the remote host actively closes the connection, the connection will be released within two seconds; when the remote host is disconnected (timing out), the connection will be released within 30 seconds at most.

The original KCP did not support this scenario.
