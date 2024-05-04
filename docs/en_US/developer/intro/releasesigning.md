# Release Signing

This article describes the design ideas of the V2Ray core (v2ray-core) release signing.

All stable release of V2Ray are signed in [Signify](https://man.openbsd.org/signify) with a the private key corresponding to

```
untrusted comment: V2Fly Signing Key
RWTe6SReSmJUeqoA8cq1MxX7ycL06DAMAJcAgQ8dCN3kFtnWBHYDpTnx
```

The file being signed is a manifest file named 'Release' with the checksums of all binaries, including unzipped content of zip files.

## Binary Transparency

The signed manifest file is published to [rekor](https://github.com/sigstore/rekor) by signing the sha512 hash of the 'Release' file with a topic key. You can generate a list of all the file signed with [rekor-monitor](https://github.com/sigstore/rekor-monitor) with the following commands:

```
echo 'rekor.sigstore.dev - 2605736670972794746\n86482791\nFehZ1/6CqPAFDaEM1N4xOsFZO1rD6v8nmu8yMjUqzAg=\n\n— rekor.sigstore.dev wNI9ajBEAiBTwFlsQciw2QNcGmPqCfPnArWAV9kgEygav9EeVsa+RgIgC0Q4vazfZksnzDkqpv687OTF99KnwtI8fb9a9pUHoOU=\n' > logInfo.txt
verifier -monitored-values "$(echo "ZmluZ2VycHJpbnRzOgogIC0gMzk3YzQ1MTJiZDRjMWIxYWQ4MjIxNTAzNDVkMTczNTUwZjRmNmE0NGJlOTM1MzVmZmVlYzRhZTQyZDg2ZGEzMg=="|base64 -d)" --once
```

The topic key is used to generate a list of hash value submitted to rekor by V2Ray. It is not used for verifying release. The topic key design is necessary as rekor does not support signed message, only detached signature.
