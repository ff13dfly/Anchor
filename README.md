# Anchor，波卡的域名系统

* Polkadot通过开发互通的区块链架构，独立了每条价值链，也带来了极大的复杂性，如何定位到这么多网络中的资源，成为一个需要解决的问题。Anchor通过用简短易记的英文和数字来降低这个难度，试图解决这个问题。
  
* Substrate提供了快速的区块链开发框架，Anchor就是基于Substrate，使用其扩展交易的功能，实现了链上的域名系统，用方便人们记忆的简短字符串来标定链上资源。我们也用“链名”来称呼一个Anchor，这类似于“域名”之于互联网，“链名”也提供了一种让普通人快速进入区块链世界的方法，也是未来连接到元宇宙的一个锚点。

* Anchor目前已经上线双节点的测试网络[http://sub.android.im],可以通过波卡官方的工具进行连接，详见[如何连接到Anchor测试网络]。您也可以通过访问[http://demo.metanchor.net]访问指定的“链名内容”。

# Anchor的实现

* Anchor通过简单的3个方法，形成了一个可交易的闭环，让你从现在就可以开始拥有一个未来可以接入元宇宙的“链名”。
## setAchor，设置和更新Anchor的方法。

* 共3个参数，key为链名，raw为数据（支持文件），protocol为JSON字符串
  ```
  key:Vec<u8>,
  raw:Vec<u8>,
  protocol:Vec<u8>,
  ```
## sellAnchor，设置Anchor为销售状态的方法。

* 共2个参数，key为链名，cost为销售价格
  ```
  key:Vec<u8>,
  cost:u32,
  ```
## buyAnchor，购买处于销售状态的方法。

* 共1个参数，key为链名
  ```
  key:Vec<u8>,
  ```
* Anchor代码说明，github的地址[https://github.com/ff13dfly/Anchor]

# Anchor的协议
* data类型
* NFT图像
* creation类型
# Anchor如何跨链

# Anchor和元宇宙
