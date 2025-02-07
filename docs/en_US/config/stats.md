# Stats

V2Ray provides statistical information about its operational status.

## StatsObject

`StatsObject` corresponds to the `stats` entry in the configuration file.

```json
{
}
```

Currently, statistics have no parameters - internal statistics are enabled simply by the presence of the `StatsObject` entry. You also need to enable corresponding items in [Policy](policy.md) to collect specific data.

The following statistics are currently available:

## User Data

> `user>>>[email]>>>traffic>>>uplink`

Uplink traffic for a specific user, measured in bytes.

> `user>>>[email]>>>traffic>>>downlink`

Downlink traffic for a specific user, measured in bytes.

:::tip
Statistics will not be enabled for users without a specified Email address.
:::

## Global Data

> `inbound>>>[tag]>>>traffic>>>uplink`

Uplink traffic for a specific inbound proxy, measured in bytes.

> `inbound>>>[tag]>>>traffic>>>downlink`

Downlink traffic for a specific inbound proxy, measured in bytes.

> `outbound>>>[tag]>>>traffic>>>uplink`

(V2Ray 4.26.0+) Uplink traffic for a specific outbound proxy, measured in bytes.

> `outbound>>>[tag]>>>traffic>>>downlink`

(V2Ray 4.26.0+) Downlink traffic for a specific outbound proxy, measured in bytes.
