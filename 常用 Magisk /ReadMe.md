# 常用 Magisk / KernelSU 组件模块完全指南

 Android 玩机环境（Root、隐藏、抓包及环境伪装）的主流模块与工具，它们是绕过风控进行协议分析的基础。

---

##  核心方案组合 (最佳实践推荐)

针对高强度检测的 App（如银行、游戏、支付类），建议采用以下组合策略：

1.  **底层文件级隐藏**：`Zygisk` + `Shamiko`
    * **作用**：隐藏 Magisk 痕迹、Root 挂载点及 Zygisk 注入痕迹。
2.  **应用层包名隐藏**：`LSPosed` + `HMA (Hide My Applist)`
    * **作用**：防止 App 扫描手机安装列表。例如：对 Paytm 隐藏 MT 管理器或 HMA 自身。
3.  **设备完整性欺骗**：`TrickyStore` + `Play Integrity Fix`
    * **作用**：绕过 Google Pixel 8 等现代设备的硬件密钥检查，实现设备状态“全绿”。

---

##  基础框架与注入工具

| 组件名称 | 类型 | 功能描述 |
| :--- | :--- | :--- |
| **Magisk** | Root 框架 | 最主流的方案，通过修改 `boot.img` 获取系统最高权限。 |
| **KernelSU** | 内核 Root | 基于内核的 Root 方案，隐蔽性极高，支持 `init_boot` 镜像制作。 |
| **Zygisk** | 注入工具 | 集成在 Magisk 中，用于将代码注入 Zygote 进程，是多数模块的运行基础。 |
| **LSPosed** | Hook 框架 | Riru/Zygisk 版 Xposed，提供模块管理界面，实现对 App 逻辑的实时修改。 |
| **Riru** | 注入工具 | 早期 Zygote 注入技术，现已基本被 Zygisk 取代。 |
| **KsuWebUI** | 管理插件 | 为 KernelSU 提供的 Web 界面控制台。 |

---
##  隐藏、伪装与环境修复

### 1. 隐藏环境
* **Shamiko**：目前最强的 Root 隐藏模块，配合 Zygisk 的“排除列表 (DenyList)”使用（注：开启 Shamiko 时需关闭 DenyList 的强制执行）。
* **HMA (隐藏应用列表)**：基于 LSPosed 的模块。
    * **逻辑 1**：勾选的应用（如 Magisk, MT管理器）将对目标 App 隐藏。
    * **逻辑 2**：对目标 App（如 GMS, Momo）戴上“面具”，使其无法扫描到黑名单应用。

### 2. 过谷歌认证 (Play Integrity)
* **TrickyStore**：过硬件密钥检查。需配合未封禁的 `keybox.xml`，且建议伪装指纹与 Key
