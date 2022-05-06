# Open Grant Proposal

> This document is referenced in the terms and conditions and therefore needs to contain all the required information. Don't remove any of the mandatory parts presented in bold letters or as headlines! See the [Open Grants Program Process](https://github.com/w3f/Open-Grants-Program/blob/master/README_2.md) on how to submit a proposal.

* **Project Name:** Anchor
* **Team Name:** Fuu
* **Payment Address:** 0xF8105ea1cC3130501bad5De60Bd3D794a9115dE2 (USDT)

## Project Overview :page_facing_up: 

### Overview

* 基于substrate的key-value链上存储系统，便于方便的开发链上应用（cApp）。在开发实际的应用时，目前智能合约遇到了一定的困难。以blog为例，可以方便的借助substrate的扩展交易来实现。
* 可以看成是一个域名系统，类似于以太坊的ENS，在便于开发链上应用的同时，让简单易记的key（链名）资产化，可以进行交易。交易链名的同时，也是在交易key的所有历史。
* 可扩展的用户自定义的链上数据存储。

* Anchor版本的说明

* Anchro如何使用
1. 创建和更新Anchor
2. 销售Anchor
3. 启动cApp    

******************************************************************************
Anchor是基于substrate的链上数据的域名系统，就像以太坊上的ENS。不同的是，Anchor更加关注如何解决访问链上数据的访问问题，区块链技术提供了我们安全的存储可信数据的能力，substrate解决了基础框架问题，接下来要考虑的，就是如何让这个能力破圈，不仅仅只解决财务问题。由于JS具有极佳的兼容性，可以保存为字符串，也就意味着，JS程序也可以从链上被加载，然后，启动的程序再从链上获取数据，那么，应用程序的开发，就在链上形成了自洽，Anchor就是着力在解决这一问题。

目前已经开发出了第一版，anchor部分的github在这里，对应的前端在这里，已经写出demo的部分。已经可以从链上启动程序，样例里有blog和twitter的程序示范，借助于substrate和polkadot的能力，这些程序的实现，只有百行的代码。

在开发了这些cApp之后，发现了Anchor需要改进的地方，历史更改记录需要被串联起来。


解决应用开发中的碰到的问题
* 复杂的链上操作
* 难以标定的线上资源
* dApp的软肋
* cApp的解决方式

* 链上启动的APP
* 简单易记的线上资产，完整的交易流程

在开发了部分应用，例如，初步的Blog系统之后，发现仍欠缺的部分
* 将Anchor转卖给指定的用户
* Anchor更新记录的关联

Anchor作为生态系统的一部分，能带来什么。
* 简单易记的链上资产
* 更方便的开发链上APP，substrate会变成一个key-value系统，对于不熟悉区块链的开发者，也可以方便的使用
* 使用Anchor作为访问链上数据的方法，可以在自定义数据结构的同时，不用关注substrate的开发，可以提高很高的效率。同时，因为数据都安全的存储在链上，也许应用程序会崩溃，但是数据不会，这对于开发者来说，具有很强的诱惑力。
* 从应用角度来看，dApp就可以让没有拥有Coin或者Token的用户参与进来。即使不参与交易，也可以收益。现在的情况是，如果你不买入基于区块链的产品，你是没有办法从这项技术中获益的。

Anchor使用的介绍视频
* 已经成功部署了3节点的网络，wss://network.metanchor.net
* 已经成功部署了访问的前端
* 即时响应系统的测试视频

******************************************************************************  

### Project Details

#### Architecture
![](https://storage.googleapis.com/hugobyte-2.appspot.com/Aurras%20Architecture.png)

#### Technologies

1. React 
2. Polkadot.js
3. Docker 
4. Substrate
5. Rust  

#### Components

* Anchor pallet的功能
1. setAnchor 
   设置和更新Anchor的方法，实现逻辑如下图：

   原来的参数
   现在的参数
   增加的参数 : pre

2. sellAnchor
    设置和更新Anchor为销售的状态，实现逻辑如下图：
    原来的参数
    现在的参数
    增加的参数 : pre  &   target

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
| 1a. | Substrate Event Feed: Configuration | Reading Configuration based on Environment, Override Configuration if Environment Variables provided, Configrations for Chain endpoint Sections and Methods from extrinsic to Exclude, types, Openwhisk Endpoint, Openwhisk Auth Key, Trigger Endpoint, Kafka Topic and Brokers |
| 1b. | Substrate Event Feed: Chain Module | Connects to the chain, Add custom type to chain intialization if provided, Subscribes to system.events |  
| 1c. | Substrate Event Feed: Event Module | Filters Events based on excludes provided, Post Events to trigger Endpoint |  
| 1d. | Substrate Event Feed: Docker Image | Dockerfile for Substrate Event Feed Package  |  
| 1e. | Substrate Event Feed: Docker Compose Configuration | Add Substrate Event Feed Service in Docker Compose Configuration |
| 1f. | Substrate Event Feed: Helm Chart Configuration | Helm Chart Configuration for Substrate Event Feed for Kubernetes  |
| 2. | Event Manager: Event Post Action | Minimal JS Implementation of Event POST Action with Payload as Kafka Topic, Broker and Event Data such as section, method and Event Payload |


### Milestone 2 — Anchor Manager System
* **Estimated Duration:** 35 Working Days
* **FTE:**  3
* **Costs:** 0.58 BTC

| Number | Deliverable | Specification |
| ------------- | ------------- | ------------- |
| 0a. | License | Apache 2.0  |
| 0b. | Documentation | Documentation includes Inline Code Documentation, Configuration Documentation, Kafka and Zookeeper Deployment guide, wskdeploy guide, Readme file |
| 0c. | Testing Guide | The code will have unit-test coverage (min. 50%) to ensure functionality and robustness. In the guide we will describe how to run these tests |  
| 1a. | Kafka Provider: Fork | Fork Existing [openwhisk-package-kafka](https://github.com/apache/openwhisk-package-kafka/) |
| 1b. | Kafka Provider: Helm Chart Configuration | Helm Chart Configuration for Kafka Provider for Kubernetes |
| 2. | Database Service | Implement DB Service, DB Integration, Connect DB provided through configuration variables, Dockerfile for Containerization, Docker Compose Configuration |
| 3a. | Event Manager: Event Source Registration | Integrate with DB service - CouchDB, Register Source with Chain Name, Chain Specification, Create Unique topic for provided Section-Method, Return created topics - Section-Method Map |
| 3b. | Event Manager: Kafka provider feed action | Integrate with DB service - CouchDB, Add CREATE, READ, UPDATE, DELETE lifecycle methods for trigger, Validate parameters (Section-Method, broker, isJSONData, isBinaryValue, isBinaryKey), Get unique topic from DB using Section-Method param,Record topic and related trigger to DB on CREATE lifecycle |
| 3c. | Event Manager: Deployment Config | Deployment Config for [wskdeploy](https://github.com/apache/openwhisk-wskdeploy) tool | 
| 3d. | Event Manager: Intermediate Container | Dockerfile for Containerization, Container with wsk cli and wskdeploy util, Script to add Openwhisk auth key, Deploy Openwhisk Actions and Create Triggers and Rules |
| 3e. | Event Manager: Docker Compose Configuration | Docker Compose Configuration for Event Manager: Intermediate Container |
| 3f. | Event Manager: Helm Chart Configuration | Helm Chart Configuration for Event Manager: Intermediate Container for Kubernetes |


## Future Plans

* 组建Anchor网络，支持cApp开发；
* 基于Anchor开发Blog和twitter程序；

## Additional Information :heavy_plus_sign: 
Any additional information that you think is relevant to this application that hasn't already been included.

Possible additional information to include:
* What work has been done so far?  
Anchor的第一版本已经可以部署
* Are there are any teams who have already contributed (financially) to the project?  
No
* Have you applied for other grants so far?  
No
