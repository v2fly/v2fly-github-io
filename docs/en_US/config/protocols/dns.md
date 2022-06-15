# DNS

* Name: `dns`
* Type: Outbound Protocol

DNS is an outbound protocol. It is primarily used to intercept and forward DNS queries. This outbound protocol can only receive DNS traffic (including both UDP and TCP queries), and other types of traffic will cause errors.

When processing DNS queries, this outbound protocol will forward IP queries (A and AAAA) to the built-in [DNS server](../dns.md). Other types of queries will be forwarded to their original destination address.

The DNS outbound protocol was first introduced in V2Ray v4.15.

## OutboundConfigurationObject

```json
{
    "network": "tcp",
    "address": "1.1.1.1",
    "port": 53
}
```

> `network`: "tcp" | "udp"

(Since v4.16) Modify the transport layer protocol of DNS traffic. The optional values are `"tcp"` and `"udp"`. When not specified, the transmission mode of the original request is unchanged.

> `address`: address

(Since v4.16) Modify the DNS server address. When not specified, the destination address of the original request is unchanged.

> `port`: number

(Since v4.16) Modify the DNS server port. When not specified, the destination port of the original request is unchanged.
