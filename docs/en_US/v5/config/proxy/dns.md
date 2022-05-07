# DNS

## DNS Outbound
* Name: `dns`
* Type: Outbound Protocol
* ID: `outbound.dns`

DNS is an outbound protocol to intercept and forward DNS queries.
It can only accept DNS traffic(including TCP and UDP based DNS).
Other protocols will not be processed.

The DNS requests will be sent to built-in [DNS Server](../dns.md) if it is requesting for an IP(A or AAAA),
other queries will not be intercepted and thus send to the origin server as is.