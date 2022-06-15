# Dokodemo-door

* Name: `dokodemo-door`
* Type: Inbound Protocol

Dokodemo Door is an inbound protocol. It binds to a port and send all data entering this port to a designated address, effectively achieving inbound port forwarding / port mapping.

:::tip
To reroute outbound traffic as well, combine Dokodemo Door with a [Loopback](loopback.md) inbound.
:::


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

> `address`: string

Forwards traffic to this target address. Accepts IP addresses, such as `"1.2.3.4"`, or a domain name, such as `"v2ray.com"`.

If `followRedirect` is enabled, `address` can be omitted.

> `port`: number

Forward traffic to the specified port of the destination address, with a range of \[1, 65535\]. Required.

> `network`: "tcp" | "udp" | "tcp,udp"

The type of inbound traffic which can be received. The unselected protocol will be rejected. The default value is `"tcp"`.

> `timeout`: number

The timeout / TTL for inbound data in seconds. The default value is 300.

Since v3.1, this is equivalent to the `connIdle` strategy, corresponding to the User Level.

> `followRedirect`: true | false

When enabled, Dokodemo Door will recognize any destinations specified by `iptables`, and forward it to the corresponding mapped address. For details, see the `tproxy` setting in [Transport Configuration](../transport.md).

> `userLevel`: number

User Level. All inbound connections will use this User Level. See [Local Policy](../policy.md).

## Example: Transparent proxy

```json
{
    "network": "tcp,udp",
    "timeout": 30,
    "followRedirect": true
}
```

Configure `iptables`:

```bash
# Create new chain
iptables -t nat -N V2RAY
iptables -t mangle -N V2RAY
iptables -t mangle -N V2RAY_MARK

# Ignore your V2Ray server's addresses
# This is VERY IMPORTANT, be careful!
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

# Apply rules
iptables -t nat -A OUTPUT -p tcp -j V2RAY
iptables -t mangle -A PREROUTING -j V2RAY
iptables -t mangle -A OUTPUT -j V2RAY_MARK
```
