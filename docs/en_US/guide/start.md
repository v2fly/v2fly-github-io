# Basics

You will need to configure the V2Ray after the [installation](install.md). For demostration purposes, we will only introduce the basic configuration. If a complex configuration is required, please refer to [Config Reference](../config/overview.md).



## Server Side

To circumvent censorship, a server with unfettered access to the Internet is required. 

```json
{
    "inbounds": [
        {
            "port": 10086, // Server Listening Port
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

Make sure the `id` and port number match the client side configuration. 

## Client Side

Run the following configuration on the client side. 

```json
{
    "inbounds": [
        {
            "port": 1080, // SOCKS Proxy Port. Configure the browser proxy to use this port.
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
                        "address": "server", // Server address: Change to your server hostname or ip address.
                        "port": 10086, // Server Listening Port
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

The only part need to be changed in the config above is the server address as mentioned in the comment. These config will proxy your traffic to the server except for local networks, such as your router.

## Start V2Ray

* In Windows and macOS, the defualt config file `config.json` is located in the same directory as V2Ray. Start V2Ray by simply running `v2ray` or `v2ray.exe`.
* In Linux, the defualt config file is located in either `/etc/v2ray/` or `/usr/local/etc/v2ray/` directory. Start V2Ray with `v2ray --config=/etc/v2ray/config.json`. Alternatively, use systemd to run V2Ray as daemon.

More detailed documentations can be found in [Config Reference](../config/overview.md) page.
