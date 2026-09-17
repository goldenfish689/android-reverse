# 2026支持清单

## 支持平台（协议版 + 插件版）

| 类别 | 支持平台 |
|--------|--------|
| 主流 UPI 钱包 | PhonePe、Paytm、Mobikwik、FreeCharge、Airtel Money、Amazon Pay、BHIM、IndusPay、MyJio、Google Pay（GPay）、Slice、Tata Neu、Flipkart Pay |
| 商户版钱包 | PhonePe Business、Paytm Business |
| 银行类 APP | Bangkok Bank Mobile Banking、Kotak Bank |
| 持续新增 | 我们会根据客户需求定制接入新的 UPI 钱包及银行 APP |


App	代收能力	代付能力	更偏向	说明
PhonePe	✅	✅	都可以	消费者 UPI，支持 P2P 转账、UPI ID/银行账户付款，也可以接收 UPI 付款。官方明确支持 P2P transfer。
PhonePe Business	✅✅	⚠️	代收	Merchant 产品，核心是 QR/商户收款、交易管理与结算，不应当和消费者 PhonePe 的 P2P 付款能力等同
Paytm	✅	✅	都可以	消费者 UPI，可主动付款，也可接收 UPI 付款。
Paytm Business	✅✅	⚠️/✅	代收为主	核心是 Merchant Collection、QR、Gateway；Paytm 商户体系也存在支付/结算类能力，但与普通 UPI P2P 付款不是一回事。
MobiKwik	✅	✅	都可以	消费者 Wallet + UPI 类型产品
Freecharge	✅	✅	都可以	消费者支付/UPI 产品
MyJio / JioFinance	✅	✅	都可以	综合金融 App 中提供 UPI，不是纯 UPI 钱包
GPay India	✅	✅	都可以	很典型的消费者双向 UPI。Google 明确说明可以 send or receive money。
GPay Business	✅✅	❌/弱	代收	Google 官方定位就是商户接受付款；重点是收款而不是消费者式 P2P 转账。
Moneyview	⚠️	⚠️	非典型	核心定位更偏贷款、信用与金融服务，不建议作为典型 UPI 收付钱包研究样本
BharatPe Business	✅✅	⚠️	代收	非常典型的 Merchant Acquiring 产品：QR 收款、POS、Soundbox、Settlement。
BharatPe UPI（消费者版）	✅	✅	都可以	现在 BharatPe 也有消费者 UPI，官方提供 Scan & Pay；需要和 BharatPe Business 分开看。
super.money	✅	✅	都可以	消费者 UPI/金融产品
Navi	✅	✅	都可以	消费者 UPI + 金融服务
Amazon Pay India	✅	✅	都可以	Amazon India 内的 UPI/支付能力，但不是纯 UPI App
Airtel / Airtel Thanks	✅	✅	都可以	Airtel Payments Bank 官方明确支持 Request/Receive Money、Send Money、UPI ID、IFSC/Account 转账等。
BHIM	✅	✅	都可以	标准消费者 UPI 模型，天然属于 P2P/P2M 双向支付


//==========================================

这里特别强调的一点是：能稳定的查询数据是最重要的！！！其次才是采用什么方案，可根据业务类型去选择，组合。

 纯协议方案 = 模拟官方 APP   

 重打包方案 = 改造官方 APP   

 真机方案  = 直接使用官方 APP 




| 方案 | 实现方式 | 技术点 | 风控 | 优势 | 劣势 |
|--------|--------|--------|--------|--------|--------|
| 纯协议方案 | 逆向协议、算法分析、抓包重放，在服务器端模拟客户端请求获取流水 | 协议分析、签名算法、设备参数模拟、Token 保活、多点登录问题、IP 池维护 | Integrity 检测、Native 风控、SSL Pinning、Device Graph、行为画像、Play Integrity、Root 检测、Frida 检测、VPN 检测、Proxy 检测、风险图谱 | 自动化程度最高、无需用户安装特殊客户端、便于集中管理 | 技术门槛最高，协议升级后维护成本大，容易受到风控影响 |
| 重打包方案 | 修改官方 APP，注入获取流水逻辑，在 APP 内部直接获取数据 | 包名修改、签名修改、DEX 注入、短信 Hash Code 校验、APP 自身签名校验 | Google Play Services 检测、Google Play Protect 检测、APP 包名校验、APP 签名校验 | 获取数据稳定，天然通过大部分服务端风控，不需要模拟复杂协议 | 需要用户安装重打包 APP，升级维护成本较高，容易被完整性校验发现 |
| 真机方案 | 使用真实设备运行官方 APP，通过自动化或远程控制获取流水 | 真机管理、自动化控制、设备维护、多设备调度 | 账号行为模型、设备画像、批量设备关联分析 | 最接近真实用户环境，风控通过率最高 | 硬件成本高，运维成本高，规模化难度较大 |
