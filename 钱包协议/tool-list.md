# 截止到2026-05-09哦

# 小米 8 SE 和 Google Pixel 8 的 Play Check 绕过方案介绍

## Xiaomi 8 SE

关键方案：

- BiTGApps
- 隐藏 Root

---

## Google Pixel 8

关键方案：

- Trickystore
- 卸载模板
- 确保 Root 对谷歌套件不可预见

---

# Magisk 组件模块介绍

### Zygisk + Shamiko（底层文件级隐藏）

隐藏：

- Magisk 本身
- Zygisk 痕迹
- Root 挂载点
- 系统 Root 环境
- Magisk 环境

---

### LSPosed + HMA（应用层包名隐藏）

隐藏应用安装信息，对某些应用隐藏系统安装的特定应用。

例如：

- 对 Paytm 隐藏 MT 管理器
- 对 Paytm 隐藏 HMA

---

### Trickystore + Play Integrity Fix

用于通过 Google Pixel 8 的设备完整性检查。

---

# 组件说明

## 0. KernelSU

可以实现：

- 基于内核的 Root
- 加载安装模块
- 制作 init_boot 镜像

---

## 1. Magisk

Root 框架，可以制作 Root 的 boot.img。

---

## 2. Zygisk

注入 Zygote 的工具。

Magisk 模块依赖它来绕过或修改某些逻辑。

---

## 3. Trickystore

用于通过硬件密钥检查。

需要：

- 从旧设备提取的 `keybox.xml`
- `pif.json`

并且：

- 这些 Key 未被 Google 拉黑
- 最好与 Play Integrity Fix 伪造的设备指纹一致
- 使用同一机型的数据

---

## 4. Play Integrity Fix

用于伪造手机软件指纹相关属性。

---

## 5. LSPosed

Hook 框架。

提供：

- Hook 模块安装
- Hook 模块启用
- 模块管理界面

---

## 6. HMA（Hide My Applist）

基于 LSPosed Hook 框架运行。

### 列表 1

勾选的应用（例如）：

- Magisk
- MT 管理器

这些应用将对目标 App 隐藏。

### 列表 2

勾选的应用（例如）：

- GMS
- Momo

这些应用将戴上“面具”，无法扫描到列表 1 中的应用。

---

## 7. Shamiko

隐藏 Root 环境。

需要配合：

- Zygisk
- DenyList 配置

一起使用。

---

## 8. BiTGApps / NikGApps for Android

提供：

- Google 服务套件
- Magisk 模块化安装方式

---

## 9. Applist Detector

尤其适用于 Root 用户。

作用：

用于衡量隐藏效果的黄金标准。

通常用于验证：

- Hide My Applist（HMA）
- Shamiko

是否配置成功。

---

## 10. Momo

用于检测：

- Root 状态
- Magisk 环境

---

## 11. Riru

类似于 Zygisk。

属于过时方案。

---

## 12. Play Integrity API Checker

用于检查：

Google 设备完整性状态是否全绿（Integrity Pass）。

---

## 13. KeyAttestation

Google 用于验证：

手机 Bootloader 是否解锁。

---

## 14. MagiskFrida

系统级加载 Frida。

并且可以配合：

- Shamiko

进行隐藏。

---

## 15. Enable Screenshot

### LSPosed + DisableFlagSecure

作用：

让电脑投屏时能够看到 App 画面。

便于：

- 操作
- 抓包
- 调试

---

## 16. LSPosed + TrustMeAlready

作用：

强制让 App 信任用户安装的证书。

适用于：

- Shamiko 隔离证书后
- HTTPS 抓包场景

这一步通常比较关键。

---

## 17. Move Certificates

作用：

允许像平时一样安装抓包证书。

当手机重启时：

自动将这些证书伪装成系统预装证书。

---

## 18. KsuWebUI

KernelSU 的管理界面。
