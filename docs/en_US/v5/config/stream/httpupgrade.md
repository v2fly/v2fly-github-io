# HTTPUpgrade

HTTPUpgrade complete a HTTP 1.1 Upgrade request and response before using the connection directly. It is similar to WebSocket in the way it create an direction channel that can be forwarded by many reverse proxies and CDNs, without the need to deal with all the issue around WebSocket Protocol itself. TLS or other security protocol are required for this transport for it function as designed. (v5.10.0+)

Look at its [pull request](https://github.com/v2fly/v2ray-core/pull/2541) for working examples of how to configure it.


## HTTPUpgrade

* Name: `httpupgrade`
* Type: Transport Protocol
* ID: `stream.httpupgrade`

> `path` : string

> `host` : string

The host domain name for HTTP request.

> `maxEarlyData`: number

The max number of bytes of early data. (v5.24.0)

> `earlyDataHeaderName`: string

The header name for WebSocket Early Data. (v5.24.0)

> 'header': [ [Header](#header) ]

The header to be sent in HTTP request. (v5.24.0)

## Header

> 'key' : string

The HTTP header key.

> 'value' : string

The HTTP header value.
