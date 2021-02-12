# Freedom

* Name: `freedom`
* Type: Outbound Protocol

Freedom is an outbound protocol that can be used to send (normal) TCP or UDP data to any network.

## OutboundConfigurationObject

```json
{
    "domainStrategy": "AsIs",
    "redirect": "127.0.0.1:3366",
    "userLevel": 0
}
```

> `domainStrategy`: "AsIs" | "UseIP" | "UseIPv4" | "UseIPv6"

When the target address is a domain name, Freedom can send a connection directly to this domain name (`"AsIs"`), or resolve the domain name to an IP before establishing a connection (`"UseIP"`, `"UseIPv4"` and `"UseIPv6" `). The step of resolving IP will use V2Ray [built-in DNS](../dns.md). The default value is `"AsIs"`.

(V2Ray 4.6+) When the `"UseIP"` mode is used and the `sendThrough` is specified in [Outbound Connection Configuration](../overview.md#outboundobject), Freedom will automatically determine the location based on the value of `sendThrough` The type of IP required, IPv4 or IPv6.

(V2Ray 4.7+) When using `"UseIPv4"` or `"UseIPv6"` mode, Freedom will only use the corresponding IPv4 or IPv6 address. When `sendThrough` specifies a local address that does not match, the connection will fail.

> `redirect`: address_port

Freedom will force all data to be sent to the specified address (instead of the address specified by the inbound protocol). The value is a string, example: `"127.0.0.1:80"`, `":1234"`. When the address is not specified, such as `":443"`, Freedom will not modify the original target address. When the port is `0`, such as `"v2ray.com: 0"`, Freedom will not modify the original port.

> `userLevel`: number

User level, all connections will be this level.
