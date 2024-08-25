# DNS
service.dns

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

> `nameServer`: [ [NameServerObject](#nameserverobject) ]

A list of name servers.

> `staticHosts`: [ [StaticHostsObject](#statichostsobject) ]

Host Mapping rules. This can be used to manually define DNS resolution results or transform DNS resolutions.

> `tag`: string

The inbound tag for traffic initiated by the dns module.

> `disableCache`: true|false

Disable built in caching for DNS. Otherwise the DNS result will be cached for 10 mins.

> `queryStrategy`: `USE_IP` | `USE_IP4` | `USE_IP6`

The type of network address requested by dns.

> `disableFallback`: true|false

Disable the fallback query step.


> `disableFallbackIfMatch`: bool

Disable the fallback query step if there is a server with prioritizedDomain matches.

## NameServerObject

> `address`: string

The network address or URL of Domain Name Service Service Server.

Following Types are supported:

* Standard DNS: An address like `1.0.0.1:53` specifies an UDP DNS Server. This the most common type of DNS Server.
* DNS over TCP: An address like `tcp://host:port` specifies an TCP DNS Server. Currently DNS over TCP in V2Ray have performance implications.
* DNS over Local TCP: An address like `tcp+local://host:port` specifies a TCP DNS Server send over local network. The communication with remote DNS server will be send from client's network environment directly without dispatch over routing component.
* DNS over HTTPS: An address like `https://host:port/dns-query` specifies an DNS over HTTPS Server.
* DNS over Local HTTPS: An address like `https+local://host:port/dns-query` specifies an DNS over HTTPS Server over local network. The communication with remote DNS server will be send from client's network environment directly without dispatch over routing component.
* DNS over Local QUIC: An address like `quic+local://host:port/` specifies an DNS over QUIC Server over local network. The communication with remote DNS server will be send from client's network environment directly without dispatch over routing component.

> `clientIp`: string

The client IP address indication send to the DNS Server. The server may return a localised result based on this address.  

> `skipFallback`: true | false

Prevent fallback to this DNS Server.

> `prioritizedDomain`: [ [PrioritizedDomainObject](#prioritizeddomainobject) ]

The domains that should be send to this server. If the domain being queried match one of the specification, then the query will be send to this server first.

> `geoip`: [ [GeoIPObject](geo.md#GeoIPObject) ]

The IP address expected from this server. If the result is not from the given IP address range, it will be discarded.

## StaticHostsObject

> `type`: `Full` | `Subdomain` | `Keyword` | `Regex`

Static Hosts supports different types of matching method.

* Full: Requires an exact match. When this domain name completely matches the target domain name, the rule takes effect. For example, "v2ray.com" matches "v2ray.com" but not "www.v2ray.com".
* Subdomain: Matches a domain and all its subdomain. This rule takes effect when the domain name is the target domain name or its subdomain name. For example, "v2ray.com" matches "www.v2ray.com", "v2ray.com", but not "xv2ray.com".
* Keyword: Matches any domain with a keyword. When this string matches any part of the target domain name, the rule takes effect. For example, "sina.com" can match "sina.com", "sina.com.cn" and "www.sina.com" but not "sina.cn".
* Regex: Matches domain based on Regular Expression. When this regular expression matches the target domain name, the rule takes effect. For example, "\\\\.goo.*\\\\.com$" matches "www.google.com" and "fonts.googleapis.com" but not "google.com".

> `domain`: string

The domain matching specification. Its interpretation is based on the `type` of the rule.

> `ip`: string

The static host IP address. If configured, this IP address will be used as the domain name resolution result for matching domains.

> `proxiedDomain`: string

The replacement domain. If configured, this domain name's resolution result will be used as the domain name resolution result for mathcing domains.
