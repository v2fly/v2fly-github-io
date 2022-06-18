# Loopback

* Name: `loopback`
* Type: Outbound Protocol
* First Added: v4.36.0

Loopback is an outbound protocol. It allows any outbound connections to be rerouted back into another inbound protocol.

## OutboundConfigurationObject

```json
{
    "inboundTag": "INBOUND_TAG"
}
```

> `inboundTag`: string

A `tag` which matches the inbound protocol to use. All traffic received by `loopback` will be forwarded to this inbound protocol.
