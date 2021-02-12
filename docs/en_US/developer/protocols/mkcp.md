# mKCP Protocol

mKCP is a streaming transport protocol modified from the [KCP](https://github.com/skywind3000/kcp) protocol, it can transfer any data stream in order.

## Version

mKCP has no version number, compatibility between versions are not guaranteed.

## Dependencies

### Base Protocol

mKCP is based on the UDP protocol, all communications use UDP.

### Functions

* fnv: [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) hash function
  * Input is a string with variable length;
  * Output is an unsigned 32-bit integer;

## Communcation Procedure

1. mKCP splits data stream into many small packets. Each data stream has a unique identifier for classification. Each packet has the same unique indentifier with its parent data stream.
1. mKCP has no handshake procedure. When a packet is received, its data stream unique identifier will be used to determine whether it is a new connection or a existing connection.
1. Each data packet includes many segments. There are three types of segment: data, ack and ping. Each segment needs to be processed individually.

## Data Format

### Data Packet

| 4 Bytes | 2 Bytes | L Bytes |
|---------|----------|--------|
| Authentication Info A| Length L | Segments Section S|

其中：

* A = fnv(S), big endian;
* Segment sections may include multiple segments;

### Data Segment

| 2 Bytes | 1 Bytes  | 1 Bytes | 4 Bytes  | 4 Bytes  | 4 Bytes         | 2 Bytes | L Bytes |
|---------|--------|--------|-------- |---------|----------------|--------|----------|
|Identifier Id|Command Cmd|Options Opt|Timestamp Ts|Serial Number Sn|Unconfirmed Serial Number Usn|Length L|Data      |

Definition:
* Identifier Id: mKCP data stream identifier
* Command Cmd: constant 0x01
* Options Opt: values:
  * 0x00: empty
  * 0x01: all data transfered
* Timestamp Ts: time when the packet is sent at remote，big endian
* Serial Number Sn: the position of the segment in the data stream, the serial number of the initial segment is 0, increase 1 on each segment afterwards
* Unconfirmed Serial Number Una: smallest unconfirmed Serial Number remote host is currently sending

### ACK Segment

| 2 Bytes | 1 Bytes  | 1 Bytes | 4 Bytes  | 4 Bytes          | 4 Bytes  | 2 Bytes | L * 4 Bytes |
|---------|--------|--------|---------|-----------------|---------|--------|--------------|
|Identifier Id|Command Cmd|Options Opt|Window Wnd |Next Serial Number Sn|Timestamp Ts|Length L|Received Serial Numbers|

Definition:
* Identifier Conv: mKCP data stream identifier
* Command Cmd: constant 0x00
* Options Opt: same as above
* Window Wnd: largest acceptable serial number of the remote host
* Next Serial Number Sn: smallest serial number that remote host hasn't receive.
* Timestamp Ts: timestamp of the newest segment remote host received, can be used to calculate latency
* Received Serial Numbers: each with length of 4 bytes, implies that the cooresponding data of that Serial Number is received

P.S.:

* Remote host looks forward to receive data within the range of Nsn and Wnd

### Ping Segment

| 2 Bytes | 1 Bytes  | 1 Bytes | 4 Bytes          | 4 Bytes          | 4 Bytes  |
|---------|--------|--------|-----------------|-----------------|---------|
|Identifier Conv|Command Cmd|Options Opt|Unconfirmed Serial Number Una |Next Serial Number Sn|Latency Lat |

Definition:

* Identifier Id: mKCP data stream identifier
* COmmand Cmd: values:
  * 0x02: connection forcibly closed by the remote host
  * 0x03: normal ping
* Options Opt: same as above
* Unconfirmed Serial Number Usn: Usn of the same segment
* Next Serial Number Nsn: Nsn of the same segment
* Latency Lat: latency calculated by the remote host

