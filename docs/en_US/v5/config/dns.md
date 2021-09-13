# DNS
service.dns

The DNS server is the built-in host name resolution component.

> `nameServer`: [ [NameServerObject](#NameServerObject) ]

A list of name servers.

> `staticHosts`: [ [StaticHostsObject](#StaticHostsObject) ]

Host Mapping rules. This can be used to manually define DNS resolution results or transform DNS resolutions.

> `tag`: string

The inbound tag for traffic initiated by the dns module.

> `disableCache`: true|false

Disable built in caching for DNS. Otherwise the DNS result will be cached for 10 mins.

> `queryStrategy`: `USE_IP` | `USE_IP4` | `USE_IP6`

The type of network address requested by dns.

> `disableFallback`: true|false

Disable the fallback query step.

## NameServerObject

> `address`: string

> `clientIp`: string

> `skipFallback`: true|false

> `prioritizedDomain`: [ [PrioritizedDomainObject](#PrioritizedDomainObject) ]

> `geoip`: [ [GeoIPObject](geo.md#GeoIPObject) ]

## StaticHostsObject

> `type`: `Full` | `Subdomain` | `Keyword` | `Regex`

> `domain`: string

> `ip`: string

> `proxiedDomain`: string
