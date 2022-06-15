# Observatory

(Since v4.38.0) The Observatory component periodically establishes connections through specified outbounds to determine their connectivity status.
The results of the Observatory component can be used by other components, such as the Load Balancer and API.

By default, Observatory uses the remote server `api.v2fly.org`. Since a probe connection is made to it periodically to the V2Ray server, this function may give attackers additional information about the nature of the server if they can view its outbound network traffic. Use with caution.

## ObservatoryObject

```json
{
  "subjectSelector":[
    "outbound"
  ]
}
```

> `subjectSelector`: \[string\]

An array of string patterns which are used to identify outbounds by their `tag`s. In the following outbound `tag`s: `[ "a", "ab", "c", "ba" ]`, the `"selector": ["a"]` will match tags `[ "a", "ab" ]`.

Selected outbounds will try to connect periodically to a remote server.

> `probeURL`: string

The URL used to detect the connectivity status. The built-in address (`api.v2fly.org`) is used by default. (4.41.1+)

:::tip
The server of this destination address can infer that this server is running V2Ray with Observatory enabled. If you choose to utilize a remote server provided by a third party, their operator could potentially make decisions which are not in your best interest, such as requiring additional verification, refusing service, or terminating your account, based on this information.
:::

> `probeInterval`: string

The time interval for initiating probes. The time format is a number followed by a unit, such as `"10s"`, `"2h45m"`. The supported time units are `ns`, `us`, `ms`, `s`, `m`, `h`, corresponding to nanoseconds, microseconds, milliseconds, seconds, minutes, and hours, respectively. (4.41.1+)

:::tip
The name of this configuration item was changed in v4.42.0.
:::
