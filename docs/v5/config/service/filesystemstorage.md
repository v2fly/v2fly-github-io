# 文件系统持久存储
* 名称: `filesystemstorage`
* 类型: Service
* ID: `service.filesystemstorage`

文件系统存储是一种使用普通文件存储数据的持久存储实现。(v5.27.0+)

请确保所使用的文件系统支持长文件名。

> `stateStorageRoot`: ["WorkDir"]

存储位置。目前，仅支持 `WorkDir`。这是 v2ray 运行的目录。

> `instanceName`: 字符串

当前实例的名称。这将成为存储状态的目录名。
