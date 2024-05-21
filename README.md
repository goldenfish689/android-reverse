# android-reverse
Android逆向攻略：逆向技术栈分析，逆向资源集合

Android逆向技术栈
===

1,	基础知识点
---




a)	操作系统：

i.	内存管理：内存地址空间，虚拟内存物理内存的映射关系；堆和栈；

ii.	进程管理：进程管理，进程优先级，进程通信，进程地址空间，进程权限；fork,exec,clone,进程控制块PCB，进程映像；/proc/pid/map；

iii.	设备驱动：设备驱动文件，binder驱动。

iv.	文件系统，文件管理，访问权限，用户用户组。

v.	网络，

vi.	系统调用，关键的系统调用：ptrace，fork,exec,clone，ioctrl，mmap

vii.	Linux操作系统

viii.	Android Framework。（参考源码）

b)	开发语言，

汇编ASM,ARM32/64架构：需要知道ARM32/64架构下的过程调用规范（APCS），它定义了:

对寄存器使用的限制。

使用栈的惯例。

在函数调用之间传递/返回參数。

能够被‘回溯’的基于栈的结构的格式，用来提供从失败点到程序入口的函数(和给予的參数)的列表。


C，C++：语法，优化写法，编译原理。需要知道基本数据类型和结构体，类，对象等复杂数据结构体在内存中的存储，方便计算数据存储地址。


Java，Smali，JNI，NDK; 语法，基本数据类型，复杂数据类型。

JavaScript、Python、lua。

跨平台语言Flutter,WebView/JS,H5，ReactNative. 


c)	编译原理：

编译过程，编译优化。

代码混淆和保护Java2C，OLLVM。

解释执行和编译执行。

脚本语言和解释型语言。

d)	静态分析：程序文件结构。

DEX，文件结构

ELF，文件结构

资源文件，资源文件结构，资源加载过程

e)	动态分析：程序加载，执行原理。

Linker机制，

ART机制，

f)	网络协议、抓包分析：Http/Https,Websocket,TCP/IP

g)	加密算法：AES，DES，RSA，MD5，SHA-1，Base64。


2,	实战技术点
---
a)	反调试，反ROOT，反HOOK, 反代理，反抓包，防Dump，双IDA。

b)	脱壳加壳，修复，代码还原。（Java2C ， VMP，OLLVM），内存扫描分析，内存Dump。

c)	协议分析，游戏数据包还原和封装。APP脱机运行。抓包封包，解密加密。修改器。

d)	虚拟机运行，多开/应用分身。ART，Flutter，WebView，H5，ReacNaitve。VA，Unity3D。

e)	爬虫（app或web），获取数据，处理数据。自动化，批量执行。

f)	棋牌渗透。

g)	过会员，VIP。获取会员APP资源。

h)	马甲包，二次打包。过签名/包名/代码完整型验证。

i)	汉化，二次打包。防马甲包代码关联：动态混淆，动态生成，插入垃圾代码（从代码，服务器，开发者账户等方面防关联）。

j)	运行环境监测，虚拟机监测，模拟器检测，HOOK检测，ROOT检测，无障碍检测，VPN代理监测。

k)	设备指纹，设备ID。软改硬改。改机抹机。微霸，抹机王。定制ROM。

l)	自动化，模拟执行。无障碍服务。自动化框架。模拟点击。群控技术。

m)	Sign算法。四神六神。设备ID。

n)	漏洞利用：保活，弹窗，webView漏洞。

o)	过反调试，反HOOK。

p)	过包名，签名，代码完整型检查。


3,	工具集合
---

a)	IDA，Jadx-gui，charles，Httpcannary，fiddle，binnaryNinjia。MT管理器。

b)	模拟器，zymagisk面具。Frida，xposed各Hook框架资源。各种虚拟机方案。

4,	网站论坛，公众号，博主主页。
---
    
看雪论坛：https://bbs.kanxue.com/

52破解论坛：https://www.52pojie.cn/

MT论坛：https://bbs.binmt.cc/




5,	业务需求
   ---
a)	代码、数据，算法还原，竞品分析。算法代码提取，文件/数据解密。

b)	插件开发。增删改相关功能。抢单。红包修改，抢红包。

c)	APP协议。模拟用户操作，批量操作，自动化，群控。突破使用限制。

d)	游戏协议，封包，解包。

e)	马甲包，代码插入，混淆，SDK替换，隐藏，AB面，防关联，过应用市场检测。

f)	棋牌透视。

g)	虚拟机开发：用于模拟执行，多开，游戏脚本运行，提供虚拟系统API接口访问。模拟各种数据访问接口，硬件访问接口。

h)	爬虫系列：各种爬取数据，存储分析数据，呈现数据。（光是这一个领域的需求就足以成就一番事业，问题关键在于形成可用落地方案。）


6,	招聘需求
---


7,	业务样本，实战案列。
---

a)	Telegram客户端修改，定制版。（所以不要随便下载来路不明的定制版，里面可能有暗藏机关，陷阱，不要贪图便宜）。

b)	神州租车，协议。

c)	货拉拉抢单，协议。

d)	陌陌，协议。

e)	贝壳，协议，风控。

f)	小红书客户端。评论，私信，协议号。

g)	抖音卡片小尾巴。抖音点赞，评论。起号，养号。人气协议。

h)	海外Line，whatapp协议破解。

i)	微信插件，红包透视，突破加人限制。

j)	马甲包，上架slotgame；替换广告sdk；保活竞品分析，弹窗。

k)	地下城与勇士，汉化。

l)	蜂鸟配送，修改清单条件。

m)	协和医院，过人脸。

n)	农用无人机开发板，修改代码。

o)	游戏模拟器修改。

p)	铺鱼达人，锁好。金币突破限制。

q)	自动刷抖音App，破解卡密。

r)	某聊天社交app改红包。

s)	电信app协议破解，flutter。

t)	航空app协议破解。

u)	虎牙直播，协议破解，设备指纹。

v)	海外运营，养号，主板机，群控。Mswook.

w)	某算法提取，native 算法，解密代码。

x)	海外马甲包，保活和弹窗。Ollvm。

y)	抖音引流软件破解。


8，安全加固厂商
---
网易易盾：https://dun.163.com/product/android-reinforce

爱加密：https://www.ijiami.cn/

360加固：https://jiagu.360.cn/#/global/index

梆梆加固：https://dev.bangcle.com/

腾讯加固：https://cloud.tencent.com/product/ms

腾讯WeTest：https://wetest.qq.com/products/application-reinforcement

娜迦加固：https://www.nagain.com/#/home/index

百度加固：https://apkprotect.baidu.com/android.html

Virbox：https://aiot.virbox.com/androidprotection.html

顶像加固：https://www.dingxiang-inc.com/business/fingerprint

阿里云加固：https://www.aliyun.com/product/mobilepaas/mpaas_ppm_public_cn

几维安全：https://www.kiwisec.com/





