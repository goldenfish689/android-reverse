支持清单（协议版+插件版）：

------
Phonepe
Phonepe Business
Paytm
Paytm Business
Mobikwik
FreeCharge
Airtel
Amazon
BHIM IndusPay
Myjio
Gpay

------第二梯队

Slice
TataNeu
Flipart
Bangkok Bank Mobile Banking
Kotak Bank
------


| 方案 | 实现方式 | 技术点 | 风控 | 优势 | 劣势 |
|--------|--------|--------|--------|--------|--------|
| 纯协议方案 | 逆向协议、算法分析、抓包重放，在服务器端模拟客户端请求获取流水 | 协议分析、签名算法、设备参数模拟、Token 保活、多点登录问题、IP 池维护 | Integrity 检测、Native 风控、SSL Pinning、Device Graph、行为画像、Play Integrity、Root 检测、Frida 检测、VPN 检测、Proxy 检测、风险图谱 | 自动化程度最高、无需用户安装特殊客户端、便于集中管理 | 技术门槛最高，协议升级后维护成本大，容易受到风控影响 |
| 重打包方案 | 修改官方 APP，注入获取流水逻辑，在 APP 内部直接获取数据 | 包名修改、签名修改、DEX 注入、短信 Hash Code 校验、APP 自身签名校验 | Google Play Services 检测、Google Play Protect 检测、APP 包名校验、APP 签名校验 | 获取数据稳定，天然通过大部分服务端风控，不需要模拟复杂协议 | 需要用户安装重打包 APP，升级维护成本较高，容易被完整性校验发现 |
| 真机方案 | 使用真实设备运行官方 APP，通过自动化或远程控制获取流水 | 真机管理、自动化控制、设备维护、多设备调度 | 账号行为模型、设备画像、批量设备关联分析 | 最接近真实用户环境，风控通过率最高 | 硬件成本高，运维成本高，规模化难度较大 |
