# DNS Server

V2Ray has a built-in DNS server, which has two main purposes: matching routing rules according to the IP resolved from a domain, and traditional DNS function—resolving the target address to connect.

:::tip
Due to the complexity of DNS protocol, V2Ray only supports basic IP query function (A and AAAA records). In order to have a complete DNS experience, you may want to use an dedicated DNS serverware, such as [CoreDNS](https://coredns.io), together with V2Ray's builtin DNS features.
:::

:::warning
For `outbound`s with `freedom` protocol, the default value of `domainStrategy` is `AsIs`, therefore the DNS settings will not be applied to this outbound by default. If necessary, it should be configured as`UseIP`.
:::

## DNS processing flow

When a domain name list assigned by a DNS server matches the domain name currently being queried, V2Ray will use this DNS server first, otherwise, it will query from top to bottom, and only return the IP list which matches expectIPs. The processing flow diagram of the DNS server is as follows:

![](/dns_flowchart_20210418.svg)

## DnsObject

`DnsObject` corresponds to the `dns` field of the configuration file.

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

Static IP list, its value is a series of "domain name": "address". The address can be an IP or domain name. When resolving a domain name, if the domain name matches an item in this list when the address of the item is an IP, the resolution result is the IP of the item, and the following servers are not used for resolution; when the address is a domain name, this domain name will be used for IP resolution instead of the original domain name.

The domain name format has the following forms:

* Pure string: When this domain name completely matches the target domain name, the rule takes effect. For example, "v2ray.com" matches "v2ray.com" but not "www.v2ray.com".
* Regular expression: Start with `"regexp:"`, and the rest is a regular expression. When this regular expression matches the target domain name, the rule takes effect. For example, "regexp:\\\\.goo.*\\\\.com$" matches "www.google.com" and "fonts.googleapis.com" but not "google.com".
* Subdomain (recommended): Start with `"domain:"`, and the rest part is a domain name. This rule takes effect when the domain name is the target domain name or its subdomain name. For example, "domain:v2ray.com" matches "www.v2ray.com", "v2ray.com", but not "xv2ray.com".
* Substring: Start with `"keyword:"`, and the rest part is a string. When this string matches any part of the target domain name, the rule takes effect. For example, "keyword:sina.com" can match "sina.com", "sina.com.cn" and "www.sina.com" but not "sina.cn".
* List of predefined domain names: Start with `"geosite:"`, and the rest is a name, such as `geosite:google` or `geosite:cn`. For the name and domain name list, please refer to [Predefined Domain Name List](routing.md#dlc).

>`servers`: \[string | [ServerObject](#serverobject) \]

A list of DNS servers, supporting two types: DNS address (string format) and [ServerObject](#serverobject). When its value is a DNS IP address, such as `"8.8.8.8"`, V2Ray will use port 53 of this address for DNS query.

When the value is `"localhost"`, it means the machine's preset DNS configuration is used. When the value is in the form of `"https://host:port/dns-query"`, such as `"https://dns.google/dns-query"`, V2Ray will use `DNS over HTTPS` (RFC8484, short for DOH) to query. Some service providers have certificates of IP aliases, then you can write IP format directly, such as `https://1.1.1.1/dns-query`. You can also use non-standard ports and paths, such as `"https://a.b.c.d:8443/my-dns-query"` (4.22.0+).

When the value is in the form of `"https+local://host:port/dns-query"`, such as `"https+local://dns.google/dns-query"`, V2Ray will use `DOH local mode` for queries, that is, DOH requests will not go through Routing/Outbound and other components, but directly request externally to improve timing. Generally suitable for use on the server side. Non-standard ports and paths can also be used. (4.22.0+)

:::tip
When using `localhost`, the DNS request of this machine is not controlled by V2Ray, and additional configuration is needed to make DNS request forwarded by V2Ray.

The DNS clients initialized by different rules will be reflected in the V2Ray startup log with an `info` level, such as `local DOH`, `remote DOH` and `udp` and other modes. (4.22.0+)
:::

> `clientIp`: string

The IP address of the current system. It is used to inform server the client's location during DNS queries. It cannot be a private address.

> `tag`: string

(V2Ray 4.13+) The query traffic sent by this DNS, except `localhost` and `DOHL_` modes, will carry this identifier, which can be matched with `inboundTag` in the routing.

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

> `address`: address

DNS server address, such as `"8.8.8.8"`. For ordinary DNS IP addresses that only support the UDP protocol DNS server, if the address is in the form of a URL beginning with `"https://"` or `"https+local://"`, DOH mode is used, and the rules are the same as DOH configuration in string mode.

> `port`: number

DNS server port, such as `53`. This item defaults to `53` by default. When using DOH mode, this item is invalid, non-standard port should be specified in URL.

> `domains`: \[string\]

A list of domain names. The domain names contained in this list will be queried by this server first. The domain name format is the same as it in [Routing Configuration](routing.md#ruleobject).

> `expectIPs`:\[string\]

(V2Ray 4.22.0+) A list of IP ranges, the format is the same as it in [route configuration](routing.md#ruleobject).

When this option is configured, V2Ray DNS will verify the returned IP and only return addresses in the expectIPs list.

If this item is not configured, the IP address will be returned as it is.
