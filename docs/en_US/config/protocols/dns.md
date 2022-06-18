# DNS

* Name: `dns`
* Type: Outbound Protocol

DNS is an outbound protocol. It is primarily used to intercept and forward DNS queries. This outbound protocol can only receive DNS traffic (including both UDP and TCP queries), and other types of traffic will cause errors.

When processing DNS queries, this outbound protocol will forward IP queries (A and AAAA records) to the built-in [DNS server](../dns.md). Other types of queries will be forwarded to their original destination address.

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

(Since v4.16) Optionally modify the transport layer protocol of DNS traffic. Possible values are `"tcp"` or `"udp"`.

> `address`: address

(Since v4.16) Optionally override the destination DNS server address for all queries.

> `port`: number

(Since v4.16) Optionally override the destination DNS server port for all queries.
