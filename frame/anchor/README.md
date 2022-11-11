<!-- markdown-link-check-disable -->

# Anchor Pallet

Anchor基于substrate的交易模型，使用extrinsics的方式来将信息写到链上，再通过vCache进行缓存，提供访问接口，这样，就可以简化基于substrate的开发，dApp只需要关心数据结构怎么设计，如何实现功能，将复杂的区块链看成是一个数据库即可。也不用去学习门槛很高的Rust，以及去理解substrate的整个体系。

Anchor自身的结构也很简单，只提供写入功能，可以持续使用，降低更新频率，提高稳定性。


## Anchor Content

Anchor的值由以下4部分构成：
* key，键值名，用于访问anchor的唯一字符串，功能类似于域名，程序限定长度不能超过40字节，字符串包含小写字母和数字
* raw，以base64方式存储的数据
* protocol，anchor的运行协议，提供对dApp自启动的支持
* way，键值存储方式，1为公用，0为私有

## Anchor protocol

Anchor通过protocol字段来对数据的调用进行约定，实现通过键值名就可以启动dApp的目标。

```JSON
{
    "auto":false,
    "type":"js",
}
```

## Anchor集成

- bin/node/runtime/Cargo.toml
- bin/node/runtime/src/lib.rs
  
- bin/node/cli/src/chain_spec.rs
- bin/node/testing/src/genesis.rs
- Cargo.toml

## Test case
### setAnchor

- Bob创建一个全新的anchor，名称为test，查看AnchorOwner里的数据是不是正确
- Bob继续写入test的数据（1.pre正确；2.pre错误），查看AnchorOwner里的数据是不是正确
- Alice强制写入 test，检查数据是否被写到链上，查看nchorOwner里的数据是不是正确

### sellAnchor && buyAnchor

- Bob销售test（1.设置target account；2.不设置target account），查看sellList里是否正确；
- Bob购买test，查看sellList里是否正确；
- Alice购买test（1.设置target account；2.不设置target account），查看sellList里是否正确；
- Alice购买成功后，查看AnchorOwner里的数据是不是正确；
- Alice再次售卖test，重复以上操作
- 新账号，余额不足的情况下购买test，查看sellList里是否正确；
### unsellAnchor

- Bob销售test，使用Alice撤回交易，查看sellList里是否正确；
- Bob销售test，使用Bob撤回交易，查看sellList里是否正确；


### 2022-11-05 上午的测试

结论：buyAnchor逻辑还是有问题，未能更新anchor的owner，需要调整代码

- Bob写入test，数据在 blcok 17 上，anchorOwner正常
- Alice写入test，数据在 blcok 65 上，anchorOwner仍然指向 block 17
- Bob写入test，指向  blcok 65，数据在 blcok 109 上，anchorOwner仍然指向 block 17
- Bob写入test，指向  blcok 17，数据在 blcok 141 上，anchorOwner仍然指向 block 141
- Bob写入test，指向  blcok 17，数据在 blcok 164 上，anchorOwner仍然指向 block 164

- Alice销售test，数据在 blcok 194 上，sellList为空
- Bob销售test，数据在 blcok 229 上（事件触发，记录了block最后的数据），sellList数据正常
- Alice撤销销售test，数据在 blcok 278 上，sellList数据正常，未被撤销
- Bob撤销销售test，数据在 blcok 301 上，sellList为空，已经撤销
- Alice销售test给Eve，价格100,000，数据在 blcok 334 上，sellList数据正常
- Alice购买test，数据在 blcok 361 上，sellList数据正常，未能正常购买，未扣费
- Eve购买test，数据在 blcok 384 上，sellList数据正常，已撤销销售状态，Eve扣费正常，anchorOwner未能进行更改
- Eve销售hello（anchor不存在），数据在 blcok 425 上，sellList数据正常，无销售数据
- Eve销售test，数据在 blcok 463 上，sellList数据异常，无销售数据

### 2022-11-05 晚上的测试

结论：上午的anchor的owner更新正常
待处理：sell的target可以自行设置的问题
