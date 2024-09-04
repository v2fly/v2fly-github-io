# Policy
* Name: `policy`
* Type: Service
* ID: `service.policy`

### Policy

> `system`: [SystemPolicyObject](#systempolicyobject)

The system level policies that determine the global level policies applied everywhere.

> `level`: map of [PolicyObject](#policyobject)

The level based policy.

### SystemPolicyObject

> `stats`: [StatsObject](#statsobject)

The stats settings.

### StatsObject

> `inboundUplink`: bool

Whether the upload data count from inbound should be recorded.

> `inboundDownlink`: bool

Whether the download data count from inbound should be recorded.

> `outboundUplink`: bool

Whether the upload data count from outbound should be recorded.

> `outboundDownlink`: bool

Whether the download data count from outbound should be recorded.


### PolicyObject

> `timeout`: [TimeoutPolicyObject](#timeoutpolicyobject)

> `stats`: [PolicyStatsObject](#policystatsobject)

> `buffer`: [BufferPolicyObject](#bufferpolicyobject)

### TimeoutPolicyObject

> `handshake`: [SecondObject](#secondobject)

> `connectionIdle`: [SecondObject](#secondobject)

> `uplinkOnly`: [SecondObject](#secondobject)

> `downlinkOnly`: [SecondObject](#secondobject)

### SecondObject

> `value`: number

The time in second.

### PolicyStatsObject

> `userUplink`: bool

Whether the user upload data count should be recorded.

> `userDownlink`: bool

Whether the user download data count should be recorded.

### BufferPolicyObject

> `connection`: number

Buffer size per connection, in bytes. -1 for unlimited buffer.
