# WebSocket

## WebSocket Stream
* Name: `ws`
* Type: Transport Protocol
* ID: `stream.ws`

> `path`: string

The HTTP path for the websocket request. Empty value means root(/).

> `maxEarlyData`: number

The max number of bytes of early data.

> `useBrowserForwarding`: true | false

Whether to enable browser forwarder.

> `earlyDataHeaderName`: string

The header name for WebSocket Early Data. If not set, the early data will be send through path.

> 'header': [ [Header](#header) ]

The header to be sent in HTTP request.

## Header

> 'key' : string

The HTTP header key.

> 'value' : string

The HTTP header value.