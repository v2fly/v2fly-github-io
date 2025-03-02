# 发布签名

本文介绍了 V2Ray 核心（v2ray-core）发布签名的设计理念。

所有稳定版本的 V2Ray 均使用 [Signify](https://man.openbsd.org/signify) 进行签名，其私钥对应如下内容：

```
untrusted comment: V2Fly Signing Key
RWTe6SReSmJUeqoA8cq1MxX7ycL06DAMAJcAgQ8dCN3kFtnWBHYDpTnx
```

被签名的文件是一个名为“Release”的清单文件，其中包含所有二进制文件的校验和，包括 zip 文件解压后的内容。

## 二进制透明度

签名后的清单文件通过使用主题密钥对“Release”文件的 sha512 哈希值进行签名后发布到 [rekor](https://github.com/sigstore/rekor)。你可以使用以下命令，通过 [rekor-monitor](https://github.com/sigstore/rekor-monitor) 生成所有文件签名的列表：

```
echo 'rekor.sigstore.dev - 2605736670972794746\n86482791\nFehZ1/6CqPAFDaEM1N4xOsFZO1rD6v8nmu8yMjUqzAg=\n\n— rekor.sigstore.dev wNI9ajBEAiBTwFlsQciw2QNcGmPqCfPnArWAV9kgEygav9EeVsa+RgIgC0Q4vazfZksnzDkqpv687OTF99KnwtI8fb9a9pUHoOU=\n' > logInfo.txt
verifier -monitored-values "$(echo "ZmluZ2VycHJpbnRzOgogIC0gMzk3YzQ1MTJiZDRjMWIxYWQ4MjIxNTAzNDVkMTczNTUwZjRmNmE0NGJlOTM1MzVmZmVlYzRhZTQyZDg2ZGEzMg=="|base64 -d)" --once
```

主题密钥用于生成 V2Ray 提交给 rekor 的哈希值列表，并不用于验证发布内容。设计主题密钥是必要的，因为 rekor 不支持带签名的消息，仅支持分离式签名。
