# Blackhole

* Name: `blackhole`
* Type: Outbound Protocol

Blackhole (black hole) is an outbound data protocol, which will hinder the outbound of all data. When used with [Routing](../routing.md), it can achieve the effect of prohibiting access to certain websites.

## OutboundConfigurationObject

```json
{
    "response": {
        "type": "none"
    }
}
```

> `response`: [ResponseObject](#responseobject)

Configure the response data of the black hole. Blackhole will send the specified response data after receiving the data to be forwarded, and then close the connection. The data to be forwarded will be discarded. If this item is not specified, Blackhole will close the connection directly.

### ResponseObject

```json
{
    "type": "none"
}
```

> `type`: "http" | "none"

When `type` is `"none"` (default value), Blackhole will close the connection directly. When `type` is `"http"`, Blackhole will send back a simple HTTP 403 packet and then close the connection.
