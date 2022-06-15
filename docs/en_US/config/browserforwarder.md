# Browser Forwarder module

The Browser Forwarder Module can use a front webpage to forward supported payloads.

## BrowserForwarderObject

The `BrowserForwarderObject` corresponds to the `browserForwarder` item in the configuration file. (4.37.0+)


```json
{
    "listenAddr": "127.0.0.1",
    "listenPort": 8080
}
```

> `listenAddr`: string

The local listening address of the browser forwarding page.

> `listenPort`: number

The local listening port of the browser forwarding page.


## Operation

The browser forwarding program uses the browser's internal structure to forward the connection to the corresponding server, avoiding a direct TLS connection to the remote V2Ray server, reducing recognizable features.

During usage, a user can open a corresponding link on the webpage, which will trigger the forwarding function.

The folder for the forwarding webpages and script files should be placed in the resource folder. This content must be updated with V2Ray at the same time, and be consistent with the published content. V2Ray will not forward unrecognizable pages and scripts to the browser.

This resource data is located in the optional extra package (v2ray-extra.zip) in the binary distribution version.
