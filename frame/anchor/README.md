<!-- markdown-link-check-disable -->

# Anchor Pallet

Anchor基于substrate的交易模型，使用extrinsics的方式来将信息写到链上，再通过vCache进行缓存，提供访问接口，这样，就可以简化基于substrate的开发，dApp只需要关心数据结构怎么设计，如何实现功能，将复杂的区块链看成是一个数据库即可。也不用去学习门槛很高的Rust，以及去理解substrate的整个体系。

Anchor自身的结构也很简单，只提供写入功能，可以持续使用，降低更新频率，提高稳定性。


# Anchor Content

Anchor的值由以下4部分构成：
* key，键值名，用于访问anchor的唯一字符串，功能类似于域名，程序限定长度不能超过40字节，字符串包含小写字母和数字
* raw，以base64方式存储的数据
* protocol，anchor的运行协议，提供对dApp自启动的支持
* way，键值存储方式，1为公用，0为私有

# Anchor protocol

Anchor通过protocol字段来对数据的调用进行约定，实现通过键值名就可以启动dApp的目标。

```
{
    "auto":false,
    "type":"js",
}
```