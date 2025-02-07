# Mux.Cool Protocol

Mux.Cool protocol is a multiplexing transport protocol used to transmit multiple independent data streams within a single established data stream.

## Version

Current version is 1 Beta.

## Dependencies 

### Underlying Protocol

Mux.Cool must run on top of an established reliable data stream.

## Communication Process

A Mux.Cool connection can transmit multiple sub-connections, each with an independent ID and state. The transmission process consists of frames, with each frame transmitting data for a specific sub-connection.

### Client Behavior

When a connection is needed and no existing connections are available, the client initiates a new connection to the server, referred to as the "main connection".

1. A main connection can be used to send multiple sub-connections. The client can independently determine the number of sub-connections the main connection can carry.
2. For a new sub-connection, the client must send a `New` state to notify the server to establish the sub-connection, then use the `Keep` state to transmit data.
3. When a sub-connection ends, the client sends an `End` state to notify the server to close the sub-connection.
4. The client can decide when to close the main connection but must ensure the server maintains the connection simultaneously.
5. The client can use the KeepAlive state to prevent the server from closing the main connection.

### Server Behavior

When the server receives a new sub-connection, it should handle it as a normal connection.

1. Upon receiving an `End` state, the server can close the upstream connection to the target address.
2. In server responses, the same ID as the request must be used to transmit sub-connection data.
3. The server cannot use the `New` state.
4. The server can use the KeepAlive state to prevent the client from closing the main connection.

## Transport Format

Mux.Cool uses a symmetric transport format, meaning clients and servers send and receive data in the same format.

### Frame Format

| 2 bytes | L bytes | X bytes |
|---------|---------|---------|
| Metadata Length L | Metadata | Extra Data |

### Metadata

Metadata has several types, distinguished by state S. All metadata types include ID and Opt fields:

* ID: Unique identifier for the sub-connection
* Opt:
  * D(0x01): Has extra data

When option Opt(D) is enabled, the extra data format is:

| 2 bytes | L bytes |
|---------|---------|
| Length L | Data |

#### New Sub-connection (New)

| 2 bytes | 1 byte | 1 byte | 1 byte | 2 bytes | 1 byte | X bytes |
|---------|---------|---------|---------|---------|---------|---------|
| ID | 0x01 | Option Opt | Network Type N | Port | Address Type T | Address A |

Where:

* Network Type N:
  * 0x01: TCP, indicating sub-connection traffic should be sent to target as TCP
  * 0x02: UDP, indicating sub-connection traffic should be sent to target as UDP
* Address Type T:
  * 0x01: IPv4
  * 0x02: Domain name
  * 0x03: IPv6
* Address A:
  * When T = 0x01: 4-byte IPv4 address
  * When T = 0x02: 1-byte length (L) + L-byte domain name
  * When T = 0x03: 16-byte IPv6 address

When creating a new sub-connection with Opt(D) enabled, the frame's data must be sent to the target host.

#### Keep Sub-connection (Keep)

| 2 bytes | 1 byte | 1 byte |
|---------|---------|---------|
| ID | 0x02 | Option Opt |

When keeping a sub-connection with Opt(D) enabled, the frame's data must be sent to the target host.

#### Close Sub-connection (End)

| 2 bytes | 1 byte | 1 byte |
|---------|---------|---------|
| ID | 0x03 | Option Opt |

When closing a sub-connection with Opt(D) enabled, the frame's data must be sent to the target host.

#### Keep Connection (KeepAlive)

| 2 bytes | 1 byte | 1 byte |
|---------|---------|---------|
| ID | 0x04 | Option Opt |

For keep-alive:

* When Opt(D) is enabled, the frame's data must be discarded
* ID can be a random value

## Application

The Mux.Cool protocol is independent of the underlying protocol and can theoretically use any reliable stream connection to transmit Mux.Cool protocol data.

In destination-oriented protocols like Shadowsocks and VMess, a specified address must be included when establishing a connection. For compatibility, the Mux.Cool protocol specifies the address as "v1.mux.cool". When the main connection's target address matches this, forwarding proceeds in Mux.Cool mode; otherwise, traditional forwarding is used.
