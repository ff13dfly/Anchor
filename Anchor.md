# Open Grant Proposal

> This document is referenced in the terms and conditions and therefore needs to contain all the required information. Don't remove any of the mandatory parts presented in bold letters or as headlines! See the [Open Grants Program Process](https://github.com/w3f/Open-Grants-Program/blob/master/README_2.md) on how to submit a proposal.

* **Project Name:** Anchor
* **Team Name:** Fuu
* **Payment Address:** 0xF8105ea1cC3130501bad5De60Bd3D794a9115dE2 (USDT)

## Project Overview :page_facing_up: 

### Overview

* 基于substrate的key-value链上存储系统，便于方便的开发链上应用（cApp）。在开发实际的应用时，目前智能合约遇到了一定的困难。以blog为例，可以方便的借助substrate的扩展交易来实现。
* 可以看成是一个域名系统，类似于以太坊的ENS，在便于开发链上应用的同时，让简单易记的key（链名）资产化，可以进行交易。交易链名的同时，也是在交易key的所有历史。
* 可扩展的用户自定义的链上数据存储。通过自定义的协议，可以对链上数据进行筛选，方便建立复杂的链上程序。基于Javascript启动的cApp可以完全运行在链上，无论是程序还是数据。

* 从应用角度来看，dApp就可以让没有拥有Coin或者Token的用户参与进来。即使不参与交易，也可以收益。现在的情况是，如果你不买入基于区块链的产品，你是没有办法从这项技术中获益的。
* 
* Anchor版本的说明，目前已经开发出了 "1.0.0-dev"（补充github链接），部署了在线测试网络（补充polkadot链接），可以实现基于Anchor的blog和twitter演示程序。

* 演示视频
1. 创建和更新Anchor
2. 销售和购买Anchor
3. 启动cApp的演示
4. 3节点的Anchor网络
### Project Details

#### Architecture
![](https://storage.googleapis.com/hugobyte-2.appspot.com/Aurras%20Architecture.png)

* 使用了3个API就完整实现了key-value系统

#### Technologies

1. React,构建操作Anchor网络的前端程序.
2. Polkadot.js
3. Docker 
4. Substrate
5. Rust  

#### Components

* Anchor pallet的功能
1. setAnchor 
   设置和更新Anchor的方法，实现逻辑如下图：
   原来的参数   (key: Vec<u8>,raw: Vec<u8>,protocol: Vec<u8>) , 输出
   现在的参数   (key: Vec<u8>,raw: Vec<u8>,protocol: Vec<u8>) , 输出

2. sellAnchor
    设置和更新Anchor为销售的状态，实现逻辑如下图：
    原来的参数  (key: Vec<u8>, cost: u32 )
    现在的参数  (key: Vec<u8>, cost: u32 ,target : Account )
    增加的参数 : target

3. buyAnchor
    购买Anchor为销售的状态，实现逻辑如下图：
    原来的参数
    现在的参数
    增加的参数 : pre

* Anchor启动方式
1. 传递给cApp的内容

### Ecosystem Fit

* 这个项目的与众不同之处在于，引入了纯链上应用（cApp），简化的经济模型。
1. 脱离资产关联的链上APP开发简化了区块链数据的访问，
2. 自由的二次开发
3. 让数据变成了资产

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

* simPolk ( https://github.com/ff13dfly/simPolk )，波卡区块链模拟器。基于php，可以单机模拟区块链行为的辅助开发工具。

 
### Team Code Repos
Source codes will reside in
* https://github.com/ff13dfly/anchor

Repos for further reference
* https://github.com/ff13dfly/VirtualBlockWorld
* https://github.com/ff13dfly/Jeditor
* https://github.com/ff13dfly/simPolk
  
### Team Profiles
* Dr. C. Pethuru Raj Ph.D - https://sweetypeterdarren.wixsite.com/pethuru-raj-books  
* Muhammed Irfan K - https://www.linkedin.com/in/muhammed-irfan-k  
* Hanumantappa Budihal - https://www.linkedin.com/in/hanumantappa-budihal/  

* Zhongqiang Fu 

## Development Roadmap :nut_and_bolt: 


### Overview
* **Description** Development of Anchor
* **Total Estimated Duration:** 210 Person Days
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
| 1a. | Pallet Anchor: setAnchor | Reading Configuration based on Environment, Override Configuration if Environment Variables provided, Configrations for Chain endpoint Sections and Methods from extrinsic to Exclude, types, Openwhisk Endpoint, Openwhisk Auth Key, Trigger Endpoint, Kafka Topic and Brokers |
| 1b. | Pallet Anchor: sellAnchor: Chain Module | Connects to the chain, Add custom type to chain intialization if provided, Subscribes to system.events |  
| 1c. | Pallet Anchor: buyAnchor: Event Module | Filters Events based on excludes provided, Post Events to trigger Endpoint |  


### Milestone 2 — Anchor Chain Application ( cApp ) Demo
* **Estimated Duration:** 35 Working Days
* **FTE:**  3
* **Costs:** 0.58 BTC

| Number | Deliverable | Specification |
| ------------- | ------------- | ------------- |
| 0a. | License | Apache 2.0  |
| 0b. | Documentation | Documentation includes Inline Code Documentation, Configuration Documentation, Kafka and Zookeeper Deployment guide, wskdeploy guide, Readme file |
| 0c. | Testing Guide | The code will have unit-test coverage (min. 50%) to ensure functionality and robustness. In the guide we will describe how to run these tests |  
| 1a. | cApp : blog | Fork Existing [openwhisk-package-kafka](https://github.com/apache/openwhisk-package-kafka/) |
| 1b. | cApp : twitter | Helm Chart Configuration for Kafka Provider for Kubernetes |

## Future Plans

* 组建Anchor网络，支持cApp开发；
* 基于Anchor开发Blog和twitter程序；
* 基于Anchor开发元宇宙产品VBW；

## Additional Information :heavy_plus_sign: 
Any additional information that you think is relevant to this application that hasn't already been included.

Possible additional information to include:
* What work has been done so far?  
Anchor的第一版本已经可以部署
* Are there are any teams who have already contributed (financially) to the project?  
No
* Have you applied for other grants so far?  
No
