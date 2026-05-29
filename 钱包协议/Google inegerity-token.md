2026-5-6

对抗google的intergrity检查，印度UPI应用很多采用google play的integrity完整性校验。

1，检查原理，基于gms相关服务，跨进程，是否和服务器通讯，传输内容，加密方法，如何改写gms获取到的手机设备环境？

通过binder和gms通讯，发一个nounce, 返回对应的token。 传到app服务器，再去谷歌服务器校验。【BitGApps模块提供了各个版本的谷歌套件，可以通过magisk来安装】

2， 手机设备检测: 

安装源，是否解锁，是否root，调试是否，usb调试开关，代理vpn是否启用，IP地址，地区语言，SIM卡，设备指纹，设备id（Android id 和DRM ID），是否安装某些root工具或magisk模块；
ROM/系统版本，安装软件列表等。

3，

静态检测：检测软件环境，硬件环境，网络环境（IP地址，代理，TLS指纹等）
动态检测：检测运行时环境，扫描内存，进程地址空间，动态代码扫描


拿paytm这个app来说，最重要的两个检测：

A，硬件TEE层面的检测：通过trickystore来欺骗。使用旧设备的指纹，告诉谷歌服务器这个是一个不支持TEE的旧设备，从而绕过检测。
B，软件层面可以通过playintegrity  Fix 4.4 来提供模拟指纹，绕过。

未完，待补充...
