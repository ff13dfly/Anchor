# Anchor，基于Polkadot的域名储存系统

## 概述

- Anchor通过简短易记的字符来降低访问链上数据的复杂度，同时通过链表的方式来组织Anchor的数据，可将Anchor网络作为一个key-value链上数据库使用，从而构建有趣的链上应用，却不用关心复杂的链上操作。

- Anchor目前已经上线双节点的测试网络[wss://network.metanchor.net],可以通过波卡官方的工具进行连接。

## Anchor的目标

- 简单易用，通过Anchor的方式写入和读出数据，您可以将Anchor网络当作一个可信任的数据库进行使用，无需再学习和掌握复杂繁多的区块链知识。
- 兼容并续，和vGateway结合使用，可以让您的App快速具备访问区块链网络的能力。
- 成本低廉，无需掌握难度颇高的RUST，只需JS，您就可以开始链上应用的开发啦。

## Anchor的使用

下载对应操作系统的版本[ Mac Linux64 ],运行节点，使用Polkadot的连接工具，即可使用

```SHELL
# 本地运行Anchor网络，默认监听9944端口
./anchor --dev

# 清理anchor本地运行产生的数据，不清理的话会出现不能出块的情况
./anchor purge-chain --chain dev
```

## Anchor的实现

- Anchor通过简单的4个方法，形成了一个可交易的闭环，让你从现在就可以开始拥有一个未来可以接入元宇宙的“链名”。

- Anchor名支持UTF8，在注册时候，protocol里使用code进行标识。
  
### setAchor，设置和更新Anchor的方法。

- 共3个参数，key为链名，raw为数据（支持文件），protocol为JSON字符串
  
  ```RUST
  key:Vec<u8>,
  raw:Vec<u8>,
  protocol:Vec<u8>,
  ```

### sellAnchor，设置Anchor为销售状态的方法。

- 共2个参数，key为链名，cost为销售价格
  
  ```RUST
  key:Vec<u8>,
  cost:u32,
  ```

### buyAnchor，购买处于销售状态的方法。

- 共1个参数，key为链名

  ```RUST
  key:Vec<u8>,
  ```

- Anchor代码说明，github的地址[https://github.com/ff13dfly/Anchor]
  
### unsellAnchor，撤回处于销售状态的方法。

- 共1个参数，key为链名

  ```RUST
  key:Vec<u8>,
  ```
  