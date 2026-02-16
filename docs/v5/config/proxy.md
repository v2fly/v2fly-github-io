# Proxy 代理协议

代理协议定义了代理数据的编码方式。V2Ray 支持多种代理协议，可以根据不同的使用场景选择合适的协议。

## 协议分类

### 入站协议（Inbound）

用于接收客户端连接的协议：

* **[SOCKS](proxy/socks.md)** - 标准的 SOCKS5 协议，支持 TCP 和 UDP
* **[HTTP](proxy/http.md)** - 标准的 HTTP 代理协议
* **[Dokodemo-door](proxy/dokodemo.md)** - 任意门，可以监听任意端口并转发到指定地址

### 出站协议（Outbound）

用于连接到远程服务器的协议：

* **[Freedom](proxy/freedom.md)** - 直接连接，用于不经过代理的直连
* **[Blackhole](proxy/blackhole.md)** - 黑洞，丢弃所有数据
* **[DNS](proxy/dns.md)** - DNS 协议转发
* **[Loopback](proxy/loopback.md)** - 回环，将连接转发到指定的入站

### 入站/出站协议

可以同时用作入站和出站的代理协议：

#### 主流加密代理协议

* **[VMess](proxy/vmess.md)** - V2Ray 原创协议，支持多种加密方式和传输方式
* **[VLESS](proxy/vless.md)** - 轻量级协议，性能更好，支持 XTLS
* **[Trojan](proxy/trojan.md)** - 模拟 HTTPS 流量的协议
* **[Shadowsocks](proxy/shadowsocks.md)** - 经典的 Shadowsocks 协议
* **[Shadowsocks 2022](proxy/shadowsocks2022.md)** - Shadowsocks 2022 新版协议

#### 实验性协议

* **[VLite](proxy/vlite.md)** - 轻量级实验协议
* **[Hysteria2](proxy/hy2.md)** - 基于 QUIC 的高性能协议

## 协议选择指南

### 按使用场景选择

| 场景 | 推荐协议 | 说明 |
|------|---------|------|
| 通用代理 | VLESS + TLS | 性能好，安全性高 |
| 高性能需求 | VLESS + XTLS | 最佳性能 |
| 兼容性需求 | VMess | 功能完善，广泛支持 |
| 伪装 HTTPS | Trojan | 流量特征最像真实 HTTPS |
| 轻量级部署 | Shadowsocks | 简单易用 |
| 弱网环境 | Hysteria2 | 专为弱网优化 |

### 按安全性选择

1. **高安全性**：VLESS + XTLS/TLS、Trojan + TLS
2. **中等安全性**：VMess、Shadowsocks 2022
3. **基础安全性**：Shadowsocks

### 按性能选择

1. **高性能**：VLESS + XTLS、Hysteria2
2. **中等性能**：VLESS、VMess、Trojan
3. **轻量级**：Shadowsocks、VLite

## 协议详细说明

### [VMess](proxy/vmess.md)

V2Ray 原创的加密通信协议。

* ✅ 支持多种加密方式
* ✅ 支持动态端口
* ✅ 支持时间验证
* ❌ 性能开销相对较大

### [VLESS](proxy/vless.md)

轻量级协议，去除了 VMess 的一些特性以提升性能。

* ✅ 性能优秀
* ✅ 支持 XTLS（极速传输）
* ✅ 流量特征更难识别
* ⚠️ 需要 TLS 保证安全性

### [Trojan](proxy/trojan.md)

模拟标准 HTTPS 流量的协议。

* ✅ 流量特征接近真实 HTTPS
* ✅ 易于部署
* ✅ 良好的兼容性
* ⚠️ 依赖 TLS

### [Shadowsocks](proxy/shadowsocks.md) / [Shadowsocks 2022](proxy/shadowsocks2022.md)

经典的代理协议，简单高效。

* ✅ 配置简单
* ✅ 轻量级
* ✅ 广泛支持
* ⚠️ Shadowsocks 2022 提供了更强的安全性

### [Hysteria2](proxy/hy2.md)

基于 QUIC 协议的高性能代理。

* ✅ 专为弱网环境优化
* ✅ 支持 BBR 拥塞控制
* ✅ 低延迟
* ⚠️ 需要 UDP 支持

### 工具协议

* **[Freedom](proxy/freedom.md)** - 用于直接连接目标服务器
* **[Blackhole](proxy/blackhole.md)** - 用于屏蔽特定流量（如广告）
* **[DNS](proxy/dns.md)** - 用于 DNS 查询拦截和转发
* **[Loopback](proxy/loopback.md)** - 用于实现复杂的路由逻辑

### 入站专用协议

* **[SOCKS](proxy/socks.md)** - 标准 SOCKS5 协议，本地代理常用
* **[HTTP](proxy/http.md)** - 标准 HTTP 代理协议
* **[Dokodemo-door](proxy/dokodemo.md)** - 任意门，用于透明代理

## 配置建议

1. **客户端配置**：
   - 入站使用 SOCKS 或 HTTP
   - 出站使用 VLESS/VMess/Trojan 连接服务器
   - 配置 Freedom 用于直连

2. **服务端配置**：
   - 入站使用 VLESS/VMess/Trojan 接收客户端连接
   - 出站使用 Freedom 访问目标网站

3. **中转服务器**：
   - 入站和出站都使用加密协议
   - 根据网络环境选择合适的协议和传输方式

## 相关文档

* [入站配置](inbound.md) - 如何配置入站连接
* [出站配置](outbound.md) - 如何配置出站连接
* [传输方式](stream.md) - 不同的数据传输方式
* [路由配置](router.md) - 如何进行流量分流
