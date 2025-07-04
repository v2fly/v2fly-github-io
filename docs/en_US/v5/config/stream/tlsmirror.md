# TLSMirror

::: danger
This protocol is currently unreleased and is currently in developer preview phase. Please only use it with fully understanding of its risk.
:::

TLSMirror is a looks like TLS protocol that designed to look like a port forwarder or SNI proxy while covertly transport payload traffic mixed with untouched carrier traffic. (unreleased)


## TLSMirror Setting

* Name: `tlsmirror`
* Type: Transport Protocol
* ID: `stream.tlsmirror`


> `primaryKey` : string

Primary key is a 32 bytes, base64 encoded key used for transform of payload traffic. 
Although AES-GCM encryption is used to transform the traffic, unless otherwise noted, 
the traffic is not securely encrypted and the payload protocol must complete its own
encryption to protect traffic confidentiality.

This value must be same for both inbound and outbound.

You can generate this value with the following command:
`cat /dev/urandom|head -c 32|base64`


> `forwardTag` : string

The outbound tag for the traffic to the [Forwarded TLS Service](#forwarded-tls-service) for an inbound and to the covert server for outbound.

This is typically point to a `freedom` or direct outbound.

> `forwardPort` : number

::: tip
This value is only used in inbound.
:::

The port of the [Forwarded TLS Service](#forwarded-tls-service).

> `forwardAddress` : string
::: tip
This value is only used in inbound.
:::

The network host address of the [Forwarded TLS Service](#forwarded-tls-service).

> `explicitNonceCiphersuites` : [ number ]

A list of cipher suites identifiers that uses an explicit nonce in its encrypted application data.

This value should be encoded in base 10 numbers, notwithstanding its typical notation of 2 hex encoded octets.

This value must be same for both inbound and outbound.

::: danger
This `explicitNonceCiphersuites` value must be correctly configured or the traffic will either break down or become identifiable.
:::

> `transportLayerPadding`: [TransportLayerPadding](#transport-layer-padding-setting)

The transport layer padding setting. This feature is currently not fully implemented, unset this field if forward compatibility is not required.  

> `deferInstanceDerivedWriteTime`: [Time Spec](#time-spec)
::: tip
This value is typically only useful for inbound.
:::

A randomized time to wait before writing data back, if response if generate by v2ray instance.

This is used to break timing attack that measure the time for each round trip to discover pattern, as instance generated reply is faster than proxied traffic.


> `carrierConnectionTag`: string
::: tip
This value is only used in outbound.
:::

The outbound tag to receive carrier connection on. The payload traffic will be then be overladed on this connection.

Please only route traffic that the [Forwarded TLS Service](#forwarded-tls-service) is willing to process to this outbound.

Be aware that presently this outbound port does not exist until the first client connection to server was made.

> `embeddedTrafficGenerator`: [Traffic Generator Setting](#traffic-generator-setting)

The embedded traffic generator to produce tls traffic on demand. This setting is required if there is no external traffic being routed to `carrierConnectionTag` outbound.

An embedded traffic generator is currently recommended for most setup.

## Traffic Generator Setting

> `securitySettings`: special

Traffic generator will use the security settings of TLSMirror transport if this value is unset.

Please unset this field and configure Traffic Generator's TLS setting with TLSMirror transport's security settings, as this is an engineering option.

> `steps`: [ [Traffic Generator Step Specification](#traffic-generator-step-specification) ]

The steps to take in order to generate the traffic.

The traffic generate walk through these steps starting with step 0 over a markov-like process.

## Traffic Generator Step Specification

> `host`: string

The hostname to be sent in the http host header.

> `path`: string

The path of the http request generated, like `/robots.txt`.

> `method`: string

the method name of the http request generated.

> `headers`: [ [Header](#header) ]

The headers to be sent in HTTP request. 

> `nextStep`: [Next Step Specification](#next-step-specification)

The probabilistic jump table executed after this step.

> `connectionReady`: bool

If set to true, once this step is completed, the payload traffic can start being relayed on this carrier connection.

> `waitTime`: [Time Spec](#time-spec)
The time to wait before sending next request.

The traffic generator will always finish the current request unless otherwise specified.

> `h2DoNotWaitForDownloadFinish`: bool
If set to true and http2 connection was negotiated, do not wait for response to be fully downloaded before moving to next step once wait time has passed.

## Next Step Specification

> `weight`: number

An integer weight of possibility of this jump happening.

> `gotoLocation`: number

The location to jump to in the step specification array.

## Forwarded TLS Service

Forwarded TLS Service can be any TLS endpoints, so long as it serves either TLS1.2 or TLS1.3 traffic. When used together with embedded traffic generator, HTTPS sites are recommended.

Unlike other similar protocols, TLSMirror can process TLS1.2 correctly, 
including AEAD cipher suites with explicit nonces(so long as it is an increasing int64 counter, 
and transport is correctly configured of the identifiers of these cipher suites).

## Time Spec

::: tip
One second is 1000000000 nano seconds.
:::

The final wait time is 

`baseNanoseconds` + `uniformRandomMultiplierNanoseconds` * `uniformRandom`,
where `uniformRandom` is a variable `∈ [0,1)` and subject to uniform random distribution.

> `baseNanoseconds`: number

> `uniformRandomMultiplierNanoseconds`: number

## Header

> `key` : string

The HTTP header key.

> `value` : string

The HTTP header value.

## Transport Layer Padding Setting

> `enabled`: bool

Whether transport layer padding is enabled.

This value must be same for both inbound and outbound.