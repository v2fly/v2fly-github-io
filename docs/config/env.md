# 环境变量

V2Ray 提供以下环境变量以供修改 V2Ray 的一些底层配置。

## 每个连接的缓存大小

* 名称：`v2ray.ray.buffer.size` 或 `V2RAY_RAY_BUFFER_SIZE`。
* 单位：MBytes。
* 默认值：在 x86、amd64、arm64 和 s390x 上为 2，其它平台上禁用该缓存。
* 特殊值：0 表示缓存无上限。

**已过时，请使用本地策略中的 bufferSize**

对于一个代理连接，当上下游网络速度有差距时，V2Ray 会缓存一部分数据，以减小对网络传输的影响。这个配置设置了缓存的大小，越大的缓存会占用更多的内存，也会使网络性能越好。

## 资源文件路径

* 名称：`v2ray.location.asset` 或 `V2RAY_LOCATION_ASSET`。
* 默认值：和 v2ray 文件同路径。

这个环境变量指定了一个文件夹位置，这个文件夹应当包含 geoip.dat 和 geosite.dat 文件。

## 配置文件位置

* 名称：`v2ray.location.config` 或 `V2RAY_LOCATION_CONFIG`。
* 默认值：和 v2ray 文件同路径。

这个环境变量指定了一个文件夹位置，这个文件夹应当包含 config.json 文件。

## 多配置目录

* 名称：`v2ray.location.confdir` 或 `V2RAY_LOCATION_CONFDIR`。
* 默认值：`""`。

V2Ray 4.23.0 开始增加的多配置文件目录项。这个目录内的 `.json` 文件会按文件名顺序读取，作为多配置选项。

## 分散读取

* 名称：`v2ray.buf.readv` 或 `V2RAY_BUF_READV`。
* 默认值：`auto`。

V2Ray 3.37 开始使用 Scatter/Gather IO，这一特性可以在大流量（超过 100 MByte/s）的时候依然使用较低的内存。可选的值有 `auto`、`enable` 和 `disable`。

* `enable`：强制开启分散读取特性。
* `disable`：强制关闭分散读取特性。
* `auto`：仅在 Windows、macOS 和 Linux，并且 CPU 平台为 x86、AMD64 和 s390x 时，开启此特性。

在流量没有达到 100 MByte/s 时，开启与否在内存使用上没有明显的差异。

## Geodata 文件加载器

* 名称：`v2ray.conf.geoloader` 或 `V2RAY_CONF_GEOLOADER`。
* 默认值：`standard`。

自 v4.39.0 起，V2Ray 内置了多种读取和解码 `geoip.dat` 和 `geosite.dat` 文件的加载器。可选的加载器如下：

* `standard`：标准加载器（默认值）
* `memconservative`：专为内存受限（小内存）设备优化的加载器 (v4.39.0+)
