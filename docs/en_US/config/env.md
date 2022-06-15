# Environment Variables

V2Ray provides the following environment variables to modify some of V2Ray's underlying configurations.

## Cache size for each connection

* Name: `v2ray.ray.buffer.size` or `V2RAY_RAY_BUFFER_SIZE`
* Unit: Megabytes
* Default value: 2 on x86, amd64, arm64 and s390x, disabled on other platforms
* Special value: 0 for unlimited cache

**Deprecated, please use bufferSize in local policy**

For a proxy connection, when the upstream and downstream network speeds are different, V2Ray will cache some data to reduce the impact on network transmission. This configuration sets the size of the cache. The larger the cache, the more memory it will occupy, and the better the network performance.

## Path of resource file

* Name: `v2ray.location.asset` or `V2RAY_LOCATION_ASSET`
* Default value: Same path as v2ray file

This environment variable specifies a folder location that should contain the geoip.dat and geosite.dat files.

## Path of configuration file

* Name: `v2ray.location.config` or `V2RAY_LOCATION_CONFIG`.
* Default value: Same path as v2ray file

This environment variable specifies a folder location that should contain the config.json file.

## Directory for multiple configurations

* Name: `v2ray.location.confdir` or `V2RAY_LOCATION_CONFDIR`
* Default value: `""`

The multiple configuration files directory was added in V2Ray 4.23.0. The `.json` files in this directory will be read in order of file names, as multiple configurations.

## Scattered reading

* Name: `v2ray.buf.readv` or `V2RAY_BUF_READV`.
* Default value: `auto`.

Scatter/Gather IO has been used starting from V2Ray 3.37, which can use less memory during high traffic (over 100 MByte/s). Optional values are `auto`, `enable`, and `disable`.

* `enable`: Force enable Scatter/Gather IO.
* `disable`: Force disable Scatter/Gather IO.
* `auto`: Only enable on Windows, macOS, and Linux, and on x86, AMD64, and s390x CPUs.

There is no obvious difference in memory usage if enabled while the traffic is below 100 MByte/s.

## Geodata file loader

* Name: `v2ray.conf.geoloader` or `V2RAY_CONF_GEOLOADER`.
* Default value: `standard`.

Starting from v4.39.0, V2Ray has several built-in interpreters to read and decode `geoip.dat` and `geosite.dat` files. Available interpreters:

* `standard`: Standard interpreter (default)
* `memconservative`: Interpreter optimized for embedded (memory-constrained) devices (v4.39.0+)
