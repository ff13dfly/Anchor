# Anchor.js test

## Overview

Node.js is needed to test. Test will output the result on console screen. When write to the node, test will wait the "Finalized" status done, that may take a bit long time to test. There will be an overview at the end of all tests.

## Test

### Requirement

* @polkadot/api

```SHELL
    # install the neccessay polkadot API library
    yarn add @polkadot/api
```

### Storage Part

```SHELL
    # test the storage part of anchorJS
    # [search,latest,target,history,multi,owner]
    # local node may take more than 60s to finish.
    node anchor_storage.js
```

### Market Part

```SHELL
    # test the storage part of anchorJS
    # [market,sell,unsell,buy]
    # local node may take more than 120s to finish.
    node anchor_market.js
```

### Chain Part

```SHELL
    # test the chain part of anchorJS, subscribe mainly.
    # [subcribe,balance,ready,load,set,setKeyring]
    node anchor_chain.js
```

## Data structure

Anchor is a simple way to access blockchain world via [Substrate](https://github.com/paritytech/substrate), there are four main data structures which you need paying attention to.

### Anchor Location

Coding with anchor, you need to locate the data on chain. There are two ways, almost the same, the most important part is anchor name. By the way, as the data is public on-chain, anybody can access the anchor data without limitation.

```Javascript
    //just anchor name. Anchor.js treated as the latest data of anchor
    "anchor_name";

    //anchor name and block number. Anchor.js will search the target block to get the data.
    ["anchor_name","block_number"];
```

### Anchor Data Object

This object includes all details of a specific anchor. Anchor data object is combined both the storage details and the market details.

```Javascript
{
    "name":"",          //unique anchor name
    "protocol":{},      //anchor protocol, JSON normally
    "raw":"",           //raw data
    "block":0,          //block number where data stored
    "pre":0,            //block number where previous data stored
    "stamp":0,          //time stamp when the on-chain data written
    "empty":false,      //empty or not
    "signer":"",        //the signer ss58 address
    "owner":"",         //the owner ss58 address
    "sell":false,       //anchor selling status
    "cost":0,           //the cost to buy this selling anchor
    "target":"",        //the target buyer, if the same as owner, free to buy
}
```

### Anchor Marker Oject

Simple market information about anchor. Normally, it is used to list the on-sell anchors.

```Javascript
{
    name:"",            //unique anchor name
    owner:"",           //the owner ss58 address
    price:100,          //price of selling anchor
    target:"",          //the target buyer
    free:true,          //wether free to buy
}
```

### Status Object

The status of writting to chain, the step should be one of ["Ready","InBlock","Finalized"].
Need update if Polkadot/Substrate change the data structure.

```Javascript
{   
  step: '',     // step of writting
  message: ''   // details about the process
}
```

### Balance Object

This is the human-read object from Polkadot API.
Need update if Polkadot/Substrate change the data structure.

```Javascript
    {
        free: 0, 
        reserved: 0, 
        miscFrozen: 0, 
        feeFrozen: 0
    }
```

### Error

If there is any error, anchorJS will through error message on callback.

```Javascript
{error:"error message"}
```