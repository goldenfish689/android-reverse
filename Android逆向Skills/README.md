# Android 逆向分析 Skills

skills围绕 APP 协议、请求签名、加密、JNI 和加固分析组织内容等展开。

这是给 AI 助手使用的分析指南和辅助脚本，不是自动破解工具。整个文件夹可以单独复制使用，不依赖旁边的原工程；分析工具需要自行准备。

## 最简单的用法

让支持读取本地文件的 AI 助手打开本目录，然后发送：

```text
请读取 skills/android-reverse/SKILL.md，按其中的流程分析我的 Android APK。
样本：D:/samples/demo.apk
目标：弄清楚 /api/demo 请求的 sign 参数如何生成。
当前只有 APK，先做离线分析，有需要再告诉我应补充什么材料。
输出目录：work/demo
```

无需先安装全部工具，也不必记住每个 skill。只有 APK 时可以先分析结构和代码；有测试设备、日志或流量时再补动态验证。助手不能访问你的磁盘时，需要在对应环境中提供样本和本工程。

若客户端有本地 skill 加载功能，将整个 `skills` 目录中的 **8 个技能文件夹一起**放入其技能目录；保留各文件夹的相邻关系。具体加载位置由客户端决定。已有原版 `apk-reverse`、`mobile-reverse`、`protocol-reverse` 时，选择其中一套，避免同名技能重复加载。也可以不安装，直接让助手读取指定 `SKILL.md`。

## 按目标选入口

| 你想做什么 | 读取哪个技能 | 预期结果 |
|---|---|---|
| 不知道从哪里开始、整包分析 | [android-reverse](skills/android-reverse/SKILL.md) | 分析路线与阶段结论 |
| 看 APK、Manifest、Java、smali，修改后重打包 | [apk-reverse](skills/apk-reverse/SKILL.md) | 入口和调用链、修改记录 |
| 用 Frida 观察方法、定位抓包失败或反调试 | [mobile-reverse](skills/mobile-reverse/SKILL.md) | 可复现的 Hook 与运行日志 |
| 看 APP 请求、二进制报文、Protobuf | [protocol-reverse](skills/protocol-reverse/SKILL.md) | 协议字段与离线解码方法 |
| 找 sign、验签输入、请求规范化规则 | [android-signature](skills/android-signature/SKILL.md) | 签名输入规则与验证样例 |
| 找 AES、RSA、HMAC、密钥派生 | [android-crypto](skills/android-crypto/SKILL.md) | 算法参数与本地复现 |
| 核心代码在 JNI 或 `.so` | [android-native](skills/android-native/SKILL.md) | Java/native 映射与函数分析 |
| Java 混淆、DEX 加固、OLLVM、VM | [android-deobfuscation](skills/android-deobfuscation/SKILL.md) | 分类证据与局部恢复结果 |

“请求签名”是接口参数的计算；“APK 签名”是安装包的证书签名。前者走 `android-signature`，后者走 `apk-reverse`。

## 可以直接复制的提问

**协议分析**

```text
读取 skills/protocol-reverse/SKILL.md。根据 demo.apk 和 capture.pcapng，
说明点击“查询”产生的请求字段、序列化格式和响应结构。先离线分析，不发起重放。
```

**算法复现**

```text
读取 skills/android-signature/SKILL.md。分析请求头 X-Sign 的输入、排序、编码和计算步骤。
我有 APK 和三组脱敏请求，请给出证据位置；只有经过样例比对的代码才标为已复现。
```

**去混淆与加固**

```text
读取 skills/android-deobfuscation/SKILL.md。JADX 只能看到壳入口，核心函数位于 libdemo.so。
请先判断是动态加载 DEX、控制流混淆还是 VM 保护，列出证据和下一步验证办法。
```

**动态观察**

```text
读取 skills/mobile-reverse/SKILL.md。在我的测试设备上观察 com.example.demo 的签名方法，
记录参数、返回值和调用栈。先保持函数原行为；设备序列号和方法签名见附件。
```

## 工具怎么准备

| 分析阶段 | 按需准备 | 缺少时仍能做什么 |
|---|---|---|
| APK 静态 | Java、jadx、apktool | 阅读已有反编译结果、Manifest、资源 |
| 动态分析 | adb、Frida 客户端及兼容的设备端运行环境 | 继续定位待观察的方法 |
| 流量分析 | Wireshark/tshark 或已有代理导出 | 分析保存的请求与报文字节 |
| native | IDA、Ghidra 或 radare2 任一种 | 建立 JNI 入口与字符串线索 |
| 重打包 | apktool、zipalign、apksigner、测试 keystore | 准备和审阅补丁 |
| 本工程验证 | Python 3、PowerShell 5+ | 阅读 Markdown 不需要运行时 |

在执行工具前查它的实际路径、版本和帮助。Windows 可用 `Get-Command jadx,apktool,adb,frida -ErrorAction SilentlyContinue`，Linux/macOS 可用 `command -v jadx apktool adb frida`。本包不自动安装工具或注册 MCP。

动态分析还取决于设备 ABI、系统版本、root/Gadget 或可调试应用等条件。没有合适设备时，应明确写“未动态验证”。

## 本地脚本

在本工程目录执行，路径有空格时加引号：

```powershell
# 输入必须是 apktool 解出的文本 XML，而不是 APK 内的二进制 XML
powershell -NoProfile -ExecutionPolicy Bypass -File skills/apk-reverse/scripts/manifest-summary.ps1 -ManifestPath "D:/cases/demo/apktool/AndroidManifest.xml"

# 结构、引用、许可证和独立性检查；不连接设备、不联网
python scripts/validate.py

# Manifest 脚本的合成样本回归
powershell -NoProfile -ExecutionPolicy Bypass -File tests/test-manifest.ps1
```

Manifest 脚本保留原 `-ManifestPath` 入参和 `key=value` 输出，包括 `package`、`permission_count`、各组件数量和 `main_activity`，额外识别 `activity-alias`。空的 exported 值表示未显式声明，不代表 false。

上述 ExecutionPolicy 参数仅作用于本次 PowerShell 进程，不修改系统策略。只在阅读并信任脚本后执行。

## 保存结果

推荐每个样本使用独立的 `work/<案例名>/`：原始材料、工具输出、Hook 日志、复现代码、报告分开存放。报告可从 [模板](skills/android-reverse/assets/report-template.md) 开始；算法样例格式见 [测试向量约定](skills/android-crypto/references/test-vectors.md)。

本项目默认忽略 `work/` 和设备抓取物，避免把样本、令牌及密钥提交到版本库。对外报告脱敏，内部复现材料保持字节一致。

## 范围、来源与限制

只包含 Android 应用逆向；Android 内嵌 WebView/React Native/Flutter 按其实际运行层处理。不包含 iOS、Windows 域、通用渗透扫描或 CTF 总控。

当前版本完成文档及本地辅助脚本检查；未对真实 APK、设备、脱壳工具或商业加固效果作端到端验证。去混淆、脱壳和密钥分析的结果依赖具体样本，不能保证全部恢复。

本次验证：8 个 skill 的入口字段、目录命名、本地链接和许可证检查通过，Manifest 合成样本回归通过。skill-creator 自带 quick_validate 因当前 Python 缺少 PyYAML 未能执行；本工程的无依赖检查器覆盖本包采用的简单 frontmatter 格式，不是通用 YAML 校验器。

筛选依据、原路径与接口变更见 [SOURCES.md](SOURCES.md)。改写不改变来源归属，保留原工程 [MIT 许可证](LICENSE)。
