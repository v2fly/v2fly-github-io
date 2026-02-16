# Service 辅助服务

V2Ray 内置了一些辅助服务来增强和补充 V2Ray 的主要功能。这些服务提供了流量统计、策略管理、连接监控等高级功能。

## 服务分类

### 核心服务

* **[Policy 本地策略](service/policy.md)** - 配置用户等级和连接策略
* **[Stats 统计信息](service/stats.md)** - 统计流量使用情况

### 连接管理服务

* **[后台连接观测](service/backgroundObservatory.md)** - 后台监控出站连接质量
* **[并发连接观测](service/burstObservatory.md)** - 并发测试出站连接性能

### 网络服务

* **[Tun](service/tun.md)** - TUN 设备支持，用于透明代理
* **[订阅管理器](service/subscription.md)** - 管理订阅链接和节点更新
* **[文件系统存储](service/filesystemstorage.md)** - 文件系统持久化存储

### 用户界面

* **[浏览器转发模块](service/browser.md)** - 提供 Web 界面进行配置管理

## 服务使用指南

### 基础用户

如果你只是想使用 V2Ray 的基本代理功能，可以不配置任何辅助服务。V2Ray 会使用默认设置正常工作。

### 高级用户

以下服务适合有特定需求的高级用户：

| 服务 | 使用场景 | 难度 |
|------|---------|------|
| Policy | 多用户管理，流量控制 | ⭐⭐ |
| Stats | 流量监控，使用统计 | ⭐⭐ |
| 后台连接观测 | 自动选择最优出站 | ⭐⭐⭐ |
| 并发连接观测 | 负载均衡优化 | ⭐⭐⭐ |
| Tun | 透明代理，全局代理 | ⭐⭐⭐⭐ |
| 订阅管理器 | 自动更新节点信息 | ⭐⭐⭐ |
| 浏览器转发 | Web 界面管理 | ⭐⭐ |

## 服务详细说明

### Policy - 本地策略

用于配置不同用户等级的连接策略，如超时时间、缓冲区大小等。

**适用场景**：
* 多用户服务器
* 需要区分不同用户的访问权限
* 资源使用控制

### Stats - 统计信息

收集和记录 V2Ray 的流量统计信息，可以按用户、入站、出站统计。

**适用场景**：
* 监控流量使用
* 用户计费
* 性能分析

### 连接观测服务

后台连接观测和并发连接观测服务可以自动测试出站连接的质量，用于智能选择最优线路。

**适用场景**：
* 多服务器负载均衡
* 自动故障切换
* 选择最低延迟线路

### Tun 服务

创建 TUN 虚拟网络接口，实现系统级透明代理。

**适用场景**：
* 全局代理
* 不支持代理的应用
* 路由器部署

**注意**：需要管理员权限

### 订阅管理器

自动从订阅链接更新节点信息，无需手动修改配置。

**适用场景**：
* 使用第三方服务提供的订阅
* 节点信息经常变化
* 简化配置管理

### 浏览器转发模块

提供 Web 界面用于配置管理和切换。

**适用场景**：
* 需要可视化管理界面
* 频繁切换配置
* 多用户共享配置

## 配置示例

### 示例 1：基础服务器配置（Policy + Stats）

```json
{
  "inbounds": [...],
  "outbounds": [...],
  "policy": {
    "levels": {
      "0": {
        "handshake": 4,
        "connIdle": 300
      },
      "1": {
        "handshake": 6,
        "connIdle": 600
      }
    }
  },
  "stats": {}
}
```

### 示例 2：智能路由配置（连接观测）

```json
{
  "inbounds": [...],
  "outbounds": [
    {"tag": "proxy-1", "protocol": "vmess", ...},
    {"tag": "proxy-2", "protocol": "vmess", ...},
    {"tag": "proxy-3", "protocol": "vmess", ...}
  ],
  "observatory": {
    "subjectSelector": ["proxy-1", "proxy-2", "proxy-3"],
    "probeURL": "https://www.google.com/generate_204",
    "probeInterval": "1m"
  },
  "routing": {
    "balancers": [
      {
        "tag": "balancer",
        "selector": ["proxy-"],
        "strategy": {
          "type": "leastping"
        }
      }
    ],
    "rules": [
      {
        "type": "field",
        "network": "tcp,udp",
        "balancerTag": "balancer"
      }
    ]
  }
}
```

### 示例 3：透明代理配置（Tun）

```json
{
  "inbounds": [...],
  "outbounds": [...],
  "tun": {
    "name": "tun0",
    "mtu": 1500,
    "ips": [
      {
        "ip": "10.0.0.1",
        "prefix": 30
      }
    ],
    "routes": [
      {
        "ip": "0.0.0.0",
        "prefix": 0
      }
    ]
  }
}
```

## 最佳实践

1. **按需启用**：只启用你需要的服务，避免不必要的资源消耗
2. **合理配置**：根据实际情况调整策略参数
3. **监控统计**：使用 Stats 服务监控运行状态
4. **定期检查**：定期查看连接观测结果，优化配置
5. **权限管理**：使用 Policy 合理分配不同用户的权限

## 注意事项

* 部分服务需要额外的系统权限（如 Tun）
* 连接观测会产生额外的网络流量
* 过于频繁的观测可能影响性能
* Stats 服务会占用一定的内存
* 浏览器转发模块没有身份认证，注意安全

## 相关文档

* [路由配置](router.md) - 配合连接观测使用
* [出站配置](outbound.md) - 配置被观测的出站连接
* [策略配置详解](service/policy.md) - Policy 详细配置
