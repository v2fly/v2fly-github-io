# KCP(mKCP)

mKCP constructs a TCP like stream tunnel based on a UDP connection.
Please make sure firewall rules have been set up correctly.
mKCP consumes additional traffic to transfer data with less delay
and may consume for traffic than TCP based transport.

## mKCP Stream Transport
* Name: `kcp`
* Type: Transport Protocol
* ID: `stream.kcp`

> `seed`: string

The encryption seed for traffic obfuscator. Need to be the same on both sides.

> `mtu`: number

Maximum transmission unit. This value is typically between  `576` - `1460`. It is  `1350` by default.

> `tti`: number

Transmission time interval in a millisecond.
mKCP will send data at this frequency.
Please choose a value between `10` - `100`.
It is `50` by default.

> `uplinkCapacity`: number

Upload bandwidth capacity.
The maximum speed to send data in MB/s.
It is `5` by default.
Beware it is Byte, not Bit.
You can set it to `0` for very low bandwidth.

> `downlinkCapacity`: number

Download bandwidth capacity.
The maximum speed to receive data in MB/s.
It is `20` by default.
Beware it is Byte, not Bit.
You can set it to `0` for very low bandwidth.

:::tip
`uplinkCapacity` and `downlinkCapacity` decide the transfer speed of mKCP.
In the client uplink's case, the client's  `uplinkCapacity` determines the speed packets are sent,
and the server side's  `downlinkCapacity` determines the speed server receives the traffic.
and the lower one will be the effective one.
It is recommended to set  `downlinkCapacity` to a relatively large value,
like 100, and set  `uplinkCapacity` to the actual network speed.
If the speed is insufficient, one may increase the value of  `uplinkCapacity`
, until 2 times the actual bandwidth.
:::

> `congestion`: true | false

Whether congestion control is enabled. It is `false` by default.
This will instruct V2Ray to decrease transfer speed if there is too much packet loss.

> `readBufferSize`: number

The read buffer size of a single connection, in MB.
It is `2` by default.

> `writeBufferSize`: number

The write buffer size of a single connection, in MB.
It is `2` by default.

:::tip
`readBufferSize` and `writeBufferSize` determine the memory usage of a connection.
If transfer speed is the priority,
one may set a higher `readBufferSize` and `writeBufferSize`,
to increase transfer speed at the cost of higher memory usage.
If the network speed is less than 20 MB/s, the default value should
sufficient. Otherwise, increase `readBufferSize` and `writeBufferSize`'s
and balance the memory usage and transfer speed manually.
:::
