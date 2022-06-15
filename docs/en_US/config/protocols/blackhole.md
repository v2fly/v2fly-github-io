# Blackhole

* Name: `blackhole`
* Type: Outbound Protocol

Blackhole is an outbound protocol. It discards all data sent to it. [Routing](../routing.md) configurations can utilize Blackhole to filter out specific requests.

## OutboundConfigurationObject

```json
{
    "response": {
        "type": "none"
    }
}
```

> `response`: [ResponseObject](#responseobject)

Configure the response data of the black hole. Blackhole will reply with a specified response data after receiving the data to be forwarded, and then close the connection. The data to be forwarded will be discarded. If this item is not specified, Blackhole will close the connection immediately.

### ResponseObject

```json
{
    "type": "none"
}
```

> `type`: "http" | "none"

If `type` is set to `"none"` (default), Blackhole will close the connection directly. If `type` is set to `"http"`, Blackhole will reply with a simple HTTP 403 Forbidden response and then close the connection.
