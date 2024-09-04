# Subscription Manager
* Name: `subscription`
* Type: Service
* ID: `service.subscription`

Subscription Manager automatically refresh server information and turn them into outbounds. (v5.13.0+)

This service is not yet usable with the jsonv4 configuration format due to [the current code](https://github.com/v2fly/v2ray-core/blob/cc77e90254b57e552bd745727a7bf402bae3aad9/app/subscription/specs/skeleton.go) looking up jsonv5 configuration format settings outside of `"services"` which conflict with the jsonv4 configuration format.
