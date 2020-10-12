# Step 2: Understand the architecture

This article describes the design ideas of the V2Ray core (v2ray-core).

## aims

* The V2Ray kernel provides a platform that supports the necessary network proxy functions, on top of which can be further developed to provide a better user experience;
* Take cross-platform as the primary principle to reduce the cost of secondary development;

## Architecture

![Architecture](/arch.svg)

The kernel is divided into three layers: application layer, agent layer and transport layer. Each layer contains several modules, which are independent of each other, and modules of the same type can be replaced seamlessly.

## Application layer

The application layer contains some commonly used functions in the proxy layer, which are abstracted out for reuse in different proxy modules. The modules of the application layer should be realized by pure software, and have nothing to do with hardware or platform-related technology.

List of important modules:

* Dispatcher: Used to transfer the data received by the inbound agent to the station agent;
* Router: Built-in routing, see [Routing Configuration](../../config/routing.md);
* DNS: built-in DNS cache;
* Proxy Manager: Inbound proxy manager;

## Agent layer

The proxy layer is divided into two parts: Inbound Proxy and Outbound Proxy. The two parts are independent of each other, the inbound agent does not depend on a specific outbound agent, and vice versa.

### Inbound proxy

* Implement [proxy.Inbound](https://github.com/v2fly/v2ray-core/blob/master/proxy/proxy.go) interface;

### Outbound proxy

* Realize the [proxy.Outbound](https://github.com/v2fly/v2ray-core/blob/master/proxy/proxy.go) interface;

## Transport layer

The transport layer provides some tool modules related to network data transmission.
