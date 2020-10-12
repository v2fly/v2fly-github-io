# DNS

* Name: `dns`
* Type: Outbound Protocol

DNS is an outbound protocol, mainly used to intercept and forward DNS queries. This outbound protocol can only receive DNS traffic (including queries based on UDP and TCP protocols), and other types of traffic will cause errors.

When processing DNS queries, this outbound protocol will forward IP queries (ie A and AAAA) to the built-in [DNS server] (../dns.md). Other types of query traffic will be forwarded to their original destination address.

DNS outbound protocol was introduced in V2Ray 4.15.

## OutboundConfigurationObject

```json
{
    "network": "tcp",
    "address": "1.1.1.1",
    "port": 53
}
```

> `network`: "tcp" | "udp"

(V2Ray 4.16+) Modify the transport layer protocol of DNS traffic. The optional values are `"tcp"` and `"udp"`. When not specified, the transmission mode of the source remains unchanged.

> `address`: address

(V2Ray 4.16+) Modify the DNS server address. When not specified, keep the address specified in the source unchanged.

> `port`: number

(V2Ray 4.16+) Modify the DNS server port. When not specified, keep the port specified in the source unchanged.
