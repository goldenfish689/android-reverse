# 来源、筛选与改写记录

## 阅读与筛选依据

本地原工程：`reverse-skill`；概述：上层 `readme.txt`。整理时原工程 HEAD 为 `7e2097fd90d25c2f976f6eba26d6c00aa88051df`。此处路径是来源记录，不是运行时依赖。

概述及原 README 显示原工程覆盖逆向、渗透、安全研究、取证和 CTF。原路由/专项技能使用共享 tool-index、bootstrap、ops 和 field-journal；直接复制 Android 入口会引用许多未包含的文件。本分支采用“筛选内容后改写、仅移植独立辅助脚本”的方式消除这些依赖。

## 对应关系

下表原路径相对于原工程根目录。

| 本分支 | 主要原文件 | 处理方式 |
|---|---|---|
| android-reverse | `skills/routing.md`、工程 README 与概述 | 保留分阶段分流和证据交付，改为 Android 专用入口 |
| apk-reverse | `skills/apk-reverse/SKILL.md`、`references/android-advanced.md` | 重写入口，保留解包/Java/smali/重建工作流 |
| mobile-reverse | `skills/mobile-reverse/SKILL.md`、`references/frida-objection-deep.md`、`skills/apk-reverse/references/frida-cookbook.md` | 仅提取 Android 动态分析，重写示例和排错步骤 |
| protocol-reverse | `skills/protocol-reverse/SKILL.md`、`references/protocol-workflow.md` | 保留帧/字段/状态机方法，聚焦 APP，补充流重组和边界验证 |
| android-signature | `skills/js-reverse/SKILL.md`、APK 与 mobile 中的签名线索 | 将观察/采样/本地复现方法改写为 Android 签名专用流程；不复制浏览器 MCP 绑定 |
| android-crypto | mobile、APK 动态参考中的加密采样内容 | 独立成算法技能，补充对象关联、AEAD/KDF 与向量验收 |
| android-native | `skills/ida-reverse/SKILL.md`、`skills/apk-reverse/references/android-advanced.md` | 提炼 JNI 和 .so 方法，去掉固定机器/服务依赖 |
| android-deobfuscation | `skills/reverse-engineering/references/ollvm-deobfuscation.md`、APK 高级参考 | 保留分类、CFG 和动态验证思路，改写为分层分析；删去插件排名和通用成功承诺 |
| manifest-summary.ps1 | `skills/apk-reverse/scripts/manifest-summary.ps1` | 复制后调整错误文案与 XML 读取，增加 alias，保留原参数和原输出字段 |

各 SKILL 的自然语言正文重新组织表述，技术标识符、协议名、命令和既有接口不为改字而改动。报告模板、测试向量约定、独立验证脚本和回归样例为本分支补充。

## 接口与有意差异

- `apk-reverse`、`mobile-reverse`、`protocol-reverse` 保留 skill name；mobile/protocol 的适用范围收窄为 Android。
- 新增技能使用 `android-` 前缀。全部入口采用 `SKILL.md` 的 name/description frontmatter 和相对文件引用。
- Manifest 保留 `-ManifestPath` 与原 `key=value` 输出；新增 `activity_alias_count`、`activity_alias`，launcher alias 也输出为 `main_activity`。
- 原 `decode`、`frida-run`、`rebuild-sign-install` 包装脚本没有移植，因其涉及共享工具解析、自举和环境约定；提供原生命令流程，并明确工具前提。不能将本包视为原工程所有脚本的兼容替代品。
- 不包含原工程的通用路由程序、自动安装器、MCP 配置、平台适配器及历史案例；不继承“某机器已验证可用”的状态。
- 未复制 GPL 的 CTF 子工程；MIT 原始版权与授权文本保留在 LICENSE 中。

## 技术核对

2026-09-17 对照官方资料核对 Frida API 使用方式、APK 签名前后处理顺序、Android 网络信任配置：

- [Frida JavaScript API](https://frida.re/docs/javascript-api/)
- [Android apksigner](https://developer.android.com/tools/apksigner)
- [Android Network Security Configuration](https://developer.android.com/privacy-and-security/security-config)

核对文档不代表完成设备实测。原资料中的固定 JNI 偏移、旧 Frida API、把 DEX 列表当 dump 等示例未直接沿用；恢复效果以具体样本证据为准。
