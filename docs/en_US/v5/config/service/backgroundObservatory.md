# Background Observatory
* Name: `backgroundObservatory`
* Type: Service
* ID: `service.backgroundObservatory`

> `subjectSelector`: string

The selectors for outbound under observation

> `probeUrl`: string

The URL to send probe request to.

> `probeInterval`: number

The time between each probe in second.

> `persistentProbeResult`: bool

Whether to store probe result in persistent storage. (v5.27.0+)
This requires persistent storage support.
