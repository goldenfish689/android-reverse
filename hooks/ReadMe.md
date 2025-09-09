2025-9-9日更新:


***使用方法：***

1，替换脚本中的OLLVM加固的so。
2，配置好Frida，后运行：frida -U -f com.yourapp.name -l hook_jni_and_libc.js --no-pause

观察日志：

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


 分析日志，还原逻辑.....
