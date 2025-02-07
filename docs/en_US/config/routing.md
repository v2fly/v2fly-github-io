# Routing

V2Ray has a built-in routing module that can distribute inbound data through different outbound connections based on requirements, enabling selective proxy routing. A common use case is to split domestic and international traffic. V2Ray can internally determine traffic from different countries or regions and route them to different outbound proxies.

## RoutingObject

`RoutingObject` corresponds to the `routing` entry in the configuration file.

```json
{
    "domainStrategy": "AsIs",
    "domainMatcher": "mph",
    "rules": [],
    "balancers": []
}
```

> `domainStrategy`: "AsIs" | "IPIfNonMatch" | "IPOnDemand"

Domain name resolution strategy:

* `AsIs`: Uses only domain names for routing selection (default value)
* `IPIfNonMatch`: Resolves domain names to IP addresses (A or AAAA records) for IP-based rule matching when no domain-based rules match
  * When a domain has multiple IP addresses, all addresses are tried until one matches an IP rule
  * The resolved IP is only used for routing selection; the original domain name is still used in forwarded packets
* `IPOnDemand`: Immediately resolves domain names to IP addresses when encountering any IP-based rules during matching

> `domainMatcher`: "linear" | "mph"

Selects the domain matching algorithm:

* `linear`: Uses linear matching algorithm (default value)
* `mph`: Uses minimal perfect hash algorithm (v4.36.1+)
  * With test data of about 170,000 entries, matching speed improves by ~30% and memory usage reduces by ~15%

> `rules`: \[[RuleObject](#ruleobject)\]

An array where each item is a rule. For each connection, routing will evaluate these rules in sequence. When a rule takes effect, the connection is forwarded to its specified `outboundTag` (or `balancerTag`, V2Ray 4.4+). When no rules match, traffic is forwarded to the first `outbound` by default.

> `balancers`: \[ [BalancerObject](#balancerobject) \]

(V2Ray 4.4+) An array where each item is a load balancer configuration. When a rule points to a load balancer, V2Ray selects an `outbound` through this load balancer to forward traffic.

## RuleObject

```json
{
    "domainMatcher": "mph",
    "type": "field",
    "domains": [
        "baidu.com",
        "qq.com",
        "geosite:cn",
        "ext:customizedGeoSiteFile.dat:cn"
    ],
    "ip": [
        "0.0.0.0/8",
        "10.0.0.0/8",
        "fc00::/7",
        "fe80::/10",
        "geoip:cn",
        "geoip:!cn",
        "ext:customizedGeoIPFile.dat:cn",
        "ext:customizedGeoIPFile.dat:!cn",
        "ext-ip:customizedGeoIPFile.dat:cn",
        "ext-ip:customizedGeoIPFile.dat:!cn"
    ],
    "port": "53,443,1000-2000",
    "sourcePort": "53,443,1000-2000",
    "network": "tcp",
    "source": [
        "10.0.0.1"
    ],
    "user": [
        "love@v2ray.com"
    ],
    "inboundTag": [
        "tag-vmess"
    ],
    "protocol": [
        "http",
        "tls",
        "bittorrent"
    ],
    "attrs": "attrs[':method'] == 'GET'",
    "outboundTag": "direct",
    "balancerTag": "balancer"
}
```

:::tip
When multiple attributes are specified, they must all be satisfied for the current rule to take effect. This means `domains` and `ip` rules should be used separately.
:::

> `domainMatcher`: "linear" | "mph"

Selects the domain matching algorithm. The `domainMatcher` here takes precedence over the one configured in `RoutingObject`.

* `linear`: Uses linear matching algorithm (default value)
* `mph`: Uses minimal perfect hash algorithm (v4.36.1+)
  * With test data of about 170,000 entries, matching speed improves by ~30% and memory usage reduces by ~15%

> `type`: "field"

Currently only supports the "field" option.

> `domains`: \[string\]

An array where each item is a domain match. Several formats are supported:

* **Plain string**: Rule takes effect when this string matches any part of the target domain. For example, `sina.com` matches `sina.com`, `sina.com.cn`, `sina.company`, and `www.sina.com`, but not `sina.cn`.
* **Regular expression**: Starts with `regexp:`, followed by a regular expression. Rule takes effect when this regex matches the target domain. For example, `regexp:\.goo.*\.com$` matches `www.google.com`, `fonts.googleapis.com`, but not `google.com`.
* **Subdomain (recommended)**: Starts with `domain:`, followed by a domain name. Rule takes effect when this domain or its subdomains match the target domain. For example, `domain:v2ray.com` matches `www.v2ray.com`, `v2ray.com`, but not `xv2ray.com`.
* **Full match**: Starts with `full:`, followed by a domain name. Rule takes effect when this domain exactly matches the target domain. For example, `full:v2ray.com` matches `v2ray.com` but not `www.v2ray.com`.
* **Predefined domain list**: Starts with `geosite:`, followed by a category name, such as `geosite:google` or `geosite:cn`. See [Predefined Domain Lists](#predefined-domain-lists) for details.
* **Load from file**: Format is `ext:file:tag`, must start with `ext:`, followed by filename and tag. File should be placed in the [resource directory](env.md#resource-file-path), format same as `geosite.dat`, and tag must exist in the file.

> `ip`: \[string\]

An array where each item represents an IP range. Rule takes effect when any item matches the target IP. Several formats are supported:

* IP: Like `127.0.0.1`
* [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing): Like `10.0.0.0/8`
* GeoIP:
  * Format `geoip:cn` for positive match, matches "Mainland China IP addresses". Uses two-letter [country/region codes](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).
  * Format `geoip:!cn` for negative match, matches "non-Mainland China IP addresses".
  * Special value: `geoip:private` (V2Ray 3.5+) includes all private addresses like `127.0.0.1`
* Load from file:
  * Format `ext:file:tag` or `ext-ip:file:tag` for positive match
  * Format `ext:file:!tag` or `ext-ip:file:!tag` for negative match
  * Must start with `ext:` or `ext-ip:`, followed by filename and tag/!tag

:::tip
`ext:geoip.dat:cn` and `ext-ip:geoip.dat:cn` are equivalent to `geoip:cn`

`ext:geoip.dat:!cn` and `ext-ip:geoip.dat:!cn` are equivalent to `geoip:!cn`
:::

> `port`: number | string

Target port range, three formats:

* `a-b`: a and b are positive integers less than 65536. Rule applies to ports in this inclusive range.
* `a`: a is a positive integer less than 65536. Rule applies when target port equals a.
* (V2Ray 4.18+) Mix of above formats, separated by commas. Example: `53,443,1000-2000`

> `sourcePort`: number | string

Source port range, same format as above

> `network`: "tcp" | "udp" | "tcp,udp"

Available values are "tcp", "udp", or "tcp,udp". Rule takes effect when connection type matches.

> `source`: \[string\]

An array where each item represents an IP range. Formats include IP, CIDR, GeoIP, and loading from file. Rule takes effect when any item matches the source IP.

> `user`: \[string\]

An array where each item is an email address. Rule takes effect when any item matches the source user. Currently supported by Shadowsocks and VMess.

> `inboundTag`: \[string\]

An array where each item is an identifier. Rule takes effect when any item matches the inbound protocol identifier.

> `protocol`: \[ "http" | "tls" | "bittorrent" \]

An array where each item represents a protocol. Rule takes effect when any protocol matches the current connection's traffic. Requires `sniffing` option enabled in inbound proxy.

> `attrs`: string

(V2Ray 4.18+) A script to check traffic attributes. Rule takes effect when this script returns true.

Uses [Starlark](https://github.com/bazelbuild/starlark) scripting language, which is a subset of Python. Script receives a global variable `attrs` containing traffic-related attributes.

Currently only HTTP inbound proxy sets these attributes.

Examples:

* Detect HTTP GET: `attrs[':method'] == 'GET'`
* Detect HTTP Path: `attrs[':path'].startswith('/test')`
* Detect Content Type: `attrs['accept'].index('text/html') >= 0`

> `outboundTag`: string

Corresponds to an identifier of an additional [outbound connection configuration](outbounds.md#outboundobject).

> `balancerTag`: string

Corresponds to a load balancer identifier. Must choose either `balancerTag` or `outboundTag`. When both are specified, `outboundTag` takes effect.

## BalancerObject

Load balancer configuration. When a load balancer takes effect, it selects the most suitable outbound protocol from specified protocols according to configuration.

```json
{
    "tag": "balancer",
    "selector": [],
    "strategy": {
      "type": "random"
    }
}
```

> `tag`: string

Identifier for this load balancer, used to match `balancerTag` in `RuleObject`.

> `selector`: \[ string \]

An array of strings, each used for prefix matching with outbound protocol identifiers. For outbound protocol identifiers `[ "a", "ab", "c", "ba" ]`, `"selector": ["a"]` would match `[ "a", "ab" ]`.

> `strategy`: StrategyObject

The strategy object for load balancing.

## StrategyObject

```json
{
    "type": "random"
}
```

> `type`: string

The type of load balancing strategy.

Available types include `random` and `leastPing` (v4.38.0+).

`random` randomly selects one outbound as the final outbound connection.

`leastPing` selects the outbound connection with the fastest HTTPS GET request completion time based on observation records.

Load balancing strategies depend on observation records from the outbound [connection observatory](observatory.md) component.

## Predefined Domain Lists

This list is maintained by the [domain-list-community](https://github.com/v2fly/domain-list-community) project and is pre-installed in every V2Ray package as `geosite.dat`. This file contains common domains, used as `geosite:listname`, like `geosite:google` for domains in the `google` file in the `data` directory of the `domain-list-community` project.

:::tip
If you encounter issues or find missing domains while using `geosite.dat`, feel free to submit an [issue](https://github.com/v2fly/domain-list-community/issues) or [pull request](https://github.com/v2fly/domain-list-community/pulls) to [v2fly/domain-list-community](https://github.com/v2fly/domain-list-community).
:::

Common domain categories include:

* `category-ads`: Common advertising domains
* `category-ads-all`: Common advertising domains plus ad provider domains
* `tld-cn`: CNNIC-managed top-level domains for Mainland China (e.g., `.cn`, `.中国`)
* `tld-!cn`: Non-Mainland China top-level domains (e.g., `.tw` for Taiwan, `.jp` for Japan, `.sg` for Singapore, `.us` for USA, `.ca` for Canada)
* `geolocation-cn`: Common Mainland China website domains
* `geolocation-!cn`: Common non-Mainland China website domains
* `cn`: Combination of `geolocation-cn` and `tld-cn`
* `apple`: Most Apple domains
* `google`: Most Google domains
* `microsoft`: Most Microsoft domains
* `facebook`: Most Facebook domains
* `twitter`: Most Twitter domains
* `telegram`: Most Telegram domains
* For more categories, see the [data directory](https://github.com/v2fly/domain-list-community/tree/master/data)

## Geodata File Loader

V2Ray includes multiple loaders for reading and decoding `geoip.dat` and `geosite.dat` files (v4.39.0+).

This setting is controlled by the `v2ray.conf.geoloader` environment variable. See [Environment Variables](env.md#geodata-file-loader) for details.
