# mekya

Meek is a censorship resistent protocol that encode mkcp traffic into plain HTTP request/responses. This would allow the traffic to be reflected over significant amount of platforms to migrate the effect of IP blocking. (v5.21.0+)

This transport has improved performance compare to meek as a result of utilizing mkcp protocol instead of sequential transmission.

Subscription have been enabled for this transport protocol.

## mekya Stream Transport
* Name: `mekya`
* Type: Transport Protocol
* ID: `stream.mekya`

> `kcp`: [KCPSetting](kcp.md)

The mkcp settings to be applied to this transport.

> `maxWriteSize`: number

(Server only)

The maximum size of a response that will be written to a single response.

> `maxWriteDurationMs`: number

(Server only)

The maximum time in milliseconds that a server will hold a request for write.

> `maxSimultaneousWriteConnection`: number

(Server only)

The maximum amount of in-flight http request a server will hold for write.

> `packetWritingBuffer`: number

(Server only)

The maxium amount of packets that a server will hold awaiting write.

> `url`: string

(Client only)

The url of the server.

> `maxWriteDelay`: number

(Client only)

The maximum amount of time in milliseconds that writes are accumulated for a single request.

> `maxRequestSize`: number

(Client only)

The maximum size of a request that will be written to a single response.

> `pollingIntervalInitial`: number

(Client only)

The initial polling time for response.

> `h2PoolSize`: number

(Client only)

The size of the http2 clients to use for higher concurrency.

## mekya Usage Examples

The configuration examples of mekya based proxy can be found:

[mekya Client](https://github.com/v2fly/v2ray-core/blob/master/testing/scenarios/config/mekya_client.json)

[mekya Server](https://github.com/v2fly/v2ray-core/blob/master/testing/scenarios/config/mekya_server.json)
