# Statistics

V2Ray provides some statistics about its operations.

## StatsObject

`StatsObject` corresponds to the `stats` item in the configuration file.

```json
{
}
```

Currently, there are no parameters for statistics; as long as the `StatsObject` item exists, the statistics module will be enabled. You need to enable the corresponding parameters in [Local Policies](policy.md) to be able to collect the corresponding telemetry.

Currently available statistics:

## User Data

> `user>>> [email] >>> traffic>>> uplink`

The uplink traffic of a specific user, in bytes.

> `user>>> [email] >>> traffic>>> downlink`

The downlink traffic of a specific user, in bytes.

:::tip
If the corresponding user does not specify an Email, statistics won't be recorded.
:::

## Global Data

> `inbound>>> [tag] >>> traffic>>> uplink`

The uplink traffic of a specific inbound, in bytes.

> `inbound>>> [tag] >>> traffic>>> downlink`

The downlink traffic of a specific inbound, in bytes.

> `outbound>>> [tag] >>> traffic>>> uplink`

(Since v4.26.0) The uplink traffic of a specific outbound, in bytes.

> `outbound>>> [tag] >>> traffic>>> downlink`

(Since v4.26.0) The downlink traffic of a specific outbound, in bytes.
