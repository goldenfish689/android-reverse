2026-5-9

小米8se和google pixle8的playcheck 的绕过方案介绍。

xiaomi8se: 关键BitGapps + 隐藏root  ;

pixel8: trickystore+ 卸载模板，确保root对谷歌套件不可预见。

Magisk组件模块介绍：

Zygisk + Shamiko (底层文件级隐藏)：隐藏 Magisk 本身、Zygisk 痕迹、Root 挂载点。隐藏系统root，magisk环境等。
LSPosed + HMA (应用层包名隐藏)： 隐藏应用安装，对某些应用隐藏系统安装的某些应用。比如：对paytm隐藏系统安装的mt管理器或HMA。
Trickystore + Playintegrity Fix ： 过谷歌pixel8设备完整性检查。

0，kernelSU: 可以做基于内核的root, 加载安装模块，制作init_boot镜像。

1，Magisk：root框架，可以制作root的boot.img.

2，zygisk: 注入zygote的工具。Magisk模块依赖这个去绕过/修改某些逻辑。

3，trickystore： 过硬件密钥检查。（需要一些从旧设备提取的keybox.xml/pif.json，且没有被google拉到黑名单），最好和play integrity fix模块伪造的设备指纹一致，是同样的机型。

4，playintegrity fix： 伪造软件手机指纹相关属性。

5，lsposed: hook框架，提供了hook模块的安装启用界面操作。

6,  HMA(隐藏应用列表) ： 基于5的hook框架来用。列表1：勾选的应用(magisk ,mt管理器)将对目标 App 隐藏；列表2：勾选的应用(如gms,momo)将会戴上这个面具，扫描不到列表1的应用。

7，Shamiko: 隐藏root环境，配合zygisk的配置列表来用。

8，BiTGApps/NikGApps for Android： 提供magisk模块化安装谷歌套件.

9,   Applist Detector: 它是（尤其是 Root 用户）用来衡量“隐藏效果”的黄金标准，通常用来验证你的 Hide My Applist (HMA) 或 Shamiko 模块是否配置成功

10，Momo： 设备root，magisk环境检测。

11，Riru：类似zygisk. 过时玩法。

12,，play integrity API checker： google检查手机设备完整性，是否integrity全绿。

13，Keyattestatio:  Google 验证手机是否解锁状态。

14,  MagiskFirda. 系统级加载frida,并可以配合shamiko隐藏。

15，Enable Screenshot：LSPosed + DisableFlagSecure：负责让你在电脑投屏上能看到 App 画面，方便操作抓包

16，LSPosed + TrustMeAlready：负责强行让 App 信任证书（如果 Shamiko 把证书隔离了，这步是关键）。

17，Move Certificates：让你像往常一样在设置里安装抓包证书，然后在你重启手机时，它会自动把这些证书“伪装”成系统预装的证书。

18，KsuWebUI： kernelSU的界面
