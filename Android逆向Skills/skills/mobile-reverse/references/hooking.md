# Hook 编写与故障定位

先在反编译或运行时枚举结果中确认类、方法和参数类型。下例仅演示“一个 String 入参、String 返回”的方法，替换类名和方法名后才能用于对应样本；默认只打印长度。

```javascript
Java.perform(function () {
    const Target = Java.use('com.example.demo.Signer');
    const method = Target.sign.overload('java.lang.String');
    method.implementation = function (input) {
        const output = method.call(this, input);
        console.log(JSON.stringify({
            inputLength: input === null ? null : input.length,
            outputLength: output === null ? null : output.length
        }));
        return output;
    };
});
```

需要精确样例时按目标参数类型增加字节采样，并保存到本地案例目录。上例没有覆盖其他重载、调用抛异常、字节数组或 JNI 函数。

排查顺序：目标进程 → Java 是否可用 → 类名 → ClassLoader → 重载 → 触发时机。自定义加载器可通过枚举确认，再使用对应的 `Java.ClassFactory.get(loader)`；native 模块也要在实际加载后再取地址。

native 使用当前环境支持的模块 API，例如先 `Process.getModuleByName('libdemo.so')` 再查导出。函数地址必须来自当前样本，参数读取长度必须来自已确认的签名；二进制指针不要直接 `readUtf8String()`。

Java bridge 的加载方式取决于宿主：Frida CLI 与自建 agent 的打包方式可能不同。执行前查本机版本和 [Frida JavaScript API](https://frida.re/docs/javascript-api/)，不要照搬旧版 `Module.findExportByName` 等静态调用。

抓包时分别确认代理路由、系统/用户 CA 信任以及应用 pinning。[Android 网络安全配置](https://developer.android.com/privacy-and-security/security-config) 说明了应用侧信任配置；不要将“允许明文 HTTP”误当成“信任所有 HTTPS 证书”。
