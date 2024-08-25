# Router
service.router

```json
{
  "domainStrategy":"AsIs",
  "rule":[],
  "balancingRule":[]
}
```

> `domainStrategy`: `AsIs` | `UseIp` | `IpIfNonMatch` | `IpOnDemand`

> `rule`: [ [RuleObject](#ruleobject) ]

> `balancingRule`: [ [BalancingRuleObject](#balancingruleobject) ]

## RuleObject

> `tag`: string

> `balancingTag`: string

> `domain`: string

> `geoip` :

> `portList`: string

> `networks`: string

> `sourceGeoip`

> `sourcePortList`: [ string ]

> `userEmail`: [ string ]

> `inboundTag`: [ string ]

> `protocol`: [ string ]

> `domainMatcher`: string

> `geoDomain` :

## BalancingRuleObject
