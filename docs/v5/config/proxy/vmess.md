# VMess

[VMess](../../../developer/protocols/vmess.md) 是一个加密传输协议，它分为入站和出站两部分，通常作为 V2Ray 客户端和服务器之间的桥梁。

VMess 依赖于系统时间，请确保使用 V2Ray 的系统 UTC 时间误差在 90 秒之内，时区无关。在 Linux 系统中可以安装`ntp`服务来自动同步系统时间。

## VMess 入站

inbound.vmess

> `users` : [string]

一组服务器认可用户的 ID，必须为合法的 UUID。

## VMess 出站

outbound.vmess

> `address`: string

服务器地址，支持 IP 地址或者域名。

> `port`: number

服务器端口号。

> `uuid`: string

服务器认可的 VMess 用户 ID，必须为合法的 UUID。

#### 服务器示例配置：

此配置为vmess+ws+tls实践配置，此配置推荐用于直连服务器：
```json
{
  "log": {
    "loglevel": "info"
  },
  "inbounds": [
    {
      "port": 443, //这里建议用443（HTTPS标准端口，虽然现在所有的实践表明端口号和被封禁频率没有关系，但是设置为443可以加强伪装）
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "6225d026-dfda-4bcc-a5f5-07cd22fc0c8f",
            "alterId": 0, //设置为0以开启AEAD
            "security": "auto"
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/guojixinwen" //加入TLS后，这个path用于认证，请设置不易被猜测的路径
        },
        "security": "tls",
        "tlsSettings": {
          "certificates": [
            {
              "certificateFile": "/root/crt.crt", //使用CA或自签名证书
              "keyFile": "/root/key.key"
            }
          ]
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {}
    }
  ]
}
```
vmess+httpupgrade配置如下,这个传输层在性能上有一定的提升，适合过CDN:
```json
{
    "log": {
        "error": {
            "level": "info"
        },
        "access": {
            "type": "None"
        }
    },
    "inbounds": [
        {
            "protocol": "vmess",
            "settings": {
                "users": [
                    "34455e67-fb2f-4fba-9b06-a633937a2263"
                ]
            },
            "port": 80,
            "streamSettings": {
                "transport": "httpupgrade",
                "transportSettings": {
                    "path": "/download",
                    "host": "proxy.example.net" //这里请改为你的服务器地址
                },
                "security": "none"
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom"
        }
    ]
}
```
