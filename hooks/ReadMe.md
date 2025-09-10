2025-9-9日更新:
（本人已用此脚本突破了10多个vmp+ollvm项目的防护，受益匪浅！！！）


# 基于Frida Hook的VMP+OLLVM逆向分析方案

## 脚本简介

这是一种简化的VMP+OLLVM混淆还原方案，通过Frida动态Hook技术绕过复杂的静态分析，实现关键逻辑的快速还原。

## 背景与挑战

在Android逆向工程中，VMP（Virtual Machine Protect）与OLLVM（Obfuscator-LLVM）的组合是目前最常见的代码混淆防护手段。传统的应对方式通常包括：

- **符号执行**：使用工具进行抽象执行分析
- **模拟执行**：借助Unicorn、Unidbg等框架
- **手动分析**：结合静态分析工具进行人工逆向

这些方法虽然有效，但往往需要投入大量时间和精力，且对分析人员的技术水平要求较高。

## 脚本方案

### 核心思路

这是一种**回归简单**的分析方法：**完全绕过指令级分析，通过Frida Hook日志还原关键逻辑**。

### 方法优势

- ✅ **无需关注指令混淆**：不用分析复杂的汇编指令
- ✅ **忽略字符串混淆**：直接观察运行时行为
- ✅ **绕过控制流变化**：专注于函数调用关系
- ✅ **高效快速**：大幅减少分析时间

### 实现原理

通过全面Hook以下关键接口，构建完整的函数调用链：

1. **libc库函数**：系统底层API调用
2. **JNI函数**：Java与Native交互接口
3. **上层Java函数**：应用层逻辑调用

结合对Android SDK/NDK接口的深入理解，可以从Hook日志中快速识别和还原关键业务逻辑。




***脚本使用方法：***

1，替换脚本中的VMP+OLLVM加固的so。  

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
 
