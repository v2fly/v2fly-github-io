# Dokodemo-door

* Name: `dokodemo-door`
* Type: Inbound Protocol

Dokodemo door (any door) is an inbound data protocol. It can listen to a local port and send all data entering this port to a port of the designated server, so as to achieve the effect of port mapping.

## InboundConfigurationObject

```json
{
    "address": "8.8.8.8",
    "port": 53,
    "network": "tcp",
    "timeout": 0,
    "followRedirect": false,
    "userLevel": 0
}
```

> `address`: address

Forward traffic to this address. It can be an IP address, like `"1.2.3.4"`, or a domain name, like `"v2ray.com"`. String type.

When `followRedirect` (see below) is `true`, `address` can be empty.

> `port`: number

Forward traffic to the specified port of the destination address, range \[1, 65535\], numeric type. Required parameters.

> `network`: "tcp" | "udp" | "tcp,udp"

The type of network protocol that can be received. For example, when it is specified as `"tcp"`, any gate will only receive TCP traffic. The default value is `"tcp"`.

> `timeout`: number

The time limit for inbound data (seconds), the default value is 300.

After V2Ray 3.1 is equivalent to the `connIdle` strategy corresponding to the user level

> `followRedirect`: true | false

When the value is `true`, dokodemo-door will recognize the data forwarded by iptables and forward it to the corresponding destination address. For details, see the `tproxy` setting in [Transport Configuration](../transport.md).

> `userLevel`: number

User level, all connections will use this user level.

## Transparent proxy configuration example

Add a dokodemo-door inbound protocol in V2Ray:

```json
{
    "network": "tcp,udp",
    "timeout": 30,
    "followRedirect": true
}
```

Configure iptables:

```bash
# Create new chain
iptables -t nat -N V2RAY
iptables -t mangle -N V2RAY
iptables -t mangle -N V2RAY_MARK

# Ignore your V2Ray server's addresses
# It's very IMPORTANT, just be careful.
iptables -t nat -A V2RAY -d 123.123.123.123 -j RETURN

# Ignore LANs and any other addresses you'd like to bypass the proxy
# See Wikipedia and RFC5735 for full list of reserved networks.
iptables -t nat -A V2RAY -d 0.0.0.0/8 -j RETURN
iptables -t nat -A V2RAY -d 10.0.0.0/8 -j RETURN
iptables -t nat -A V2RAY -d 127.0.0.0/8 -j RETURN
iptables -t nat -A V2RAY -d 169.254.0.0/16 -j RETURN
iptables -t nat -A V2RAY -d 172.16.0.0/12 -j RETURN
iptables -t nat -A V2RAY -d 192.168.0.0/16 -j RETURN
iptables -t nat -A V2RAY -d 224.0.0.0/4 -j RETURN
iptables -t nat -A V2RAY -d 240.0.0.0/4 -j RETURN

# Anything else should be redirected to Dokodemo-door's local port
iptables -t nat -A V2RAY -p tcp -j REDIRECT --to-ports 12345

# Add any UDP rules
ip route add local default dev lo table 100
ip rule add fwmark 1 lookup 100
iptables -t mangle -A V2RAY -p udp --dport 53 -j TPROXY --on-port 12345 --tproxy-mark 0x01/0x01
iptables -t mangle -A V2RAY_MARK -p udp --dport 53 -j MARK --set-mark 1

# Apply the rules
iptables -t nat -A OUTPUT -p tcp -j V2RAY
iptables -t mangle -A PREROUTING -j V2RAY
iptables -t mangle -A OUTPUT -j V2RAY_MARK
```
