---
name: apk-reverse
description: 分析 Android APK 的 Manifest、Java、DEX、资源和 smali，定位业务调用链，按任务需要修改并重建测试安装包。
---

# APK 结构与代码分析

## 输入与第一步

接收 APK 或已有解包目录、目标功能和输出目录。保留原包及哈希，输出到新的案例目录。若是 split APK，记录 base 与各 split；不要把不完整的 base 包视为全部代码。AAB 先明确所分析的模块或设备对应 APK 集。

通常先执行：

```text
jadx -d work/demo/jadx demo.apk
apktool d demo.apk -o work/demo/apktool
```

先确认输出目录未被其他案例使用。JADX 返回错误时查看已导出的类和错误日志，用 smali 交叉核对，不能直接断言没有业务逻辑。

## 分析顺序

1. 阅读 Manifest 的包名、Application、入口 Activity、activity-alias、权限和组件；检查资源中的 URL、配置和 networkSecurityConfig。用 [Manifest 摘要脚本](scripts/manifest-summary.ps1) 整理文本 XML。
2. 从用户指定的页面、接口路径或字段回溯调用关系；搜索 `sign`、`Cipher`、`Mac`、`MessageDigest`、`okhttp`、`native`、`loadLibrary`，只将它们视为线索。
3. 对关键方法核对参数类型、分支、调用者与返回值。反编译结果含糊时查看对应 smali 和异常路径。
4. 根据证据进入 [请求签名](../android-signature/SKILL.md)、[协议](../protocol-reverse/SKILL.md) 或 [native](../android-native/SKILL.md)。入口只有 stub 或动态加载器时转 [加固分析](../android-deobfuscation/SKILL.md)。

Flutter 的 Dart AOT、React Native 的 JS/Hermes、WebView 的脚本都可能承载业务逻辑；识别资产与加载链后选择对应运行层，不能仅搜索 Java 后判定逻辑缺失。

## 修改与重建（需要时）

先说明修改哪个方法/资源以及预期效果，再在副本上操作。常规链路为 apktool 重建 → zipalign 对齐 → apksigner 使用测试密钥签名 → 验签。具体参数按安装的 Build-Tools 帮助和目标设备要求确定，命令见 [重建说明](references/rebuild.md)。

保持 APK 证书签名与业务请求签名分离。新签名可能改变完整性检查或服务端行为；安装失败时先看错误，不能为覆盖原安装而默认卸载并删除用户数据。

## 输出

交付组件概要、关键类/方法与调用链、各层代码位置和证据。发生修改时附原值、新值、构建/验签日志与运行验证；没有设备时注明尚未安装验证。
