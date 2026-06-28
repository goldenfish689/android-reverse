

**覆盖平台：** Amazon Pay、MobiKwik、PhonePe、Airtel、FreeCharge、Paytm  
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

---

## 三、查询 UPI ID 接口

### 3.1 功能定义

登录成功后，查询当前账户绑定的 VPA（Virtual Payment Address，即 UPI ID）。一个账户可能绑定多个 VPA，各 VPA 可能对应不同的 PSP（支付服务提供方，如 @ikwik、@airtel、@ptyes、@freecharge 等）和银行账户。

### 3.2 接口定义

**请求方式：** GET 或 POST（各平台不同）  
**认证状态：** 必须已登录

**通用请求参数：**

| 参数位置 | 参数名 | 类型  | 说明  |
| --- | --- | --- | --- |
| Header | Authorization / Cookie | String | OTP 验证成功后获得的 Auth Token |
| Header | 设备ID字段 | String | 与登录时一致 |
| Header | 设备唯一标识（加密后） | String | 部分平台对设备 ID 进行 RSA 加密后放入特定 Header（如 `authorization`、`h7`、`h8`） |
| URL 参数 | 设备ID、版本等 | String | 部分平台将参数放在 URL Query String 中 |

**成功响应关键字段：**

| 字段名 | 说明  |
| --- | --- |
| vpa / vpaList | UPI ID 字符串，格式为 `手机号@psp标识` 或 `自定义名@psp标识` |
| vpaState | VPA 状态，如 `REGISTERED`、`ACTIVE`、`SECONDARY` 等 |
| isPrimary / isDefault | 是否为主 VPA |
| name | 账户持有人姓名 |
| bankAccounts | 绑定的银行账户列表（账号末四位、IFSC、银行名称） |
| pspName | PSP 名称 |
| registrationStatus | UPI 注册状态 |

**注意事项：**

- 部分平台（如 Airtel）的 UPI ID 查询接口使用独立子域名（如 `upi.airtelbank.com`），与登录接口域名不同。
- 查询前可能需要额外步骤获取后台设备 ID（与本地设备 ID 不同），该 ID 由服务端维护并通过加密接口返回。

---

## 四、查询流水接口

### 4.1 功能定义

查询已登录账户的 UPI / 钱包交易流水，支持分页加载。每条流水记录包含交易时间、金额、交易方向（收/付）、对方信息、交易状态等。部分平台区分钱包流水和银行账户聚合流水。

### 4.2 流水列表接口

**请求方式：** GET 或 POST（各平台不同）  
**认证状态：** 必须已登录

**通用请求参数：**

| 参数位置 | 参数名 | 类型  | 说明  |
| --- | --- | --- | --- |
| Header | Authorization / Cookie | String | Auth Token |
| Header | 设备ID字段 | String |     |
| URL/Body | 页码（pageNumber / pageNo） | Integer | 从0或1开始，各平台不同 |
| URL/Body | 每页条数（count / pageSize） | Integer | 通常10~20条 |
| URL/Body | 时间范围（startDate / endDate） | String | 可选，用于过滤时间区间 |
| URL/Body | 交易类型过滤 | String | 可选，如 UPI、WALLET 等 |
| Body | 翻页游标 | String | 第二页起需传入上一页返回的游标参数 |

**分页机制对比：**

| 机制  | 说明  | 典型表现 |
| --- | --- | --- |
| 基于页码 | 传入 `pageNumber` 递增 | Airtel、Mobikwik |
| 基于游标/索引参数 | 服务端返回 `indexParams` 或 `nextIndexParams`，下次请求时回传 | Amazon Pay |
| 基于游标 ID | 传入上一页最后一条记录的 `globalTxnId + globalTxnType` | FreeCharge |
| 基于时间游标 | 传入 `fromUpdatedDate` 分页 | Paytm |
| 基于 GraphQL | 传入 `startKey` / `lastKey` 等参数 | Amazon Pay（新模式） |

**成功响应关键字段（单条流水）：**

| 字段名 | 说明  |
| --- | --- |
| transactionId / txnId / globalTxnId | 流水唯一标识 |
| amount | 交易金额 |
| mode / txnIndicator / paymentDirection | 交易方向（CREDIT=收款 / DEBIT=付款） |
| date / txnDate / timestamp | 交易时间（Unix 毫秒时间戳） |
| description / title | 交易描述 |
| status | 交易状态（success / FAILURE 等） |
| beneficiaryName / secondPartyInfo | 交易对手方名称 |
| category / txnType | 交易类型（P2P / P2M / 充值 / 退款等） |
| hasMoreToFollow / hasMore / hasMoreTransactions | 是否还有下一页 |

### 4.3 流水详情接口

**请求方式：** GET  
**认证状态：** 必须已登录

**入参：** 流水列表中的 `transactionId` 或详情页 URL  
**返回：** 完整的交易详情，包含 UTR 号、付款方账户、收款方账户、IFSC 码、交易备注、退款信息等。
