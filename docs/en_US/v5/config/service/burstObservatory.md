# Burst Observatory
* Name: `burstObservatory`
* Type: Service
* ID: `service.burstObservatory`

> `subjectSelector`: string

The selectors for outbound under observation

>`pingConfig`: [PingConfigObject](#pingconfigobject)


### PingConfigObject



> `destination`: string

Ping destination URL. It should return 204 on success.

> `connectivity`: string

Connectivity check URL.

> `interval`: number

Health check interval, int64 values of time.Duration

> `samplingCount`: number

Sampling count is the amount of recent ping results which are kept for calculation

> `timeout`: number

Ping timeout, int64 values of time.Duration
