# 配置文件格式

:::tip
您可以在 [这里](/config/overview.md) 查看 V4 版本的配置文件文档。
:::

## 概述

在 V5 版本中，引入了新的配置格式。此配置格式旨在替换过去版本的配置格式。目前此格式仍处于草案阶段，可能会被随时更改。

:::tip
执行 `./v2ray run -c $configure_file_name -format jsonv5` 命令以运行您的配置文件。
:::

```json
{
    "log": {},
    "dns": {},
    "router": {},
    "inbounds": [],
    "outbounds": [],
    "services": {}
}
```

> `log`: [LogObject](#logobject)

日志设置，配置 V2Ray 的日志输出行为。

若未设置此项，则使用默认值。

> `dns`: [DnsObject](dns.md)

内置的 DNS 客户端，用于设置 DNS 解析。

若未设置此项，则默认使用本机的 DNS 设置。

> `router`: [RoutingObject](router.md)

路由功能。

若未设置此项，则所有流量都会被转发到第一个出站。

> `inbounds`: \[ [InboundObject](inbound.md) \]

入站设置。

> `outbounds`: \[ [OutboundObject](outbound.md) \]

出站设置。

> `services`: \[ [ServiceObject](service.md) \]

辅助服务，配置附加组件的功能。

使用软件的基本功能不需要配置此项，但是可以通过配置此项以使用高级功能。

## LogObject

`LogObject` 是配置文件中 `log` 字段所使用的 JSON 字段。

```json
{
    "access":{},
    "error":{}
}
```

> `access`: [LogSpecObject](#logspecobject)

访问日志设置。

> `error`: [LogSpecObject](#logspecobject)

错误日志设置。

## LogSpecObject

> `type`: "None" | "Console" | "File"

* `"None"`：日志将被丢弃。
* `"Console"`：日志将被输出到标准输出。
* `"File"`：日志将被输出到一个文件。

> `path`: string

日志的文件路径，其值是一个合法的文件路径， 例如 `"/tmp/v2ray/_error.log"` (Linux) 或 `"C:\\Temp\\v2ray\\_error.log"` (Windows)。

> `level`: "Debug" | "Info" | "Warning" | "Error" | "None"

日志等级，默认值为 `"Warning"`。

* `"Debug"`：详细的调试性信息。同时包含所有 `"Info"` 内容
* `"Info"`：V2Ray 在运行时的状态，不影响正常使用。同时包含所有 `"Warning"` 内容。
* `"Warning"`：V2Ray 可能遇到了一些问题，通常是外部问题，不影响 V2Ray 的正常运行，但有可能影响用户的体验。同时包含所有 `"Error"` 内容。
* `"Error"`：V2Ray 遇到了无法正常运行的问题，需要立即解决。
* `"None"`：不记录任何内容。

## 配置示例

以下是一些常见的 V5 配置示例，帮助您快速入门。

### 示例 1：基础客户端配置

一个简单的客户端配置，连接到 VMess 服务器：

```json
{
  "log": {
    "access": {
      "type": "None"
    },
    "error": {
      "type": "Console",
      "level": "Warning"
    }
  },
  "inbounds": [
    {
      "tag": "socks-in",
      "port": 1080,
      "listen": "127.0.0.1",
      "protocol": "socks",
      "settings": {
        "udp": true
      }
    }
  ],
  "outbounds": [
    {
      "tag": "proxy",
      "protocol": "vmess",
      "settings": {
        "address": "server.example.com",
        "port": 443,
        "uuid": "b831381d-6324-4d53-ad4f-8cda48b30811"
      },
      "streamSettings": {
        "network": "ws",
        "security": "tls",
        "tlsSettings": {
          "serverName": "server.example.com"
        },
        "wsSettings": {
          "path": "/v2ray"
        }
      }
    }
  ]
}
```

### 示例 2：带路由的客户端配置

配置国内直连、国外代理的分流规则：

```json
{
  "log": {
    "error": {
      "type": "Console",
      "level": "Warning"
    }
  },
  "dns": {
    "servers": [
      {
        "address": "223.5.5.5",
        "domains": ["geosite:cn"],
        "expectIPs": ["geoip:cn"]
      },
      {
        "address": "1.1.1.1",
        "domains": ["geosite:geolocation-!cn"]
      }
    ]
  },
  "inbounds": [
    {
      "tag": "socks-in",
      "port": 1080,
      "protocol": "socks",
      "settings": {
        "udp": true
      }
    }
  ],
  "outbounds": [
    {
      "tag": "proxy",
      "protocol": "vmess",
      "settings": {
        "address": "server.example.com",
        "port": 443,
        "uuid": "b831381d-6324-4d53-ad4f-8cda48b30811"
      },
      "streamSettings": {
        "network": "tcp",
        "security": "tls"
      }
    },
    {
      "tag": "direct",
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIPv4"
      }
    },
    {
      "tag": "block",
      "protocol": "blackhole",
      "settings": {
        "response": {
          "type": "http"
        }
      }
    }
  ],
  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "rules": [
      {
        "type": "field",
        "domain": ["geosite:category-ads-all"],
        "outboundTag": "block"
      },
      {
        "type": "field",
        "domain": ["geosite:cn"],
        "outboundTag": "direct"
      },
      {
        "type": "field",
        "ip": ["geoip:cn", "geoip:private"],
        "outboundTag": "direct"
      }
    ]
  }
}
```

### 示例 3：基础服务端配置

一个简单的 VMess 服务端配置：

```json
{
  "log": {
    "access": {
      "type": "File",
      "path": "/var/log/v2ray/access.log"
    },
    "error": {
      "type": "File",
      "path": "/var/log/v2ray/error.log",
      "level": "Warning"
    }
  },
  "inbounds": [
    {
      "tag": "vmess-in",
      "port": 443,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "b831381d-6324-4d53-ad4f-8cda48b30811",
            "alterId": 0,
            "email": "user@example.com"
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "security": "tls",
        "tlsSettings": {
          "certificates": [
            {
              "certificateFile": "/path/to/cert.crt",
              "keyFile": "/path/to/key.key"
            }
          ]
        },
        "wsSettings": {
          "path": "/v2ray"
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "tag": "direct"
    }
  ]
}
```

### 示例 4：中转服务器配置

配置一个中转服务器，接收来自客户端的连接并转发到后端服务器：

```json
{
  "inbounds": [
    {
      "tag": "vmess-in",
      "port": 443,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "b831381d-6324-4d53-ad4f-8cda48b30811"
          }
        ]
      },
      "streamSettings": {
        "network": "tcp",
        "security": "tls",
        "tlsSettings": {
          "certificates": [
            {
              "certificateFile": "/path/to/cert.crt",
              "keyFile": "/path/to/key.key"
            }
          ]
        }
      }
    }
  ],
  "outbounds": [
    {
      "tag": "backend",
      "protocol": "vmess",
      "settings": {
        "address": "backend.example.com",
        "port": 10086,
        "uuid": "5782a22c-8e2e-4d53-ad4f-8cda48b30811"
      },
      "streamSettings": {
        "network": "tcp"
      }
    }
  ]
}
```

### 示例 5：多用户服务端

配置多个用户，并为不同用户设置不同的策略：

```json
{
  "log": {
    "error": {
      "type": "Console",
      "level": "Warning"
    }
  },
  "inbounds": [
    {
      "port": 443,
      "protocol": "vmess",
      "settings": {
        "clients": [
          {
            "id": "user1-uuid-here",
            "email": "user1@example.com",
            "level": 0
          },
          {
            "id": "user2-uuid-here",
            "email": "user2@example.com",
            "level": 1
          },
          {
            "id": "vip-uuid-here",
            "email": "vip@example.com",
            "level": 2
          }
        ]
      },
      "streamSettings": {
        "network": "tcp",
        "security": "tls",
        "tlsSettings": {
          "certificates": [
            {
              "certificateFile": "/path/to/cert.crt",
              "keyFile": "/path/to/key.key"
            }
          ]
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "tag": "direct"
    }
  ],
  "policy": {
    "levels": {
      "0": {
        "handshake": 4,
        "connIdle": 300,
        "uplinkOnly": 2,
        "downlinkOnly": 5
      },
      "1": {
        "handshake": 6,
        "connIdle": 600,
        "uplinkOnly": 4,
        "downlinkOnly": 10
      },
      "2": {
        "handshake": 10,
        "connIdle": 1200,
        "uplinkOnly": 8,
        "downlinkOnly": 20
      }
    }
  }
}
```

## 最佳实践

1. **日志配置**：在生产环境中，建议将日志输出到文件而非控制台，并定期清理日志文件
2. **安全性**：始终在公网服务器上使用 TLS 加密
3. **路由规则**：合理配置路由规则，避免所有流量都经过代理
4. **DNS 配置**：正确配置 DNS 可以有效防止 DNS 污染和提高解析速度
5. **性能优化**：根据实际需求调整用户等级策略，避免资源浪费

## 从 V4 迁移到 V5

V5 配置格式与 V4 有所不同，主要变化包括：

* 配置结构更加扁平化
* 部分字段名称发生变化
* 运行命令需要添加 `-format jsonv5` 参数

建议参考上述示例，逐步将 V4 配置迁移到 V5 格式。

## 相关文档

* [入站配置](inbound.md)
* [出站配置](outbound.md)
* [路由配置](router.md)
* [DNS 配置](dns.md)
* [代理协议](proxy.md)
* [传输方式](stream.md)
* [辅助服务](service.md)
