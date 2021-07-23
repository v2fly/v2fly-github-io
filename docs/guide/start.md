# Novice Guide

[Download and install](install.md) After V2Ray is installed, you need to configure it. For demonstration, only simple configuration methods are introduced here. If you need to configure more complex functions, please refer to the subsequent [Configuration Document](../config/overview.md).

## server

You need a server outside the firewall to run V2Ray on the server side. The configuration is as follows:

```json
{
    "inbounds": [
        {
            "port": 10086, // server listening port
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

To successfully connect, you need to make sure that the `id` and port are consistent with the client in the server configuration.

## Client

In your PC (or mobile phone), you need to run V2Ray with the following configuration:

```json
{
    "inbounds": [
        {
            "port": 1080, // SOCKS proxy port, you need to configure the proxy in the browser and point to this port
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
                        "address": "server", // server address, please modify it to your own server ip or domain name
                        "port": 10086, // server port
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

The only place to change the above configuration is your server IP, which is indicated in the configuration. The above configuration will forward all traffic except the local area network (such as access router) to your server.

## run

* In Windows and macOS, the configuration file is usually the `config.json` file in the same directory of V2Ray. Just run `v2ray` or `v2ray.exe` directly.
* In Linux, the configuration file is usually located in the `/etc/v2ray/` or `/usr/local/etc/v2ray/` directory. Run `v2ray --config=/etc/v2ray/config.json`, or use tools such as systemd to run V2Ray as a service in the background.

For more detailed instructions, please refer to [Configuration Document](../config/overview.md) and [New Vernacular Guide](https://guide.v2fly.org/).
