# TLSMirror

::: danger
This protocol is currently unreleased and is currently in developer preview phase. Please only use it with fully understanding of its risk.
:::

TLSMirror is a looks like TLS protocol that designed to look like a port forwarder or SNI proxy while covertly transport payload traffic mixed with untouched carrier traffic. (unreleased)

::: info
TLSMirror has a machine-generated specification from source code: [TLSMirror Spec](https://gist.github.com/xiaokangwang/622dffd24ec144a11260dd1b8baf7dc0#file-tlsmirror-spec-md).
:::

## Protocol Architecture

TLSMirror operates by maintaining a carrier TLS connection between a forwarded client and forwarded server, while covertly inserting encrypted payload traffic into the same connection. The architecture involves four entities:

1. **Forwarded Client**: An external TLS client (e.g., a web browser) initiating the connection.
2. **TLSMirror Client**: Receives the carrier connection and forwards it to TLSMirror Server.
3. **TLSMirror Server**: Receives the forwarded connection and forwards it to the forwarded server.
4. **Forwarded Server**: The real destination server (e.g., target.example.com).

### Key Design Principle: No Handshake Modification

TLSMirror does **NOT** modify any TLS handshake messages. Handshake records pass through without modification, meaning carrier traffic remains bit-identical to legitimate TLS traffic during the handshake. This allows any TLS client to generate carrier traffic without leaving fingerprints.

### Basic Operation

The TLSMirror client and server parse the TLS stream into individual frames and insert additional encrypted application data frames containing payload traffic. Both TLSMirror endpoints attempt to decrypt each application data frame:

- **Success**: The frame contains payload data for the application handler (consumed by TLSMirror, NOT forwarded).
- **Failure**: The frame is from the forwarded client/server and is passed through transparently.

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

or

`v2ray engineering generate-random-data -length 32`


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


**Recommended Values:**
`[156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 49195, 49196, 49197, 49198, 49199, 49200, 49201, 49202, 49290, 49291, 49293, 49316, 49317, 49318, 49319, 49320, 49321, 49322, 49323, 49324, 49325, 49326, 49327, 52392, 52393, 52394, 52395, 52396, 52397, 52398]`

These values cover a comprehensive set of TLS 1.2 cipher suites that utilize an explicit nonce (such as AES-GCM and AES-CCM). Including this full list ensures that TLSMirror can correctly identify and process application data records across a wide variety of legitimate carrier traffic, preventing connection failures or detection due to incorrect record parsing.


This value must be same for both inbound and outbound.

::: note
For TLS 1.2, TLSMirror expects the initial nonce to be 0. Does not work with all TLS implementations. It is recommended to test this yourself.
:::

::: danger
This `explicitNonceCiphersuites` value must be correctly configured or the traffic will either break down or become identifiable.
:::

> `transportLayerPadding`: [TransportLayerPadding](#transport-layer-padding-setting)

The transport layer padding setting. This feature is currently not fully implemented, unset this field if forward compatibility is not required.

**Padding Format:**
- **With Data (length > 4)**: `[application_data][padding][4-byte data_length]`
- **Data-length only (length <= 4)**: `[padding_only]`

> `deferInstanceDerivedWriteTime`: [Time Spec](#time-spec)
::: tip
This value is typically only useful for inbound.
:::

A randomized time to wait before writing data back, if response if generate by v2ray instance.

This is used to break timing attack that measure the time for each round trip to discover pattern, as instance generated reply is faster than proxied traffic.

**Delay Calculation:**
`delay = baseNanoseconds + random(0, uniformRandomMultiplierNanoseconds)`


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

> `connectionEnrolment` : [Connection Enrolment Setting](#connection-enrolment-setting)

This setting controls connection enrolment system to avoid detection based on redirection attack

> `sequenceWatermarkingEnabled`: bool

Whether to enable sequence watermarking to avoid detection based on TLS frame reordering between inserted frames.

**Watermarking Mechanism:**
- **Purpose**: Defeats frame reordering attacks by making frames position-dependent.
- **Application**: Applies XChaCha20 encryption to the last 16 bytes of application_data and alert records.
- **Timing**: Enabled **AFTER** the first inserted payload frame. The first frame is used to initialize the watermarking stream.

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


## Connection Enrolment Setting

> `primaryIngressOutbound` : string

::: tip
This value is only used in inbound.
:::

The outbound tag for primary connection enrolment connections. Client's primary egress outbound should connect to here.

> `primaryEgressOutbound` : string

::: tip
This value is only used in outbound.
:::

The outbound tag for primary connection enrolment connections. Should be connect to primary ingress outbound on server.

If it is left empty, then a self-enrolment will be attempted to create enrollment connection over itself. Bootstrap enrollment method must be configured. (v5.42.0+, engineering evaluation phase)

> `bootstrap_egress_config` : [ special ]

An array of egress configs. Engineering setting. (v5.42.0+)

> `bootstrap_ingress_config` : [ special ]

An array of ingress configs. Engineering setting. (v5.42.0+)


> `bootstrapEgressUrl` : [ string ]

::: tip
This value is only used in outbound.
:::

The URL to bootstrap egress connection enrolment. (v5.46.0+)

You can convert this url to and from json format with the following command:

`v2ray engineering tlsmirror-enrollment-link -mode json|link`

where the mode specify the output format, json or link. It accept stdin as input and output to stdout by default.

> `bootstrapIngressUrl` : [ string ]

::: tip
This value is only used in inbound.
:::

The URL to bootstrap ingress connection enrolment. (v5.46.0+)


### Enrollment Security

Connection enrollment prevents **redirection attacks** where an attacker redirects the carrier connection directly to the forwarded server. Without enrollment:
1. The forwarded server would receive TLSMirror's encrypted payload frames.
2. Decryption would fail, prompting the server to reject the connection.
3. This rejection pattern allows censors to identify and block TLSMirror users.

Enrollment ensures the client only sends payload data if the TLSMirror Server is confirmed to be handling the connection.

### Control Domain Convention

Bootstrap enrollment verification requests use a special control domain:
`{server_identifier_hex}.tlsmirror-controlconnection.v2fly.arpa`

### Server Inverse Role

Server Inverse Role simplifies deployment by having the TLSMirror server **poll** a relay server for enrollment requests instead of waiting for inbound requests.

**Benefits:**
- Simplified configuration (no separate enrollment inbound handler needed).
- No control domain routing required on the server side (if used exclusively).
- Multiple TLSMirror servers can share a common relay.

The polling mechanism runs in a background worker and uses the same `enrollmentProcessor` as normal enrollment.

### Hosted Enrolment Provider

We provide a hosted service to provide these bootstrap URLs for personal use. You can find the service at `https://v2cloudapi.v2fly.org/`, which requires login with Github. This website also generate a pair of configuration files as an example. 

This service generate a pair of inverse role roundtripper enrolment configurations.

(This document contain machine generated content, and was verified by author.)