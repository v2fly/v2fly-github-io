# 新手上路

[下载并安装](install.md) 了 V2Ray 之后，你需要对它进行一下配置。为了演示，这里只介绍简单的配置方式，如需配置更复杂的功能，请参考后续的 [配置文档](../config/overview.md)。

## 服务器

你需要一台防火墙外的服务器，来运行服务器端的 V2Ray。配置如下：

```json
{
    "inbounds": [
        {
            "port": 10086, // 服务器监听端口
            "protocol": "vmess",
            "settings": {
                "clients": [
                    {
                        "id": "b831381d-6324-4d53-ad4f-8cda48b30811"
                    }
                ]
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

服务器的配置中需要确保 `id` 和端口与客户端一致，就可以正常连接了。

## 客户端

在你的 PC（或手机）中，需要用以下配置运行 V2Ray ：

```json
{
    "inbounds": [
        {
            "port": 1080, // SOCKS 代理端口，在浏览器中需配置代理并指向这个端口
            "listen": "127.0.0.1",
            "protocol": "socks",
            "settings": {
                "udp": true
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "vmess",
            "settings": {
                "vnext": [
                    {
                        "address": "server", // 服务器地址，请修改为你自己的服务器 ip 或域名
                        "port": 10086, // 服务器端口
                        "users": [
                            {
                                "id": "b831381d-6324-4d53-ad4f-8cda48b30811"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "protocol": "freedom",
            "tag": "direct"
        }
    ],
    "routing": {
        "domainStrategy": "IPOnDemand",
        "rules": [
            {
                "type": "field",
                "ip": [
                    "geoip:private"
                ],
                "outboundTag": "direct"
            }
        ]
    }
}
```

上述配置唯一要更改的地方是你的服务器 IP，配置中已注明。上述配置会把除局域网（比如访问路由器）以外的所有流量转发至你的服务器。

## 运行

* 在 Windows 和 macOS 中，配置文件通常是 V2Ray 同目录下的 `config.json` 文件。直接运行 `v2ray` 或 `v2ray.exe` 即可。
* 在 Linux 中，配置文件通常位于 `/etc/v2ray/` 或 `/usr/local/etc/v2ray/` 目录下。运行 `v2ray run -c /etc/v2ray/config.json`，或使用 systemd 等工具将 V2Ray 作为服务在后台运行。

> 可以使用 `v2ray help` 查看具体命令。在 `5.*` 版本之前，运行 `v2ray --config=/etc/v2ray/config.json`. 

更多详细的说明可以参考 [配置文档](../config/overview.md) 和 [新白话文指南](https://guide.v2fly.org/)。
