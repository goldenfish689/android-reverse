# Google Play Integrity 检测机制分析

从去年开始，越来越多的印度 UPI 应用开始接入 Google Play Integrity 完整性校验体系。

---

# 一、Play Integrity 工作原理

Google Play Integrity 基于 GMS（Google Mobile Services）服务实现设备可信度验证。

整体流程如下：

```text
APP
 ↓
Binder IPC
 ↓
Google Play Services（GMS）
 ↓
提交 Nonce
 ↓
返回 Integrity Token
 ↓
APP 上传至业务服务器
 ↓
业务服务器提交 Google 校验
 ↓
返回设备可信结果
```

## 核心特点

- 基于 Binder 与 GMS 跨进程通信
- 与 Google 服务端进行联网验证
- 使用 Nonce（随机挑战值）防重放
- 返回签名保护的 Integrity Token
- 服务端完成最终可信度校验

### 研究重点

主要关注：

- Binder 通信流程
- Nonce 生成逻辑
- Integrity Token 结构
- GMS 与 Google 服务端交互过程
- Token 签名与加密机制
- GMS 获取设备环境信息的方式

---

# 二、设备环境检测维度

Play Integrity 不仅检查设备本身，还会综合评估设备、系统、网络以及运行环境。

## 设备状态检测

- Bootloader 是否解锁
- 是否 Root
- 是否开启调试
- 是否开启 USB Debugging
- 是否开启开发者模式

## 网络环境检测

- VPN 状态
- Proxy 状态
- IP 地址
- TLS 指纹
- 地理位置

## 设备身份检测

- Android ID
- DRM ID
- Device Fingerprint
- SIM 卡状态
- 地区与语言设置

## 系统环境检测

- ROM 类型
- Android 版本
- 系统补丁版本
- 安装应用列表
- Root 工具检测
- Magisk 模块检测

---

# 三、静态检测与动态检测

## 静态检测

主要检测设备当前环境状态：

- 软件环境
- 硬件环境
- 网络环境
- IP 地址
- 代理配置
- TLS 指纹

## 动态检测

主要检测运行时环境：

- Runtime 状态
- 内存扫描
- 进程空间扫描
- 动态代码加载
- Hook 环境检测
- 注入行为检测

---

# 四、Paytm 典型检测机制

以 Paytm 为例，其完整性校验主要集中在两个层面：

## A. 硬件 TEE 层检测

Google 会优先尝试使用：

- Hardware Attestation
- Key Attestation
- TEE（Trusted Execution Environment）

验证设备可信度。

### 检测目标

- Bootloader 状态
- 硬件密钥状态
- KeyBox 信息
- 设备真实性

### 研究方向

部分研究会关注：

- Key Attestation 流程
- Hardware-backed KeyStore
- Device Certification
- 旧设备兼容策略

其核心思路是分析：

Google 如何根据设备能力决定使用何种级别的硬件证明机制。

---

## B. 软件层完整性检测

软件层主要验证：

- Build Fingerprint
- ROM 属性
- 系统配置
- GMS 环境状态
- 系统可信度

### 常见检测内容

- Build.MODEL
- Build.PRODUCT
- Build.DEVICE
- Build.FINGERPRINT
- Build.TAGS
- Build.TYPE

等系统属性。

---

# 五、研究环境中的常见组件

| 组件 | 主要用途 |
|--------|--------|
| BiTGApps | 模块化安装 Google 服务套件 |
| Magisk | Root 与模块管理 |
| KernelSU | 内核级 Root 管理 |
| Play Integrity Fix | 研究系统属性与完整性校验关系 |
| TrickyStore | 研究 Key Attestation 与设备认证机制 |
| Play Integrity API Checker | 检查 Integrity 状态 |
| Key Attestation 工具 | 分析硬件证明结果 |

---

# 六、检测趋势

Google Play Integrity 已经从简单的 Root 检测发展为：

设备可信度评估系统。

其检测维度正在逐步覆盖：

- 硬件层
- 系统层
- 网络层
- 运行时层
- 行为层

未来的风控重点将越来越偏向：

- 设备真实性
- 行为一致性
- Runtime 完整性
- 风险画像

而不再仅仅是传统的 Root 或调试状态检测。
