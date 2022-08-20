# DNS Server

V2Ray has a built-in DNS server, which has two main purposes: matching routing rules according to the IP resolved from a domain, and traditional DNS function — resolving DNS records.

:::tip
Due to the complexity of the DNS protocol, V2Ray only supports basic IP query function (A and AAAA records). In order to provide complete DNS features, you may want to use a dedicated local DNS server, such as [CoreDNS](https://coredns.io), together with V2Ray's builtin DNS features.
:::

:::warning
For `outbound`s using the `freedom` protocol, the default value of `domainStrategy` is `AsIs`, therefore the DNS settings will not be applied to this outbound by default. If necessary, it should be configured as `UseIP`.
:::

## Supported DNS protocols and routing strategies

- DNS over **UDP**: The query is routed to a configuration-specified outbound
  - In the form of an IP address, such as `8.8.8.8`
  - The query is made on port `53` by default, but non-standard ports are supported
- DNS over **TCP**: The query is routed to a configuration-specified outbound
  - In the form of `tcp://host:port`, such as `tcp://8.8.8.8:53`
  - The query is made on port `53` by default, but non-standard ports are supported
  - Available since v4.40.0
- DNS over **TCP local mode**: The query is not rerouted, but instead directly forwarded through a `freedom` outbound
  - In the form of `tcp+local://host:port`, such as `tcp+local://8.8.8.8:53`
  - The query is made on port `53` by default, but non-standard ports are supported
  - Available since v4.40.0
- DNS over **HTTPS**: The query is routed to a configuration-specified outbound
  - In the form of `https://host:port/dns-query`, such as `https://dns.google/dns-query` or `https://1.1.1.1/dns-query`
  - The query is made on port `443` by default, but non-standard ports and links are supported, such as `https://a.b.c.d:8443/my-dns-query`
  - Available since v4.22.0
- DNS over **HTTPS local mode**: The query is not rerouted, but instead directly forwarded through a `freedom` outbound
  - In the form of `https+local://host:port/dns-query`, such as `https+local://223.5.5.5/dns-query`
  - The query is made on port `443` by default, but non-standard ports and links are supported, such as `https+local://a.b.c.d:8443/my-dns-query`
  - Available since v4.22.0
- DNS over **QUIC local mode**: The query is not rerouted, but instead directly forwarded through a `freedom` outbound
  - In the form of `quic+local://host`, such as `quic+local://dns.adguard.com`
  - The query is made on port `784` by default, but non-standard ports are supported
  - As of September 20, 2021, public recursive DNS services that support the DNS over QUIC protocol include `dns.adguard.com` and `dns.nextdns.io` (in addition to port 784, queries can also be made on port 8853)
  - Available since v4.34.0
- Special Options:
  - **localhost**: Uses the DNS configuration of the server's operating system
  - **FakeDNS**: Uses the built-in FakeDNS server in V2Ray. For details, see [FakeDNS server](fakedns.md). Available since v4.35.0

:::tip
When using `localhost`, the DNS requests on the local machine are not controlled by V2Ray. Additional configuration is required to forward DNS requests with V2Ray.
:::

:::warning
If you are using DNS over QUIC on a Linux device, you may need to adjust the receive buffer size. The following command sets it to 2.5 MB.

```shell
$ sysctl -w net.core.rmem_max=2500000
```

Reference: [https://github.com/lucas-clemente/quic-go/wiki/UDP-Receive-Buffer-Size](https://github.com/lucas-clemente/quic-go/wiki/UDP-Receive-Buffer-Size)
:::

## DNS Processing Flow

If the domain name currently being queried...

- Hits a "domain name - IP" or "domain name - IP array" mapping in the `hosts` file, the IP or IP array will be returned as the DNS resolution result.
- Hits a "domain name - domain name" mapping in the `hosts` file, the value of the mapping (another domain name) will be used as the new domain name currently being queried, and enter the DNS processing flow until the IP is resolved and returned, or an empty resolution is returned.
- Does not hit the `hosts` file, but hits the domain name list `domains` in one or more DNS servers, the DNS server corresponding to the rule with the highest priority will be queried sequentially according to the hit rule. If the query fails or the `expectIPs` do not match, the next DNS server will be queried; otherwise, the resolved IP will be returned. If all the DNS servers fail, the DNS component will:
  - By default, perform a "DNS fallback query": Use a DNS server which was not queried in the previous failure which has a `skipFallback` value of `false`. If this query fails too, or if the `expectIPs` do not match, an empty resolution will be returned; otherwise, the resolved IP will be returned.
  - If `disableFallback` is set to `true`, no "DNS fallback query" will be performed.
- Hits neither the `hosts` file nor the domain name list `domains` in the DNS server, then:
  - By default, use the "DNS server with `skipFallback` set to the default value `false`" to query sequentially. If the first DNS server selected fails or the `expectIPs` do not match, the next selected DNS server will be queried; otherwise, the resolved IP will be returned. If all selected DNS servers fail, an empty resolution will be returned.
  - If there are no DNS servers with `skipFallback` set to the default value `false`", or if `disableFallback` is set to `true`, the first DNS server in the DNS configuration will be used for the query. If the query fails or does not match the `expectIPs` list, an empty resolution will be returned; otherwise, the resolved IP will be returned.

The DNS processing flowchart is as follows:

![DNS resolution process](/dns_flowchart_20210418.svg)

## DnsObject

`DnsObject` corresponds to the `dns` parameter of the configuration file.

```json
{
    "hosts": {
        "baidu.com": "127.0.0.1",
        "example.com": [
            "127.0.0.1",
            "::1",
            "proxy.example.com",
            "127.0.0.2"
        ],
        "dns.google": "8.8.8.8",
        "proxy.example.com": "127.0.0.1",
        "geosite:test": [
            "another-proxy.example.com",
            "127.0.0.1"
        ],
        "geosite:category-ads-all": [
            "127.0.0.1",
            "127.0.0.2",
            "::1"
        ]
    },
    "servers": [
        "https://dns.google/dns-query",
        {
            "address": "223.5.5.5",
            "port": 5353,
            "clientIp": "5.6.7.8",
            "skipFallback": true,
            "domains": [
                "domain:baidu.com",
                "geosite:cn"
            ],
            "expectIPs": [
                "geoip:cn",
                "ext:customizedGeoIPFile.dat:cn",
                "ext-ip:customizedGeoIPFile.dat:cn"
            ]
        },
        {
            "address": "fakedns",
            "domains": [
                "domain:v2fly.org",
                "geosite:geolocation-!cn"
            ]
        },
        {
            "address": "https://1.1.1.1/dns-query",
            "domains": [
                "domain:v2fly.org",
                "geosite:geolocation-!cn"
            ],
            "expectIPs": [
                "geoip:!cn",
                "ext:customizedGeoIPFile.dat:!cn",
                "ext-ip:customizedGeoIPFile.dat:!cn"
            ]
        },
        "1.0.0.1",
        "localhost"
    ],
    "clientIp": "1.2.3.4",
    "queryStrategy": "UseIPv4",
    "disableCache": true,
    "disableFallback": true,
    "tag": "dns_inbound"
}
```

> `hosts`: map{string: address} | map{string: \[address\]}

Lists configured hosts mappings. Supports mapping a domain to an address one-to-one, or mapping a domain to several addresses in an array (v4.37.3+), where the address can be IP or another domain name.

When parsing a domain name, and the domain name matches an item in this list of mappings, if the address of this item is an IP, the returned result is the IP of this item, and no subsequent DNS parsing will be performed; if the address of this item is a domain name, the domain name will be used for subsequent DNS parsing, superseding the original domain name.

:::tip
If multiple IPs and domain names are set for the same address at the same time, only the first one will be returned, and the remaining IPs and domain names will be ignored.
:::

The format of the domain name has the following forms:

- **String**: This pattern takes effect when this domain name completely matches the target domain name. For example, `v2ray.com` matches `v2ray.com` but not `www.v2ray.com`.
- **Regular Expression**: Starts with `regexp:`, followed by a regular expression. This pattern takes effect when this regular expression matches the target domain name. For example, `regexp:\.goo.*\.com$` matches `www.google.com`, `fonts.googleapis.com`, but not `google.com`.
- **Subdomain (recommended)**: Starts with `domain:`, followed by a domain name. This pattern takes effect when this domain name is the target domain name or its subdomain. For example, `domain:v2ray.com` matches `www.v2ray.com`, `v2ray.com`, but not `xv2ray.com`.
- **Substring**: Starts with `keyword:`, followed by a string. This pattern takes effect when this string matches any part of the target domain name. For example, `keyword:sina.com` can match `sina.com`, `sina.com.cn`, `www.sina.com` and `www.sina.company`, but not `sina.cn`.
- **Predefined domain name list**: Starts with `geosite:`, followed by a name, such as `geosite:google` or `geosite:cn`. For a list of names and domain names, see [Predefined Domain Name List](routing.md#TODO).

> `servers`: \[string | [ServerObject](#serverobject) \]

List of DNS servers to use. Two forms are accepted: direct DNS server address (string) and [ServerObject](#serverobject).

For details, see [Supported DNS Protocols and Routing Policies](#Supported-DNS protocols and routing strategies)

> `clientIp`: string

The IP address of the current network. Used to notify the DNS server of the client's geographical location when querying. (cannot be a private IP address)

:::tip
This feature requires the DNS server to support EDNS Client Subnet (RFC7871).
:::

> `queryStrategy`: "UseIP" | "UseIPv4" | "UseIPv6"

(Since v4.37.0) The Internet Protocol version used for DNS queries. The default value is `UseIP`, which means that DNS queries for both A and AAAA records of the domain name at the same time. `UseIPv4` and `UseIPv6` will query only the A record or the AAAA record, respectively.

:::tip
It is recommended that users who do not have IPv6 access to use `UseIPv4`. This option has the same priority as the `domainStrategy` option in the `outbound` of the `freedom` protocol. It is recommended to set `domainStrategy` at the same time.
:::

:::warning
If this is set to `UseIPv4`, but the `domainStrategy` option in the `outbound` of the `freedom` protocol is set to `UseIPv6`, it will cause DNS queries from `freedom` protocol `outbound` to be intercepted by the Go runtime, which will then cause DNS leakage; same for the reverse.
:::

> `disableCache`: bool

(Since v4.35.0) Disables DNS caching. The default is false (DNS cache enabled).

> `disableFallback`: bool

(Since v4.37.2) Disables DNS fallback queries. The default is false (DNS fallback enabled). For details, see [DNS Processing Flow](#DNS Processing Flow).

:::warning
If this option is set to `true`, the `skipFallback` in [ServerObject](#ServerObject) will not take effect.
:::

> `disableFallbackIfMatch`: bool

(Since v4.40.2) Disables DNS fallback queries when a priority matching domain name list in the DNS server is hit.

> `tag`: string

(Since v4.13) All query traffic sent by this DNS, except for `localhost` and `DOHL_` mode, will be tagged with this tag, which can be matched by `inboundTag` in routing.

## ServerObject

```json
{
    "address": "223.5.5.5",
    "port": 5353,
    "clientIp": "5.6.7.8",
    "skipFallback": true,
    "domains": [
        "domain:baidu.com",
        "geosite:cn"
    ],
    "expectIPs": [
        "geoip:cn",
        "ext:customizedGeoIPFile.dat:cn",
        "ext-ip:customizedGeoIPFile.dat:cn"
    ]
}
```

> `address`: string

The DNS server address, such as `8.8.8.8`, `tcp+local://8.8.8.8:53`, or `https://dns.google/dns-query`. See [Supported DNS Protocols and Routing Strategies](#Supported-DNS-protocols-and-routing-strategies) for details.

> `port`: number

The DNS server port, by default `53`. It is ignored when DOH, DOHL, or DOQL mode is used; In those cases non-standard ports should be specified in the URL.

> `clientIp`: string

The IP address of the current network. Used to notify the DNS server of the client's geographical location when querying. (cannot be a private IP address) The priority of `clientIp` here is higher than that of the outer configuration of `clientIp`, which can be used to obtain the same domain name resolution result in different regions from the same DNS server using a different `clientIp`. (4.34.0+)

:::tip
This feature requires the DNS server to support EDNS Client Subnet (RFC7871).
:::

> `skipFallback`: bool

(Since v4.37.2) Whether to skip this DNS during DNS fallback queries. The default is false (DNS fallback enabled). See [DNS Processing Flow](#DNS-Processing-Flow) for details.

:::tip
This option can be used to prevent DNS leaks during DNS fallback queries for `A` and `AAAA` records.
:::

:::warning
If `disableFallback` in [DnsObject](#dnsobject) is set to `true`, this option will be ignored.
:::

> `domains`: \[string\]

A list of domain names. Queries for domain names in this list will prioritize using this server. The domain name format is the same as that in [Routing Configuration](routing.md#RuleObject).

> `expectIPs`:\[string\]

(Since v4.22.0) A list of IP ranges, with the same format as [Routing Configuration](routing.md#RuleObject).

When this item is configured, V2Ray's DNS module will verify that the returned IP is within the specified range, and only return the address that meets the expectIPs list. If this item is not configured, the IP address will be returned as-is.
