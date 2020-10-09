# DNS Server

V2Ray built a DNS Server, it has two main usages: match routing rules based on the resolved IP of the domain name, and like the traditional DNS function, resolve the target address to connect.

The DNS query request sent by the DNS server will be automatically forwarded according to the routing configuration, without additional configuration.

:::tip
Due to the complexity of the DNS protocol, V2Ray only supports the most basic IP queries (A and AAAA record). It is recommended to use local DNS with an additional DNS server for DNS query to fully-feature your DNS service, like [CoreDNS](https://coredns.io/)
:::

:::warning
caution: in `outbound` of `freedom` protocol, `domainStrategy` defaults to `AsIs`, will not use this DNS server to resolve address. If you need to use it, it should be configured as `UseIP`.
:::

## DNS Procedure

When a domain name list specified by a DNS server matches the domain name currently being queried, V2Ray will use this DNS server first for query, or query from top to bottom, and only return a list of IPs matching expectIPs.

Diagram of the server of DNS Procedure is as follows:

![](/dns_flowchart.svg)

## DnsObject

`DnsObject` pairs to the item `dns` in configuration.

```json
{
    "hosts": {
        "baidu.com": "127.0.0.1"
    },
    "servers": [
        {
            "address": "1.2.3.4",
            "port": 5353,
            "domains": [
                "domain:v2ray.com"
            ],
            "expectIPs": [
                "geoip:cn"
            ]
        },
    "8.8.8.8",
    "8.8.4.4",
    "localhost"
    ],
    "clientIp": "1.2.3.4",
    "tag": "dns_inbound"
}
```

> `hosts`: map{string: address}

Static IP list, its value is a series of "domain name": "address", "address" can be IP or domain name. When resolving a domain name, if the domain name matches an item in this list, when the address of the item is an IP, the resolution result will be the IP of the item, and the following servers will not be used for resolution; when the address of the item is  When it is a domain name, this domain name will be used for IP resolution instead of the original domain name.

The domain name format has the following forms:

 * Plain string: When this domain name completely matches the target domain name, the rule takes effect.  For example, "v2ray.com" matches "v2ray.com" but not "www.v2ray.com".
 * Regular expression: Start with `"regexp:"`, and the rest is a regular expression.  When this regular expression matches the target domain name, the rule takes effect.  For example, "regexp:\\\\.goo.*\\\\.com$" matches "www.google.com" and "fonts.googleapis.com" but not "google.com".
 * Subdomain (recommended): Start with `"domain:"`, and the rest is a domain name.  This rule takes effect when the domain name is the target domain name or its subdomain name.  For example, "domain:v2ray.com" matches "www.v2ray.com", "v2ray.com", but not "xv2ray.com".
 * Substring: Start with `"keyword:"`, and the rest is a string.  When this string matches any part of the target domain name, the rule takes effect.  For example, "keyword:sina.com" can match "sina.com", "sina.com.cn" and "www.sina.com" but not "sina.cn".
 * List of predefined domain names: Start with `"geosite:"`, and the rest is a name, such as `geosite:google` or `geosite:cn`.  For the name and domain name list, please refer to [Predefined Domain Name List](routing.md#dlc).

> `servers`: \[string | [ServerObject](#serverobject) \]

A list of DNS servers supports two types: DNS address (string format) and [ServerObject](#serverobject).

 * When its value is a DNS IP address, such as `"8.8.8.8"`, V2Ray will use port 53 of this address for DNS query.

 * When the value is `"localhost"`, it means the machine's preset DNS configuration is used.

 * When the value is in the form of `"https://host:port/dns-query"`, such as `"https://dns.google/dns-query"`, V2Ray will use `DNS over HTTPS` (RFC8484, short for  DOH) to query.  Some service providers have certificates for IP aliases and can write IP directly, such as `https://1.1.1.1/dns-query`.  You can also use non-standard ports and paths, such as `"https://a.b.c.d:8443/my-dns-query"` (4.22.0+)

 * When the value is in the form of `"https+local://host:port/dns-query"`, such as `"https+local://dns.google/dns-query"`, V2Ray will use `DOH local mode`  For query, that is, DOH requests will not go through Routing/Outbound and other components, but directly request externally to reduce time-consuming.  Generally suitable for use on the server side.  Non-standard ports and paths can also be used. (4.22.0+)

:::tip
When using `localhost`, the DNS request of this machine is not controlled by V2Ray, and additional configuration is needed to make DNS request forwarded by V2Ray.

The DNS clients initialized by different rules will be reflected in the V2Ray startup log with the ʻinfo` level, such as `local DOH`, `remote DOH` and ʻudp` etc. modes.  (4.22.0+)
:::

> `clientIp`: string

The IP address of the current system is used to inform the server of the location of the client during DNS query.  It cannot be a private address.

> `tag`: string

(V2Ray 4.13+) The query traffic sent by this DNS, except for `localhost` and `DOHL_` modes, will carry this identifier, which can be matched with ʻinboundTag` in the routing.

## ServerObject

```json
{
    "address": "1.2.3.4",
    "port": 5353,
    "domains": [
        "domain:v2ray.com"
    ],
    "expectIPs": [
        "geoip:cn"
    ]
}
```

> `Address`: address

 DNS server address, such as `"8.8.8.8"`.  For ordinary DNS IP addresses that only support UDP protocol DNS servers, if the address is in the form of a URL beginning with `"https://"` or `"https+local://"`, DOH mode is used, and the rules are the same as strings  DOH configuration of the mode.

 > `port`: number

 DNS server port, such as `53`.  This item defaults to `53` by default.  When using DOH mode, this item is invalid, non-standard port should be specified in URL.

 > `domains`: \[string\]

 A list of domain names. The domain names contained in this list will be queried by this server first.  The domain name format is the same as in [Routing Configuration](routing.md#ruleobject).

 > `ExpectIPs`:\[string\]

 (V2Ray 4.22.0+) An IP range list, the format is the same as in [Routing Configuration](routing.md#ruleobject).

 When this option is configured, V2Ray DNS will verify the returned IP and only return the addresses in the expectIPs list.

 If this item is not configured, the IP address will be returned as it is.
