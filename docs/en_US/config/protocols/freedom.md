# Freedom

* Name: `freedom`
* Type: Outbound Protocol

Freedom is an outbound protocol. It forwards any normal TCP or UDP traffic directly without modification (unless configured otherwise).

## OutboundConfigurationObject

```json
{
    "domainStrategy": "AsIs",
    "redirect": "127.0.0.1:3366",
    "userLevel": 0
}
```

> `domainStrategy`: "AsIs" | "UseIP" | "UseIPv4" | "UseIPv6"

If the target address is a domain name, Freedom can attempt a connection directly to this domain name (`"AsIs"`), or first resolve the domain name to an IP before establishing a connection (`"UseIP"`, `"UseIPv4"` and `"UseIPv6" `). This will use the [built-in DNS](../dns.md). The default value is `"AsIs"`.

(Since v4.6) If the `"UseIP"` mode is enabled and the `sendThrough` option is specified in [Outbound Connection Configuration](../overview.md#outboundobject), Freedom will automatically determine the type of Internet Protocol required based on the value of `sendThrough`, IPv4 or IPv6.

(Since v4.7) When `"UseIPv4"` or `"UseIPv6"` is enabled, Freedom will only use a corresponding IPv4 or IPv6 address. If `sendThrough` specifies a local address which does not match, the connection will fail.

> `redirect`: address_port

Freedom will force all data to be redirected to the specified remote address and/or port (instead of the address specified by the inbound protocol). The value is an address as a string: `"127.0.0.1:80"`, `":1234"`, etc. If the address is not specified, Freedom will not modify the original target address. If the port is set to 0, such as `"v2ray.com:0"`, Freedom will not modify the original port.

> `userLevel`: number

User Level. All connections will use this User level. See [Local Policy](../policy.md).
