# Policy 本地策略

本地策略可以配置信息统计、内部缓存大小和一些用户相关的权限。V2Ray 处理的每一个连接都对应一个用户，按照用户的等级（level）应用不同的策略。本地策略可根据等级的不同而变化。

service.policy

## Policy

> `system`: [SystemPolicyObject](#systempolicyobject)

V2Ray 全局系统策略。

> `level`: map{string: [PolicyObject](#policyobject)}

一组键值对，每个键是一个字符串形式的数字（JSON 的要求），比如 "0"、"1" 等，双引号不能省略，此数字对应用户等级。每一个值是一个 [PolicyObject](#policyobject)。

### SystemPolicyObject

> `stats`: [StatsObject](#statsobject)

统计信息设置。

### StatsObject

> `inboundUplink`: bool

当值为 `true` 时，开启所有入站代理的上行流量统计。

> `inboundDownlink`: bool

当值为 `true` 时，开启所有入站代理的下行流量统计。

> `outboundUplink`: bool

当值为 `true` 时，开启所有出站代理的上行流量统计。

> `outboundDownlink`: bool

当值为 `true` 时，开启所有出站代理的下行流量统计。


### PolicyObject

> `timeout`: [TimeoutPolicyObject](#timeoutpolicyobject)

超时策略。

> `stats`: [PolicyStatsObject](#policystatsobject)

统计信息策略。

> `buffer`: [BufferPolicyObject](#bufferpolicyobject)

内部缓存策略。

### TimeoutPolicyObject

> `handshake`: number

连接建立时的握手时间限制。单位为秒。默认值为 `4`。在入站代理处理一个新连接时，在握手阶段（比如 VMess 读取头部数据，判断目标服务器地址），如果使用的时间超过这个时间，则中断该连接。

> `connectionIdle`: number

连接空闲的时间限制。单位为秒。默认值为 `300`。在入站出站代理处理一个连接时，如果在 `connIdle` 时间内，没有任何数据被传输（包括上行和下行数据），则中断该连接。

> `uplinkOnly`: number

当连接下行线路关闭后的时间限制。单位为秒。默认值为 `2`。当服务器（如远端网站）关闭下行连接时，出站代理会在等待 `uplinkOnly` 时间后中断连接。

> `downlinkOnly`: number

当连接上行线路关闭后的时间限制。单位为秒。默认值为 `5`。当客户端（如浏览器）关闭上行连接时，入站代理会在等待 `downlinkOnly` 时间后中断连接。

### PolicyStatsObject

> `userUplink`: bool

当值为 `true` 时，开启当前等级的所有用户的上行流量统计。

> `userDownlink`: bool

当值为 `true` 时，开启当前等级的所有用户的下行流量统计。

### BufferPolicyObject

> `connection`: number

每个连接的内部缓存大小，单位为 Bytes。 当值为 `-1` 时，缓存大小无限。
