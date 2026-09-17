---
name: mobile-reverse
description: 对 Android 应用进行 Frida 动态观察，验证 Java/native 调用、分析证书校验和反调试阻碍；本分支仅覆盖 Android。
---

# Android 动态观察

## 准备

确认测试包名、设备序列号、进程、ABI、Android 版本及 Frida 客户端/设备端兼容性。先用 `adb devices -l` 和 `frida-ls-devices` 确认目标。多设备时显式选择设备；没有 root 时评估可调试构建或 Gadget，重签名的行为差异必须记录。

## 从小范围 Hook 开始

1. 根据静态线索确定类、重载签名或 native 入口，先观察输入输出，不默认修改返回值。
2. 使用 [Hook 编写说明](references/hooking.md) 选择正确 ClassLoader、重载和加载时机；原函数只调用一次，保留返回值和异常行为。
3. 记录进程、线程、时间、调用序号和栈，用同一次用户操作关联网络请求。二进制数据记录长度和 hex/base64，不能只用 UTF-8 解码。
4. 重复实验对比基线；确认 Hook 本身没有引入递归、崩溃、时序变化或高频日志干扰。

典型命令（将占位值换成真实目标）：

```text
frida -D DEVICE_ID -f com.example.demo -l hook.js
frida -D DEVICE_ID -n PROCESS_NAME -l hook.js
```

spawn 用于观察早期初始化；attach 用于已运行进程。CLI 参数按本机 `frida --help` 检查，不继承原脚本对旧 `--no-pause` 参数的假设。

## 遇到阻碍

- 抓包失败：先看路由、代理、证书信任、TLS 错误和 pinning；也可能是 QUIC、native 网络库或未使用代理。用户 CA 被安装不代表应用一定信任它。必要时直接观察序列化或加密边界，交给 [协议分析](../protocol-reverse/SKILL.md)。
- 进程退出：比较未插桩时行为、logcat/崩溃栈和发生时间，定位反调试或完整性检查；只针对已确认检查做测试变更，记录变更。
- 类不存在：核对包名、混淆名、进程、ClassLoader、延迟加载和 split；不要用全局 Hook 掩盖定位错误。
- `.so` 不在模块列表：先观察加载时机，再按 [native 技能](../android-native/SKILL.md) 查映射。

局部检测分支变化不能证明服务端完整性验证也被绕过。

## 输出

交付可运行的目标专用 Hook、运行命令、触发步骤、脱敏日志和原行为对照。标出模板中尚需填写的类名/签名；类枚举或 DEX 路径枚举不等于成功导出 DEX。
