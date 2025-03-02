# Release Archive

This article describes the design ideas of the V2Ray core (v2ray-core) release archive.

V2Ray use Github Action to build releases. However, Github Action are usaged based billing product and it is not possible to store logs and artifacts in long term without significant cost.

We instead upload the logs and artifacts to [archive org](https://archive.org/details/v2ray-action-archive-hqfi0pb) with [AutoV2RayActionArchive](https://github.com/xiaokangwang/AutoV2RayActionArchive). You can find expired logs and artifacts there.
