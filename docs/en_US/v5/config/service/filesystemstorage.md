# File System Storage
* Name: `filesystemstorage`
* Type: Service
* ID: `service.filesystemstorage`

File system storage is a persistent storage implementation that stores information using plain files. (v5.27.0+)

Please ensure that the provided file system supports long file names.

> `stateStorageRoot`: ["WorkDir"]

The location to store states. Currently, only `WorkDir` is supported. This is the directory from which v2ray is running.

> `instanceName`: string

The name of the current instance. This will become the directory name where the states are stored.
