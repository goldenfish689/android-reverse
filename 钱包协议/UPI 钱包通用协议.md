

**覆盖平台：** Amazon Pay、MobiKwik、PhonePe、Bharatpe business，Airtel、FreeCharge、Paytm  
**文档目的：** 描述此类 UPI 钱包 App 在 OTP 登录、查询 UPI ID、查询流水三类核心功能上的接口模型、参数规范、加密机制及安全措施。

---

## 一、总体架构概述

### 1.1 通信协议

平台均采用 HTTPS（TLS），部分平台启用 HTTP/2。请求格式以 JSON 为主，部分旧接口采用 HTML 页面渲染 + 解析模式（如 Amazon Pay）。

### 1.2 整体会话生命周期

```
设备初始化/注册
      ↓
获取加密公钥（部分平台）
      ↓
请求发送 OTP（输入手机号）
      ↓
验证 OTP → 获取 Auth Token / Cookie / Session
      ↓
查询 UPI ID（依赖已登录 Token）
      ↓
查询流水列表（依赖已登录 Token，支持分页）
      ↓
查询流水详情（可选）
      ↓
Token 刷新 / 退出登录
```

---

## 二、OTP 登录接口

### 2.1 功能定义

OTP 登录是 UPI 钱包的标准身份认证方式，分为两步：

- **Step 1 - 请求发送 OTP**：客户端提交手机号，服务端向该手机号发送一次性验证码（4~6位）。
- **Step 2 - 验证 OTP**：客户端提交验证码，服务端验证通过后返回认证凭证（Token/Cookie），用于后续所有接口的身份标识。

部分平台（Paytm）在 OTP 验证后还存在多步 OAuth2 授权流程（获取 state token → 获取 authorization code → 换取 access token），最终产生有效期约1个月的 Bearer Token。

### 2.2 前置步骤

在请求 OTP 前，各平台通常存在一个或多个前置步骤：

| 步骤  | 描述  | 典型参数 |
| --- | --- | --- |
| 设备注册/配置 | 向服务端上报设备信息，获取设备级初始 Token 或 Session | 设备ID、OS版本、机型、应用版本 |
| 获取加密公钥 | 从服务端获取 RSA 公钥（有效期约36小时），用于后续请求体加密 | 无需入参，返回公钥字符串及有效期 |
| 获取初始 Cookie/CSRF Token | 初始化会话上下文，获取后续请求必须携带的 cookie 或 CSRF 标识符 | 无需入参，通过响应 Set-Cookie 获取 |
| 初始化 Session ID | 创建本次登录会话，返回 sessionId 供后续步骤使用 | 手机号、设备标识、登录流程类型 |

### 2.3 请求 OTP 接口

**请求方式：** POST  
**认证状态：** 无需登录（匿名请求）

**通用请求参数：**

| 参数位置 | 参数名 | 类型  | 说明  |
| --- | --- | --- | --- |
| Header | Content-Type | String | `application/json` |
| Header | User-Agent | String | 客户端标识（含App版本、OS版本、机型） |
| Header | 设备ID相关字段 | String | 各平台命名不同，如 `X-Device-ID`、`x-bsy-did`、`x-id` |
| Header | App版本 | String | 如 `X-App-Ver`、`x-bsy-appvn`、`x-app-version` |
| Header | 加密公钥 | String | 部分平台将本次使用的 RSA 公钥放在 Header（如 `pke`） |
| Header | 加密密钥标识 | String | 对 AES 密钥再加密后的结果（如 `cske`），供服务端解密请求体用 |
| Header | CSRF Token | String | 前置步骤获取，防止跨站请求 |
| Body | 手机号（加密后） | String | 用对称算法加密的手机号或明文手机号 |
| Body | 设备ID | String | 与 Header 一致 |
| Body | 应用版本号 | String |     |
| Body | OS信息 | String | Android版本、系统类型 |
| Body | 随机标识符 | String | 如 nonceToken、tid，用于防重放 |

**成功响应关键字段：**

| 字段名 | 说明  |
| --- | --- |
| otpId / nid / sessionId | 本次 OTP 的唯一标识，验证时需回传 |
| otpLength | OTP 位数（4位或6位） |
| 成功状态标识 | 各平台不同，如 `success:true`、`status:"SUCCESS"` |

**常见错误响应：**

- 手机号不存在 / 格式错误
- 请求过于频繁（触发限频）
- 设备未授权

### 2.4 验证 OTP 接口

**请求方式：** POST  
**认证状态：** 无需登录

**通用请求参数：**

| 参数位置 | 参数名 | 类型  | 说明  |
| --- | --- | --- | --- |
| Header | 与发送 OTP 接口相同的设备、版本等字段 |     |     |
| Body | OTP 验证码 | String | 用户输入的4~6位验证码 |
| Body | otpId / sessionId / nonceToken | String | 发送 OTP 接口返回的关联标识 |
| Body | 手机号 | String |     |
| Body | 设备ID | String |     |
| Body | 应用版本 | String |     |

**成功响应关键字段：**

| 字段名 | 说明  |
| --- | --- |
| Auth Token / Cookie | 后续所有请求的身份凭证，形态因平台而异（见下表） |
| 用户基础信息 | 账户名、手机号、KYC状态、余额等 |
| UPI 注册状态 | VPA（UPI ID）、绑定状态等（部分平台在此返回） |

**Token 形态对比：**

| 形态  | 说明  | 典型平台 |
| --- | --- | --- |
| HTTP Cookie（app_fc） | 存储在 Set-Cookie，后续请求自动携带 | FreeCharge |
| 响应 Header 字段拼接 | `hashid + "." + token` 组合为 Authorization 字段值 | MobiKwik |
| 响应 Body 中的 accessToken | Bearer Token，需手动提取并在后续请求中带入 Authorization Header | Paytm、PhonePe |
| Session Cookie（多个字段） | `session-token`、`at-acbin` 等多个 Cookie 共同维持会话 | Amazon Pay |
| 动态 token + 静态 token | 两种 token 组合使用，动态 token 用于每次请求 | Airtel |

**OTP 验证失败常见情形：**

- OTP 错误（剩余尝试次数递减）
- OTP 过期（通常有效期约3~5分钟）
- 超过最大尝试次数（通常5次后锁定24小时）


--- 部分隐藏内容---
