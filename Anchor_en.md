# Open Grant Proposal

> This document is referenced in the terms and conditions and therefore needs to contain all the required information. Don't remove any of the mandatory parts presented in bold letters or as headlines! See the [Open Grants Program Process](https://github.com/w3f/Open-Grants-Program/blob/master/README_2.md) on how to submit a proposal.

* **Project Name:** Anchor
* **Team Name:** Fuu
* **Payment Address:** 0xF8105ea1cC3130501bad5De60Bd3D794a9115dE2 (USDT)

## Project Overview :page_facing_up: 

### Overview

* Anchor是基于substrate的key-value链上存储系统，便于方便的开发链上应用（cApp）。使用这种方式，可以使用纯JS的开发，实现全链上的应用程序。相比较Pallet和智能合约的方式，技术门槛降低了很多，效率提升很多，可以让开发者更关注应用本身。
* Anchor is a key-value on-chain storage system based on substrate, which is convenient for developing on-chain applications (cApp). By this way, you can develop blockchain app totally on Javascript. Compared with Pallet and smart contracts, the technical threshold is much lower, and the efficiency is much improved, allowing developers to pay more attention to the application itself.

* Anchor也可以看成是一种域名服务，类似于以太坊的ENS，可以让简单易记的key（链名）资产化，在自由交易的情况下，逐步具备价值。这种价值还不仅仅是静态的数据，还可以是应用程序。这种可信任的链上数据，也可以接入到未来的元宇宙中。
* Anchor can also be regarded as a domain name service, similar to ENS (Name service of Ethereum) , which can capitalize the simple and easy-to-remember key (chain name), and gradually become valuable in the case of free transactions. This value is not just static data, but also applications. This trusted on-chain data can also be accessed into the future metaverse.
  
* Anchor的链上数据可以自定义，开发者就可以使用自定义的协议，来开发复杂的应用，而不需要进行Pallet或者智能合约的开发。也就是说，Anchor pallet只需要进行有限的升级，不断提升安全性，就可以支持复杂的cApp的开发。也就是说，cApp的开发不会产生更多的coin或者token，也区分出写入者和读取者，读取者并不需要支付费用，这就可以让更多的用户使用Polkadot。
* Anchor on-chain data can be customized, and developers can use customized protocol to develop complex applications without the need to develop Pallets or smart contracts. That is to say, the Anchor pallet only needs limited upgrades and continuous improvement of security to support the development of complex cApps. That is to say, the development of cApp does not generate more coins or tokens, and also distinguishes writers and readers, and readers do not need to pay fees, which allows more users to use Polkadot.  

* Anchor目前已经开发出了 "1.0.0-dev"（[github](https://github.com/ff13dfly/Anchor)），部署了在线测试网络(wss://network.metanchor.net)，可以实现基于Anchor的blog和twitter演示程序。
* Anchor has currently developed to version "1.0.0-dev" ([Anchor github](https://github.com/ff13dfly/Anchor)). Dev network is deployed, the websocket link is wss://network.metanchor.net. 

* Video
  
1. Creating and Updating Anchor https://www.youtube.com/watch?v=28nxOI-nDuA

2. Selling and Buying Anchor https://www.youtube.com/watch?v=i5eIPOM9ZAk

3. Loading cApp https://www.youtube.com/watch?v=3SP7NNzzcH8
### Project Details

#### Architecture
![Anchor_Pallet.png](http://android.im/anchor/Anchor_Pallet.png)

* 仅使用3个API就完整实现了key-value系统，简单的系统更容易写强壮，更好的支持创建的cApp。3个API的功能如下：
* Anchor key-value system is completely implemented using only 3 APIs, and the simple system is easier to write and stronger, and better supports the created cApp. The functions of the 3 APIs are as follows:
* 
| API |  Specification |
| ------------- | ------------- |
|  setAnchor | A function to set the data of the anchor and connect the history of the anchor |
|  sellAnchor| Set the anchor to the function of sales status, you can specify the sales account |  
|  buyAnchor | Purchase the specified anchor function |  

* 使用substrate内置的storage map维持基础的Anchor信息，实现Anchor的查询，销售列表的查询。
  
* Use the built-in storage map of substrate to maintain the basic Anchor information, and realize the query of Anchor and the query of sales list.
#### Technologies

1. React,Build a front-end program that operates the Anchor network.
2. Polkadot.js,JS library for interacting with Anchor nodes.
3. Docker 
4. Substrate
5. Rust  

#### Components

* Anchor pallet的功能，使用3个RPC方法实现了完整的key-value逻辑
* The functionality of the Anchor pallet, which implements complete key-value logic using 3 RPC methods
  
1. setAnchor
   The method of setting and updating Anchor, the implementation logic is as follows:
   ![set_anchor.png](http://android.im/anchor/set_anchor_2.png)
   Parameters of 1.0.0-dev   ( key: Vec<u8>,raw: Vec<u8>,protocol: Vec<u8> ) 
   Parameters of 2.0.0-dev   ( key: Vec<u8>,raw: Vec<u8>,protocol: Vec<u8> ,last : T::BlockNumber ) 

2. sellAnchor
    Set and update Anchor to the state of sale, the implementation logic is as follows:
    ![sell_anchor.png](http://android.im/anchor/sell_anchor_2.png)
    Parameters of 1.0.0-dev   ( key: Vec<u8>, cost: u32 )
    Parameters of 2.0.0-dev   ( key: Vec<u8>, cost: u32 , target : T::AccountId )

3. buyAnchor
    The purchase of Anchor is in the state of sale, and the implementation logic is as follows:
    ![buy_anchor.png](http://android.im/anchor/buy_anchor_2.png)
    Parameters of 1.0.0-dev  ( key: Vec<u8> )
    Parameters of 2.0.0-dev  ( key: Vec<u8> )

* 2个以anchor为key的StorageMap来维持所有Anchor的状态. 本次升级主要是通过增加数据的方式，来解决两个问题：
* Two StorageMaps to maintain the state of all Anchor. This upgrade mainly link the Anchor history by adding data:
  
1. AnchorOwner StorageMap, Add a third value to save the last updated block.
Data struct of 1.0.0-dev : Vec<u8> -> (T::AccountId,T::BlockNumber)
Data struct of 2.0.0-dev : Vec<u8> -> (T::AccountId,T::BlockNumber,T::BlockNumber)

1. SellList StorageMap，Add a third value to sell Anchor to the specified account.
Data struct of 1.0.0-dev : Vec<u8> -> (T::AccountId, u32)
Data struct of 2.0.0-dev : Vec<u8> -> (T::AccountId, u32, T::AccountId)

* Anchor上的blog程序，实现全链上启动，可以正常的进行blog的发布、浏览功能。
* The blog program on Anchor realizes the startup of cApp, and can normally perform blog publishing and browsing functions.
### Ecosystem Fit

* 这个项目的与众不同之处在于，引入了纯链上应用（cApp），简化的经济模型。
What sets this project apart is the introduction of a pure on-chain application (cApp), a simplified economic model.
1. Simple NS service that can quickly calibrate the content on the chain.
2. On-chain APP development decoupled from assets simplifies access to blockchain data.
3. Free customized cApp development

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

个人的开发经验主要集中在非区块链开发部分，一直想进入区块链开发，但难度很大，和传统开发差异很大。再不断学习，发现了Anchor这条路径，既能利用substrate实现web3，又通过传统的key-value方式，更方便的开发。
Personal development experience is mainly concentrated in the non-blockchain , but I have always wanted to join the blockchain development. Block chain development  is a bit difficult for traditional development. After continuing to study, I tested the way of Anchor, which treats substrate as a key-value system.  It is much convenient for traditional development.

* Anchor, Substrate-based key-value system.
  
* vExplorer, Anchor web explorer.

* cApp, cApp demos。

* Jeditor, simple and easy to use JSON editor. Quickly edit json data with just one reference.
 
### Team Code Repos
Source codes will reside in
* https://github.com/ff13dfly/Anchor

Repos for further reference
* https://github.com/ff13dfly/VirtualBlockWorld
* https://github.com/ff13dfly/vExplorer
* https://github.com/ff13dfly/cApp
* https://github.com/ff13dfly/jEditor  
### Team Profiles
* Zhongqiang Fu , individual developer.

## Development Roadmap :nut_and_bolt: 

### Overview
* **Description** Development of Anchor Pallet
* **Total Estimated Duration:** 30 Person Days
* **Full-time equivalent (FTE):**  Milestone 1;
* **Total Costs:** 5000 USDT


### Milestone 1 — Anchor Pallet Develop
* **Estimated Duration:** 30 Working Days
* **FTE:**  1
* **Costs:** 5000 USDT

| Number | Deliverable | Specification |
| ------------- | ------------- | ------------- |
| 0a. | License | Apache 2.0  |
| 0b. | Documentation | Documentation includes Inline Code Documentation, Configuration Documentation, Event Post Action Deployment guide, Docker and Docker compose setup documentation, Openwhisk Setup Documentation, Readme file |
| 0c. | Testing Guide | The code will have unit-test coverage (min. 50%) to ensure functionality and robustness. In the guide we will describe how to run these tests | 
| 1a. | Pallet Anchor: setAnchor | A function to set the data of the anchor and connect the history of the anchor |
| 1b. | Pallet Anchor: sellAnchor| Set the anchor to the function of sales status, you can specify the sales account |  
| 1c. | Pallet Anchor: buyAnchor | Purchase the specified anchor function |  


### Milestone 2 — Anchor Chain Application ( cApp ) Demo
* **Estimated Duration:** 30 Working Days
* **FTE:**  1
* **Costs:** 5000 USDT

| Number | Deliverable | Specification |
| ------------- | ------------- | ------------- |
| 0a. | License | Apache 2.0  |
| 0b. | Documentation | Documentation includes Inline Code Documentation, Configuration Documentation, Kafka and Zookeeper Deployment guide, wskdeploy guide, Readme file |
| 0c. | Testing Guide | The code will have unit-test coverage (min. 50%) to ensure functionality and robustness. In the guide we will describe how to run these tests |  
| 1a. | cApp : blog | The cApp of blog based on anchor can be browsed for free and written for a fee |

## Future Plans

* Set up Anchor network to support cApp development;
* In-depth development of blog and twitter programs based on Anchor for commercial use;
* Develop Metaverse product VBW based on Anchor;

## Additional Information :heavy_plus_sign: 
Any additional information that you think is relevant to this application that hasn't already been included.

Possible additional information to include:
* What work has been done so far?  
Anchor v1 deployed. 
Network entry : [wss://network.metanchor.net](wss://network.metanchor.net).
Demo link : [http://demo.metanchor.net](http://demo.metanchor.net/).

* Are there are any teams who have already contributed (financially) to the project?  
No
* Have you applied for other grants so far?  
No
