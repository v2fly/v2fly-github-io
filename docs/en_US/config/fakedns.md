# "Fake" DNS server

## FakeDnsObject

`FakeDnsObject` corresponds to the `fakedns` item of the configuration file. (4.35.0+)

```json
{
    "ipPool": "240.0.0.0/8",
    "poolSize": 65535
}
```

> `ipPool`: string: CIDR

The "Fake" DNS server's allocated IP address space. The address assigned by the virtual DNS server will conform to this CIDR expression.

> `poolSize`: number

The number of IP-domain mappings memorized by the "fake" DNS server.

## "Fake" DNS server mechanism

The "Fake" DNS server will return a fictitious resolution result whose IP address in its own `ipPool` is the domain name and remember the relationship between the domain name and the fictitious resolution result.

When the client program requests to connect to the host pointed to by this IP based on this analysis result, the `fakedns` traffic detection module corresponding to [inbounds] (inbounds.md) will restore the target address to the corresponding domain name.




