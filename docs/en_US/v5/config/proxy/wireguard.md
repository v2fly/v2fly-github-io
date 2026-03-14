# WireGuard

WireGuard is an outbound protocol that sends proxied traffic through a userspace WireGuard tunnel. (v5.48.0+)

The current V2Ray implementation is outbound only. It creates a virtual network stack inside V2Ray, then sends TCP and UDP traffic through the configured WireGuard peer.

:::warning
In the current implementation:

* `settings.listenOnSystemNetwork` must be `true`.
* `settings.wgDevice` is required.
* `settings.stack` is required.
* `settings.wgDevice.peers[].endpoint` should be a literal `IP:port` or `[IPv6]:port`.
:::

## WireGuard Outbound

* Name: `wireguard`
* Type: Outbound Protocol
* ID: `outbound.wireguard`

### Structure

```json
{
  "wgDevice": {
    "privateKey": "",
    "mtu": 0,
    "peers": [
      {
        "publicKey": "",
        "presharedKey": "",
        "allowedIps": [],
        "endpoint": "",
        "persistentKeepaliveInterval": 0
      }
    ]
  },
  "stack": {
    "mtu": 0,
    "ips": [],
    "routes": [],
    "preferIpv6ForUdp": false,
    "dualStackUdp": false
  },
  "listenOnSystemNetwork": true,
  "domainStrategy": "USE_IP"
}
```

### Fields

> `wgDevice`: [DeviceObject](#deviceobject)

WireGuard device settings. This field is required.

> `stack`: [StackObject](#stackobject)

Virtual network stack settings. This field is required for WireGuard outbound.

> `listenOnSystemNetwork`: boolean

Create the underlying UDP socket on the system network. In the current implementation this must be `true`.

> `domainStrategy`: `"USE_IP"` | `"USE_IP4"` | `"USE_IP6"`

Controls how destination domains are resolved in this outbound's TCP dial path.

This field is separate from the top-level outbound `domainStrategy` in [OutboundObject](../outbound.md). The WireGuard settings use protobuf enum names such as `"USE_IP"`, not `"UseIP"`.

Use `"USE_IP"`, `"USE_IP4"`, or `"USE_IP6"` when the target is a domain name, because the gVisor dialer used by this outbound needs an IP address before dialing.

This field is not used by the current UDP path. If a UDP destination is still a domain name when it reaches this outbound, it is not supported. 

## TCP Happy Eyeballs

For TCP connections, when this outbound resolves a domain name to multiple IP addresses, it uses a Happy Eyeballs style racing dialer.

The current implementation works as follows:

* It is only used on the TCP path.
* It is only used when the WireGuard outbound itself resolves the destination domain through `settings.domainStrategy`.
* A separate dial attempt is created for each resolved IP address.
* The first successful TCP connection wins.
* If both IPv4 and IPv6 addresses are present, the current implementation prefers IPv6. IPv6 attempts start immediately, and IPv4 attempts start 300 ms later.
* If all resolved addresses are from the same family, there is no head start delay and all attempts start immediately.
* Extra successful connections that lose the race are closed.

The outer outbound `domainStrategy` in [OutboundObject](../outbound.md) runs before the WireGuard proxy code. If that outer layer already resolves the destination to a single IP address, the WireGuard outbound receives an IP directly and this Happy Eyeballs logic is skipped.

## DeviceObject

### Structure

```json
{
  "privateKey": "",
  "mtu": 0,
  "peers": []
}
```

### Fields

> `privateKey`: string

The local WireGuard private key, encoded as a base64 string. This is the same format used by standard WireGuard tools such as `wg genkey`.

For a usable client configuration, this field should be set.

> `mtu`: number

MTU for the WireGuard device. In most cases it should match `stack.mtu`.

> `peers`: \[ [PeerObject](#peerobject) \]

Remote WireGuard peers.

For a usable client configuration, define at least one peer.

## PeerObject

### Structure

```json
{
  "publicKey": "",
  "presharedKey": "",
  "allowedIps": [],
  "endpoint": "",
  "persistentKeepaliveInterval": 0
}
```

### Fields

> `publicKey`: string

The peer public key, encoded as a base64 string.

If this field is empty, the peer entry is ignored by the current implementation.

> `presharedKey`: string

Optional preshared key, encoded as a base64 string.

> `allowedIps`: \[ string \]

The CIDR ranges routed to this peer in the WireGuard device configuration.

This field is especially important when there are multiple peers. The WireGuard device uses the destination address of each packet to decide which peer should receive it, based on these CIDR ranges.

For a single-peer full-tunnel client, this is typically `["0.0.0.0/0", "::/0"]`. For split routing or multi-peer setups, assign only the subnets that should go to that specific peer.

> `endpoint`: string

The peer endpoint in `IP:port` form, or `[IPv6]:port` for IPv6.

For a normal client configuration, this field should be set.

> `persistentKeepaliveInterval`: number

Persistent keepalive interval in seconds. A value such as `25` is commonly used when the client is behind NAT.

## StackObject

The `stack` object configures the virtual TCP/IP stack that V2Ray uses inside the WireGuard tunnel.

### Structure

```json
{
  "mtu": 0,
  "ips": [
    {
      "ipAddr": "",
      "prefix": 0
    }
  ],
  "routes": [
    {
      "ipAddr": "",
      "prefix": 0
    }
  ],
  "preferIpv6ForUdp": false,
  "dualStackUdp": false,
  "socketSettings": {},
  "enablePromiscuousMode": false,
  "enableSpoofing": false,
  "tcpListener": []
}
```

### Fields

> `mtu`: number

MTU for the virtual stack. In most cases it should match `wgDevice.mtu`.

> `ips`: \[ [CIDRObject](#cidrobject) \]

The local tunnel IP addresses assigned to this client.

These are the addresses that exist on the virtual interface inside V2Ray. In a normal client configuration, use the addresses assigned by the WireGuard server or peer.

> `routes`: \[ [CIDRObject](#cidrobject) \]

Routes installed into the virtual stack.

For a full-tunnel client, use default routes such as `0.0.0.0/0` and `::/0`. For a split-tunnel client, list only the subnets that should go through WireGuard.

> `preferIpv6ForUdp`: boolean

Prefer IPv6 when both IPv4 and IPv6 are available for UDP.

> `dualStackUdp`: boolean

Enable dual-stack UDP handling inside the virtual stack.

> `socketSettings`: object

Optional socket settings for the virtual stack.

In the current implementation, only `rxBufSize` and `txBufSize` are applied.

> `enablePromiscuousMode`: boolean

Enable promiscuous mode on the virtual NIC inside the gVisor stack.

This is passed directly to the stack NIC with `SetPromiscuousMode`. It is an advanced option and is usually not needed for a normal client setup.

> `enableSpoofing`: boolean

Enable IP spoofing on the virtual NIC inside the gVisor stack.

This is passed directly to the stack NIC with `SetSpoofing`. It is an advanced option and is usually not needed for a normal client setup.

> `tcpListener`: \[ [TCPListenerObject](#tcplistenerobject) \]

Advanced option for exposing TCP listeners on the virtual stack.

Each listener opens a TCP port on the gVisor stack. Accepted connections are then forwarded to the outbound specified by that listener's `tag`, using the listener's local stack address and port as the forwarded destination.

This is mainly useful for specialized internal routing or virtual network topologies. It is usually not needed for a normal client setup.

## TCPListenerObject

### Structure

```json
{
  "address": {
    "ipAddr": ""
  },
  "port": 0,
  "tag": ""
}
```

### Fields

> `address`: [ListenerAddressObject](#listeneraddressobject)

The local stack address to listen on.

The current implementation uses only the `ipAddr` value of this object when creating the listener.

> `port`: number

The TCP port to listen on inside the virtual stack.

> `tag`: string

The outbound tag used to forward accepted connections.

## ListenerAddressObject

### Structure

```json
{
  "ipAddr": ""
}
```

### Fields

> `ipAddr`: string

The local IP address to listen on inside the virtual stack.

This object is used by `tcpListener.address`. Unlike [CIDRObject](#cidrobject), it does not use a prefix length.

## CIDRObject

### Structure

```json
{
  "ipAddr": "",
  "prefix": 0
}
```

### Fields

> `ipAddr`: string

IP address of the CIDR block.

> `prefix`: number

Prefix length of the CIDR block.

## Example

The following example sends all traffic through a single WireGuard peer.

```json
{
  "outbounds": [
    {
      "protocol": "wireguard",
      "tag": "wg-out",
      "settings": {
        "wgDevice": {
          "privateKey": "wYZ9AK9e418AUhqoXiGSSn+G5XdZzKyEGwLRpXUjHtM=", // replace with your private key
          "mtu": 1420,
          "peers": [
            {
              "publicKey": "wRaPC0mJWDNkD49zr+OH8zuHoavmQV3fDt57xMzy9uk=", // replace with the peer public key
              "presharedKey": "IoGHxUuE93FlkYp8S08vgy9zLxVocHeHcgo4L38TvSk=", // optional
              "endpoint": "198.51.100.10:51820",
              "allowedIps": ["0.0.0.0/0", "::/0"],
              "persistentKeepaliveInterval": 25
            }
          ]
        },
        "stack": {
          "mtu": 1420,
          "ips": [
            {"ipAddr": "10.64.0.2", "prefix": 32},
            {"ipAddr": "fd00::2", "prefix": 128}
          ],
          "routes": [
            {"ipAddr": "0.0.0.0", "prefix": 0},
            {"ipAddr": "::", "prefix": 0}
          ],
          "dualStackUdp": true
        },
        "listenOnSystemNetwork": true,
        "domainStrategy": "USE_IP"
      }
    }
  ]
}
```

## Notes

* `wgDevice.peers[].allowedIps` describes what the peer owns inside WireGuard.
* `stack.routes` describes what traffic V2Ray should send into the WireGuard tunnel.
* In a simple client configuration these two sets usually match, but they are not the same field and should not be confused.
* If you only use IPv4, remove the IPv6 addresses and routes from both `allowedIps` and `stack`.
* `settings.domainStrategy` is used by this outbound's TCP path. For UDP destinations that may still be domain names, use the outer outbound `domainStrategy` with values such as `"UseIP"`, `"UseIP4"`, or `"UseIP6"`.

(This document is machine generated, and checked by author.)
