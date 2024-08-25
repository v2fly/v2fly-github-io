# 并发连接观测

并发连接观测服务。

> `subjectSelector`: string

一个字符串数组，其中每一个字符串将用于和出站协议标识的前缀匹配。在以下几个出站协议标识中：`[ "a", "ab", "c", "ba" ]`，`"subjectSelector": ["a"]` 将匹配到 `[ "a", "ab" ]`。

>`pingConfig`: [PingConfigObject](#pingconfigobject)

### PingConfigObject

> `destination`: string

Ping destination URL. It should return 204 on success.

> `connectivity`: string

Connectivity check URL.

> `interval`: number

发起健康检查的事件间隔, 时间格式为数字+单位，比如`"10s"`, `"2h45m"`，支持的时间单位有 `ns`, `us`, `ms`, `s`, `m`, `h`， 分别对应纳秒、微秒、毫秒、秒、分、时。

> `samplingCount`: number

保留的最近 Ping 结果的数量。

> `timeout`: number

Ping 超时时间, 时间格式为数字+单位，比如`"10s"`, `"2h45m"`。
