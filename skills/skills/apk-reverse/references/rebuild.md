# APK 重建与签名

以下命令在本工程目录执行，输入是 apktool 项目副本。先创建独立输出目录并确认文件名不会覆盖已有产物：

```text
apktool b work/demo/apktool -o work/demo/rebuilt-unsigned.apk
zipalign -h
apksigner help sign
```

按目标设备和本机 Build-Tools 的要求执行 zipalign，输出另一个 aligned APK，再使用已有测试 keystore：

```text
apksigner sign --ks test.jks --ks-key-alias test --out work/demo/rebuilt-signed.apk work/demo/rebuilt-aligned.apk
apksigner verify --verbose --print-certs work/demo/rebuilt-signed.apk
```

让签名工具交互读取密码，不把正式密钥或密码写进脚本。对齐在签名前完成；签名后再改 APK 会破坏签名。包含 native 库时需额外核对目标设备的页面大小、库压缩方式和对齐要求。依据 [Android apksigner 文档](https://developer.android.com/tools/apksigner) 核对流程。

用户需要安装测试包时指定测试设备：

```text
adb -s DEVICE_SERIAL install -r work/demo/rebuilt-signed.apk
```

重签后的包通常不能直接覆盖由不同证书签名的已有安装。先报告安装错误和数据保留需求，再决定后续方式；不要把自动卸载作为兜底。split 包也不能假定用单个 APK 即可安装。
