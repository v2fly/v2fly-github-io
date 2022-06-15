# Multiple configuration files

Starting from v4.23.0, V2Ray supports loading multiple configuration files.

The main purpose of utilizing multiple configuration files is to distribute the configuration of many different isolated modules for easier management and maintenance. This function is primarily designed to enrich the V2Ray ecosystem, such as for GUI interfaces, which generally only implement fixed functions such as inbound/outbound selection, and may have trouble interpreting and/or generating complex configurations. Now, only one `confdir` custom configuration directory is required to configure complex functions; for server deployment scripts, just add additional configurations to the `confdir` to configure many different protocols and modules with ease.

## Example: Multiple startup configurations

:::tip
The startup information will prompt for each configuration file read in turn, pay attention to whether the startup information is in the order you preset.
:::


`$ v2ray -c v2ray.json -c 00_base.json -c 01_info.json -c 02_log.json -c outbound.json`

```
V2Ray v4.23.0-version (user) 20200311-000000 (go1.13.8 linux/mipsle)
A unified platform for anti-censorship.
2020/03/22 18:40:00 [Info] v2ray.com/core/common/platform/ctlcmd: <v2ctl message>
v2ctl> Read config:  00_base.json
v2ctl> Read config:  01_info.json
v2ctl> Read config:  02_log.json
v2ctl> Read config:  outbound.json
v2ctl> [ outbound.json ] updated outbound with tag:  proxy
```

## Usage

The command line argument `-c` or `-config` can be specified multiple times.

```bash
v2ray -config base.json -config cf1.json -c cf2.json -c cf3.json
```

Alternatively, the `-confdir` parameter can specify a directory, from which V2Ray will read `.json` configuration files in the specified directory, in order of filenames.

```bash
v2ray -confdir /etc/v2ray/confs
```

Both can be used simultaneously. (`-c` and `-config` configurations will always be loaded before `-confdir` configurations.)

```bash
v2ray -c cf1.json -c cf2.json -confdir /etc/v2ray/confs
```

You can also use the [environment variables](env.md#Directory for multiple configurations) `v2ray.location.confdir`, or `V2RAY_LOCATION_CONFDIR` to specify `confdir`. (The `-confdir` parameter takes precedence over the environment variable; if it specifies a valid directory, the path in the environment variable is not read.)

## Parameters

#### Objects (`{}`)

**For all objects nested within the top-level object of the JSON configuration, parameters loaded first will be either superseded or supplemented (depending on type) by parameters loaded after it.**

Example:

* base.json

```json
{
    "log": {},
    "api": {},
    "dns": {},
    "stats": {},
    "policy": {},
    "transport": {},
    "routing": {},
    "inbounds": []
}
```

* outbounds.json

```json
{
    "outbounds": []
}
```

Start V2Ray with both configurations:

```bash
v2ray -c base.json -c outbounds.json
```

These two configuration files are equivalent to a single merged configuration file. When you need to modify the outbound node, you only need to modify the content of `outbounds.json`.

As an additional example, if you need to change the log level specified by `log`, you don't need to modify `base.json`, you only need to add an additional configuration to be loaded last:

* debuglog.json

```json
{
    "log": {
        "loglevel": "debug"
    }
}
```

Start V2Ray while placing it after `base.json`:

```bash
v2ray -c base.json -c outbounds.json -c debuglog.json
```

#### Arrays (`[]`)

In the JSON configuration, the parameters `inbounds` and `outbounds` are array structures. These array specifically have special rules during merging:

* If more than one of each is present, the very last array supersedes all other previous arrays.
* If there is only one present, V2Ray first attempts to find any existing configurations specified in the with the same `tag` to override by order (as specified before). Then:
  - For inbound elements, appends it to the end of all inbounds (order is irrelevant)
  - For outbound elements, prepends it to the front of all outbounds (the first outbound is the preferred one in case of conflict); but if the filename contains `tail` (case insensitive), appends it to the end.

With multiple configurations, you can easily add inbound of different protocols to the original configuration file without modifying it directly.

The following example is not a valid configuration, but only an example to demonstrate those rules:

* 000.json

```json
{
    "inbounds": [
        {
            "protocol": "socks",
            "tag":"socks",
            "port": 1234
        }
    ]
}
```

* 001.json

```json
{
    "inbounds": [
        {
            "protocol": "http",
            "tag":"http"
        }
    ]
}
```

* 002.json

```json
{
    "inbounds": [
        {
            "protocol": "socks",
            "tag":"socks",
            "port": 4321
        }
    ]
}
```

The three configurations will be merged into:

```json
{
    "inbounds": [
        {
            "protocol": "socks",
            "tag":"socks",
            "port": 4321 // <--- 002 is loaded after 000, thus the port of the duplicate "socks" configuration is overwritten as "4321"
        },
        {
            "protocol": "http",
            "tag":"http"
        }
    ]
}
```

## Recommended multi-config list

Execute:

```bash
for BASE in 00_log 01_api 02_dns 03_routing 04_policy 05_inbounds 06_outbounds 07_transport 08_stats 09_reverse; do echo '{}' > "/etc/v2ray/$BASE.json"; done
```

Or,

```bash
for BASE in 00_log 01_api 02_dns 03_routing 04_policy 05_inbounds 06_outbounds 07_transport 08_stats 09_reverse; do echo '{}' > "/usr/local/etc/v2ray/$BASE.json"; done
```

```bash
.
├── 00_log.json
├── 01_api.json
├── 02_dns.json
├── 03_routing.json
├── 04_policy.json
├── 05_inbounds.json
├── 06_outbounds.json
├── 07_transport.json
├── 08_stats.json
└── 09_reverse.json

0 directories, 10 files
```
