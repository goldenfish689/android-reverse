---
name: android-native
description: 分析 Android APK 中的 ELF 共享库与 JNI，定位 native 签名、加密和序列化逻辑，建立 Java 方法到运行时函数的映射。
---

# Android JNI 与共享库

## 先确认分析对象

记录 APK 和 `.so` 哈希、ABI、位数、依赖库与加载方式。选择 IDA、Ghidra 或 radare2 中已可用的一种；不要求固定 MCP 服务。多 ABI 包先选测试设备实际加载的库，不能混用另一架构的偏移。

## 分析路径

1. 从 `System.loadLibrary`、Java `native` 声明、字符串及导入导出确定入口。静态注册查 `Java_...`；动态注册追踪 JNI_OnLoad 及其他初始化路径中的 RegisterNatives。
2. 保存类名、方法名、JNI 签名、函数地址和所属模块。依据目标 ABI 与 JNI 头文件解释函数表和参数，不照抄固定 vtable 字节偏移。
3. 区分 JNIEnv、jobject/jclass、jstring、jbyteArray 和原生缓冲区；不要把 JNI 对象直接当 C 字符串读取。
4. 用交叉引用与数据流追踪输入规范化、加密调用、输出编码。先标注少量相关函数和结构，记录改名依据。
5. 通过 [动态分析](../mobile-reverse/SKILL.md) 验证候选函数；保存模块加载基址、地址换算依据和原始样本版本。

## 地址和仿真注意点

文件偏移、ELF 虚拟地址、反编译器地址与运行时地址不同。按 PT_LOAD 映射和 load bias 换算；只有基准一致时才使用“模块基址 + 相对偏移”。ARM32 还要处理 ARM/Thumb 状态。

需要局部仿真时可评估 unidbg/Unicorn，但先列出 JNI、文件、时间、随机数、线程和系统调用依赖。逐项用观测值补环境，不能把所有失败调用强制返回成功后宣称复现。

控制流平坦化、间接分支或 VM 承载核心逻辑时进入 [去混淆](../android-deobfuscation/SKILL.md)，携带函数地址、输入输出和已知分支约束。

## 输出

交付 Java/JNI 映射表、关键函数位置、参数/返回类型、数据流图或伪代码、动态比对结果。算法部分转 [加密](../android-crypto/SKILL.md) 或 [签名](../android-signature/SKILL.md) 继续验证。
