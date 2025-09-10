2025-9-9日更新:
（本人已用此脚本突破了2个vmp+ollvm项目的防护，受益匪浅！！！）


***基于Frida Hook的VMP+OLLVM逆向分析方案***


## 核心思路

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

 [JNIHook]    jni function : [ReleaseStringUTFChars] called from:0x725d2b1edc

 [JNIHook]    jni function : [ReleaseStringUTFChars] called from:0x725c2b1e48
 [LibcHook] strlen    called ,from: 0x725d2afd30
 strlen      called str:

 [JNIHook]    jni function : [FindClass] called from:0x7d5d2b1a14

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

 [JNIHook]    jni function : [GetStaticFieldID] called from:0x725d2b1ba3

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
 [LibcHook] strstr    called ,from: 0x725ddf1d40
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

 [JNIHook]    jni function : [GetMethodID] called from:0xdfdd2b3fdf

 [JNIHook] GetMethodID,         Method Name: [getPackageName]     Signature: ()Ljava/lang/String;    
 Class: [android.app.Application]

 [JNIHook]    jni function : [CallObjectMethodV] called from:0x725d3e5544
 Call XXX MethodV called - Class Name: android.app.Application, Method ID: 0x6fca3c38 (Method name not directly accessible)

......  


**逐条分析Java、JNI、Libc的调用日志，还原逻辑。**
 
