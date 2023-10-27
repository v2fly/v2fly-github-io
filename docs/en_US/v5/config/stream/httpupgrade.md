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
