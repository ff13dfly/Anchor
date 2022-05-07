# Open Grant Proposal

> This document is referenced in the terms and conditions and therefore needs to contain all the required information. Don't remove any of the mandatory parts presented in bold letters or as headlines! See the [Open Grants Program Process](https://github.com/w3f/Open-Grants-Program/blob/master/README_2.md) on how to submit a proposal.

* **Project Name:** Anchor
* **Team Name:** Fuu
* **Payment Address:** 0xF8105ea1cC3130501bad5De60Bd3D794a9115dE2 (USDT)

## Project Overview :page_facing_up: 

### Overview

* 基于substrate的key-value链上存储系统，便于方便的开发链上应用（cApp）。使用这种方式，可以使用纯JS的开发，实现全链上的应用程序。相比较Pallet和智能合约的方式，技术门槛降低了很多，效率提升很多，可以让开发者更关注应用本身。
* Anchor也可以看成是一种域名服务，类似于以太坊的ENS，可以让简单易记的key（链名）资产化，在自由交易的情况下，逐步具备价值。这种价值还不仅仅是静态的数据，还可以是应用程序。这种可信任的链上数据，也可以接入到未来的元宇宙中。
* Anchor的链上数据可以自定义，开发者就可以使用自定义的协议，来开发复杂的应用，而不需要进行Pallet或者智能合约的开发。也就是说，Anchor pallet只需要进行有限的升级，不断提升安全性，就可以支持复杂的cApp的开发。也就是说，cApp的开发不会产生更多的coin或者token，也区分出写入者和读取者，读取者并不需要支付费用，这就可以让更多的用户使用Polkadot。
* Anchor版本的说明，目前已经开发出了 "1.0.0-dev"（补充github链接），部署了在线测试网络（补充polkadot链接），可以实现基于Anchor的blog和twitter演示程序。

* 演示视频
1. 创建和更新Anchor
2. 销售和购买Anchor
3. 启动cApp的演示
### Project Details

#### Architecture
![](https://storage.googleapis.com/hugobyte-2.appspot.com/Aurras%20Architecture.png)

* 仅使用3个API就完整实现了key-value系统，简单的系统更容易写强壮，更好的支持创建的cApp。3个API的功能如下：

| API |  Specification |
| ------------- | ------------- |
|  setAnchor | 设置anchor的数据，并将anchor的历史连接起来的功能 |
|  sellAnchor| 设置anchor为销售状态的功能，可以指定销售账号 |  
|  buyAnchor | 购买指定的anchor功能 |  

* 使用substrate内置的storage map维持基础的Anchor信息，实现Anchor的查询，销售列表的查询。
#### Technologies

1. React,构建操作Anchor网络的前端程序.
2. Polkadot.js,和Anchor节点进行交互的JS库.
3. Docker 
4. Substrate
5. Rust  

#### Components

* Anchor pallet的功能，使用3个RPC方法实现了完整的key-value逻辑
1. setAnchor
   设置和更新Anchor的方法，实现逻辑如下图：
   原来的参数   ( key: Vec<u8>,raw: Vec<u8>,protocol: Vec<u8>) , 输出
   现在的参数   ( key: Vec<u8>,raw: Vec<u8>,protocol: Vec<u8> ,last : T::BlockNumber) , 输出

2. sellAnchor
    设置和更新Anchor为销售的状态，实现逻辑如下图：
    原来的参数  ( key: Vec<u8>, cost: u32 )
    现在的参数  ( key: Vec<u8>, cost: u32 ,last : T::BlockNumber ,target : T::AccountId )
    增加的参数 : target

3. buyAnchor
    购买Anchor为销售的状态，实现逻辑如下图：

    原来的参数  ( key: Vec<u8> )
    现在的参数  ( key: Vec<u8> )

* 2个以anchor为key的StorageMap来维持所有Anchor的状态. 本次升级主要是通过增加数据的方式，来解决两个问题：

1. AnchorOwner StorageMap, 使用现有的数据结构
v1的数据结构： Vec<u8> -> (T::AccountId,T::BlockNumber)
v2的数据结构： Vec<u8> -> (T::AccountId,T::BlockNumber)

1. SellList StorageMap，增加第3个数据，用于将anchor销售给指定账号
v1的数据结构： Vec<u8> -> (T::AccountId, u32)
v2的数据结构： Vec<u8> -> (T::AccountId, u32, T::AccountId)

* Anchor上的cApp情况介绍
  
1. blog程序，实现全链上启动，可以正常的进行blog的发布、浏览功能
   
2. twitter程序，实现全链上启动，可以正常进行twitter的发布、浏览功能

### Ecosystem Fit

* 这个项目的与众不同之处在于，引入了纯链上应用（cApp），简化的经济模型。
1. 脱离资产关联的链上APP开发简化了区块链数据的访问，
2. 自由的二次开发
3. 
* 简单的NS服务，可以快速标定链上内容
## Team :busts_in_silhouette:

### Team members

* Zhongqiang Fu 


### Contact

* **Contact Name:** Zhongqiang Fu
* **Contact Email:** ff13dfly@163.com
* **Website:** https://github.com/ff13dfly/anchor

### Legal Structure

* Individual.
  

### Team's experience

个人的开发经验主要集中在非区块链开发部分，正因为想开发基于波卡的应用，就产生了simPolk这个项目。

* 虚块世界 ( https://github.com/ff13dfly/VirtualBlockWorld )，基于波卡的虚拟世界。将会采用全链上结构，形成3D价值虚拟世界。

* Jeditor ( https://github.com/ff13dfly/Jeditor )，简单易用的json编辑器。只需一个引用，就可以快速的编辑json数据，该编辑器也用于simPolk的UI开发中。

* Anchor ( https://github.com/ff13dfly/anchor )，基于substrate的key-value系统。

 
### Team Code Repos
Source codes will reside in
* https://github.com/ff13dfly/anchor

Repos for further reference
* https://github.com/ff13dfly/VirtualBlockWorld
* https://github.com/ff13dfly/Jeditor
* https://github.com/ff13dfly/simPolk
  
### Team Profiles
* Zhongqiang Fu , individual developer.

## Development Roadmap :nut_and_bolt: 

### Overview
* **Description** Development of Anchor Pallet
* **Total Estimated Duration:** 20 Person Days
* **Full-time equivalent (FTE):**  Milestone 1 - 1.5; Milestone 2 and 3 - 3
* **Total Costs:** 1.16 BTC


### Milestone 1 — Anchor Pallet Develop
* **Estimated Duration:** 30 Working Days
* **FTE:**  1.5
* **Costs:** 0.25 BTC

| Number | Deliverable | Specification |
| ------------- | ------------- | ------------- |
| 0a. | License | Apache 2.0  |
| 0b. | Documentation | Documentation includes Inline Code Documentation, Configuration Documentation, Event Post Action Deployment guide, Docker and Docker compose setup documentation, Openwhisk Setup Documentation, Readme file |
| 0c. | Testing Guide | The code will have unit-test coverage (min. 50%) to ensure functionality and robustness. In the guide we will describe how to run these tests | 
| 1a. | Pallet Anchor: setAnchor | 设置anchor的数据，并将anchor的历史连接起来的功能 |
| 1b. | Pallet Anchor: sellAnchor| 设置anchor为销售状态的功能，可以指定销售账号 |  
| 1c. | Pallet Anchor: buyAnchor | 购买指定的anchor功能 |  


### Milestone 2 — Anchor Chain Application ( cApp ) Demo
* **Estimated Duration:** 35 Working Days
* **FTE:**  3
* **Costs:** 0.58 BTC

| Number | Deliverable | Specification |
| ------------- | ------------- | ------------- |
| 0a. | License | Apache 2.0  |
| 0b. | Documentation | Documentation includes Inline Code Documentation, Configuration Documentation, Kafka and Zookeeper Deployment guide, wskdeploy guide, Readme file |
| 0c. | Testing Guide | The code will have unit-test coverage (min. 50%) to ensure functionality and robustness. In the guide we will describe how to run these tests |  
| 1a. | cApp : blog | 基于anchor实现的blog的cApp，可以免费的浏览，付费的写入 |
| 1b. | cApp : twitter | 基于anchor实现的twitter，借助polkadot的subscribe的功能实现 |

## Future Plans

* 组建Anchor网络，支持cApp开发；
* 深入开发基于Anchor开发Blog和twitter程序，进行商用；
* 基于Anchor开发元宇宙产品VBW；

## Additional Information :heavy_plus_sign: 
Any additional information that you think is relevant to this application that hasn't already been included.

Possible additional information to include:
* What work has been done so far?  
Anchor v1 已经可以正常部署，测试网络的链接如下：

* Are there are any teams who have already contributed (financially) to the project?  
No
* Have you applied for other grants so far?  
No
