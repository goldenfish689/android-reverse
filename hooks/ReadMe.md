2025-9-9日更新:
（上面这个小小的脚本，本人用它突破了2个vmp+ollvm项目的防护，受益匪浅！！！）


基于Frida Hook的VMP+OLLVM逆向分析方案
项目简介
本文分享一种简化的VMP+OLLVM混淆还原方案，通过Frida动态Hook技术绕过复杂的静态分析，实现关键逻辑的快速还原。
开源地址： https://github.com/goldenfish689/android-reverse/tree/main/hooksAndroid
背景与挑战
在Android逆向工程中，VMP（Virtual Machine Protect）与OLLVM（Obfuscator-LLVM）的组合是目前最常见的代码混淆防护手段。传统的应对方式通常包括：

符号执行：使用工具进行抽象执行分析
模拟执行：借助Unicorn、Unidbg等框架
手动分析：结合静态分析工具进行人工逆向

这些方法虽然有效，但往往需要投入大量时间和精力，且对分析人员的技术水平要求较高。
解决方案
核心思路
本方案提出了一种回归简单的分析方法：完全绕过指令级分析，通过Frida Hook日志还原关键逻辑。
方法优势

✅ 无需关注指令混淆：不用分析复杂的汇编指令
✅ 忽略字符串混淆：直接观察运行时行为
✅ 绕过控制流变化：专注于函数调用关系
✅ 高效快速：大幅减少分析时间

实现原理
通过全面Hook以下关键接口，构建完整的函数调用链：

libc库函数：系统底层API调用
JNI函数：Java与Native交互接口
上层Java函数：应用层逻辑调用

结合对Android SDK/NDK接口的深入理解，可以从Hook日志中快速识别和还原关键业务逻辑。
技术实现
libc库函数Hook
对所有libc库函数进行全量Hook监控，捕获：

函数调用时机
参数传递内容
返回值信息
调用堆栈关系

分析流程

部署Hook脚本：使用提供的Frida脚本
运行目标程序：触发关键逻辑执行
收集日志数据：获取完整的函数调用记录
逻辑还原：基于调用模式分析业务逻辑
验证结果：确认还原逻辑的正确性

适用场景
此方案特别适用于：

需要快速了解程序核心逻辑的场景
传统静态分析遇到瓶颈的情况
对混淆程度较高的so文件分析
时间紧迫的逆向分析任务

项目特点

🔧 开箱即用：提供完整的Hook脚本
📚 文档详细：包含使用说明和案例
🎯 实战验证：在多个实际项目中验证有效
🚀 持续更新：根据新的混淆技术不断优化

总结
相比传统的符号执行和模拟执行方案，基于Frida Hook的方法提供了一条更加直接和高效的逆向分析路径。通过观察程序的动态行为而非静态结构，可以在大多数情况下快速突破VMP+OLLVM的混淆防护，获得程序的核心逻辑。
欢迎大家使用并提供反馈，共同完善这一逆向分析方案！



***hook_jni_and_libc.js使用方法：***

1，替换脚本中的OLLVM加固的so。  

2，配置好Frida，后运行：frida -U -f com.yourapp.name -l hook_jni_and_libc.js --no-pause

**观察日志：**


......

JNIHook]    jni function : [ReleaseStringUTFChars] called from:0x725d2b1e10

 [JNIHook]    jni function : [ReleaseStringUTFChars] called from:0x725d2b1e2c

 [JNIHook]    jni function : [ReleaseStringUTFChars] called from:0x725d2b1e48
 [LibcHook] strlen    called ,from: 0x725d2afd30
 strlen      called str:

 [JNIHook]    jni function : [FindClass] called from:0x725d2b1a14

 [JNIHook] FindClass:      Class Name: [android/os/Build]

 [JNIHook]    jni function : [GetStaticFieldID] called from:0x725d2b1ad4

 [JNIHook] GetStaticFieldID called
     Class: android.os.Build
     Field Name: MANUFACTURER
     Signature: Ljava/lang/String;

 [JNIHook]    jni function : [GetStaticFieldID] called from:0x725d2b1b40

 [JNIHook] GetStaticFieldID called
     Class: android.os.Build
     Field Name: BRAND
     Signature: Ljava/lang/String;

 [JNIHook]    jni function : [GetStaticFieldID] called from:0x725d2b1ba8

 [JNIHook] GetStaticFieldID called
     Class: android.os.Build
     Field Name: DISPLAY
     Signature: Ljava/lang/String;

 [JNIHook]    jni function : [GetStaticObjectField] called from:0x725d2b1bd8

 [JNIHook]    jni function : [GetStaticObjectField] called from:0x725d2b1bf8

 [JNIHook]    jni function : [GetStaticObjectField] called from:0x725d2b1c1c

 [JNIHook]    jni function : [GetStringUTFChars] called from:0x725d2b1c50

 [JNIHook]    jni function : [GetStringUTFChars] called from:0x725d2b1c84

 [JNIHook]    jni function : [GetStringUTFChars] called from:0x725d2b1cb8
 [LibcHook] strlen    called ,from: 0x725d2e000c
 strlen      called str: Xiaomi
 [LibcHook] strlen    called ,from: 0x725d2e000c
 strlen      called str: Xiaomi
 [LibcHook] strlen    called ,from: 0x725d2e000c
 strlen      called str: QKQ1.190828.002 test-keys
 [LibcHook] strstr    called ,from: 0x725d2b1d40
 strstr      called str1: xiaomi str2: other1
 [LibcHook] strstr    called ,from: 0x725d2b1d7c
 strstr      called str1: xiaomi str2: other1
 [LibcHook] strstr    called ,from: 0x725d2b1db8
 strstr      called str1: qkq1.190828.002 test-keys str2: other1

 [JNIHook]    jni function : [ReleaseStringUTFChars] called from:0x725d2b1e10

 [JNIHook]    jni function : [ReleaseStringUTFChars] called from:0x725d2b1e2c

 [JNIHook]    jni function : [ReleaseStringUTFChars] called from:0x725d2b1e48
 [LibcHook] strlen    called ,from: 0x725d2afd30
 strlen      called str: com.unity3d.player.UnityPlayerActivity

 [JNIHook]    jni function : [NewStringUTF] called from:0x725d2afd78

 [JNIHook]    jni function : [GetObjectClass] called from:0x725d2b3f38
 GetObjectClass called , class name:android.app.Application

 [JNIHook]    jni function : [GetMethodID] called from:0x725d2b3ff4

 [JNIHook] GetMethodID,         Method Name: [getPackageName]     Signature: ()Ljava/lang/String;     Class: [android.app.Application]

 [JNIHook]    jni function : [CallObjectMethodV] called from:0x725d3e5544
 Call XXX MethodV called - Class Name: android.app.Application, Method ID: 0x6fca3c38 (Method name not directly accessible)

......  


**逐条分析Java、JNI、Libc的调用日志，还原逻辑。**
 
