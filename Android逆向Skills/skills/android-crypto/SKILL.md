---
name: android-crypto
description: 分析 Android APP 的摘要、HMAC、对称/非对称加密和密钥派生，关联 Java 或 native 的运行时参数并验证算法复现。
---

# 加密与密钥派生分析

## 建立数据链

从网络字段、文件或业务函数回溯真实调用。Java 常见观察点为 `Cipher`、`Mac`、`MessageDigest`、`Signature` 和 `SecretKeyFactory`；native 实现走 [android-native](../android-native/SKILL.md)。Base64、hex、压缩先作为独立编码层识别。

记录每个对象的初始化、所有 update、最终 doFinal/digest/sign 和 reset/reinit；按对象、线程及调用关联，避免只采到最后一段数据或把并发请求混合。按实际使用的重载处理 offset/length、ByteBuffer 和输出缓冲区。

## 参数检查表

| 类别 | 需要确认 |
|---|---|
| AES 等对称算法 | 模式、padding、key 长度与来源、IV/nonce、输入输出格式 |
| GCM 等 AEAD | AAD、tag 长度与位置、nonce、验证失败行为 |
| HMAC/摘要 | 原始输入字节、分块顺序、key、摘要算法、截断 |
| RSA 等非对称操作 | 加密或签名、padding、OAEP/PSS 参数、密钥格式 |
| KDF | 输入秘密、salt、迭代次数、PRF、输出长度、后续拆分 |

从调用链确认密钥来源，不把某个字符串常量自动当作密钥。Keystore/硬件保护密钥可能不能导出：可记录 alias、用途和实际运算输入输出，不能承诺提取原始密钥。所需材料不足时说明已确定参数与剩余缺口。

## 验证

使用 [测试向量](references/test-vectors.md) 对照至少一个独立于本地实现的期望结果。固定参数后做逐字节比对；有随机性的算法验证解密/验签结果与语义。除正常输入，还按目标支持范围检查空输入、非 ASCII、多块数据和篡改认证标签失败。

“本地加密再解密成功”只能说明本地实现自洽，不能证明与 APP 相同。记录 provider、版本、编码和每步字节长度，保留采样与实现的对应关系。

## 输出

交付算法链、参数及来源、精确输入输出、可运行复现与测试结果。报告中脱敏密钥和身份数据；需要保密的原始向量留在未提交的案例目录。请求字段组合规则交还 [android-signature](../android-signature/SKILL.md)。
