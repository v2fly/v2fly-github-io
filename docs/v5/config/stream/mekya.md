# mekya

mekya(美咔) 是一种反审查协议，它将 mkcp 流量编码成普通的 HTTP 请求/响应。这将允许流量在大量平台上转发，以减轻 IP 阻断的影响。(v5.21.0+) 

相比于 meek 的顺序传输,此传输方式性能有所提升,得益于采用  mkcp 协议。

此传输协议已启用订阅。

## mekya 流传输
* 名称：`mekya`
* 类型：传输协议
* ID：`stream.mekya`

> `kcp`: [KCPSetting](kcp.md)

应用于此传输方式的 mkcp 设置。

> `maxWriteSize`: number

(仅限服务器)

将写入单个响应的最大响应大小。

> `maxWriteDurationMs`: number

(仅限服务器)

服务器将保持请求打开以进行写入的最长时间（毫秒）。

> `maxSimultaneousWriteConnection`: number

(仅限服务器)

服务器将保留打开以进行写入的未完成 HTTP 请求的最大数量。

> `packetWritingBuffer`: number

(仅限服务器)

服务器将保持请求打开以进行的数据包的最大数量。

> `url`: string

(仅限客户端)

服务器的 URL。

> `maxWriteDelay`: number

(仅限客户端)

为单个请求积累写入数据的最大时间（毫秒）。

> `maxRequestSize`: number

(仅限客户端)

将写入单个响应的最大请求大小。

> `pollingIntervalInitial`: number

(仅限客户端)

初始轮询时间。

> `h2PoolSize`: number

(仅限客户端)

并发性 http2 客户端的数量。

## mekya 使用示例

基于 mekya 的代理配置示例可在以下位置找到：

[mekya 客户端](https://github.com/v2fly/v2ray-core/blob/master/testing/scenarios/config/mekya_client.json)

[mekya 服务器](https://github.com/v2fly/v2ray-core/blob/master/testing/scenarios/config/mekya_server.json)

(本文档为机器翻译自英文版本后手工校对)
