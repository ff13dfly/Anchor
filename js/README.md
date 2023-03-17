# Anchor.js, lib to access Anchor node

## Overview

Anchor.js is a library to access **anchor node** which supply the On-chain Linked List function. Playing on the [Playgroud](https://playground.metanchor.net) is the recommand way to know **anchor** well. All methods in anchor.js are reflected in the playground.

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
  step: 'Ready',                            // step of writting
  message: 'Ready to interact with node.'   // details about the process
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

## Test

Node.js is needed to test. Test will output the result on console screen. When write to the node, test will wait the "Finalized" status done, that may take a bit long time to test.

### Requirement

* @polkadot/api

```SHELL
    # Switch to the test folder. 
    # Please check the position if you can not run test
    cd js/test

    # install the neccessay polkadot API library
    yarn add @polkadot/api
```

### Storage Part

```SHELL
    # Switch to the test folder. 
    # Please check the position if you can not run test
    cd js/test

    # test the storage part of anchorJS
    # [search,latest,target,history,multi,owner]
    # local node may take more than 60s to finish.
    node anchor_storage.js
```

### Market Part

```SHELL
    # Switch to the test folder. 
    # Please check the position if you can not run test
    cd js/test

    # test the storage part of anchorJS
    # [market,sell,unsell,buy]
    node anchor_market.js
```

### Chain Part

```SHELL
    # Switch to the test folder. 
    # Please check the position if you can not run test
    cd js/test

    # test the chain part of anchorJS, subscribe mainly.
    # [subcribe,balance,ready,load,set,setKeyring]
    node anchor_chain.js
```

## Methods

There are three parts in anchor.js as follow.

1. Polkadot setting, base on @polkadot/api , such as websocket object and keyring object.
2. Storage, write and view functions.
3. Market, sell and buy functions.

### @polkadot/api part

#### set

Set the @polkadot/api websocket object, all access depends on it.

```javascript
    // @param ws object  //polkadot websocket linker
    // return true || false
    anchorJS.set(ws);
```

#### setKeyring

Set the @polkadot/api keyring object, it is used to verify the account.

```javascript
    // @param ks object  //polkadot Keyring class
    // return true || false
    anchorJS.setKeyring(ks);
```

#### ready

Check wether the websocket linker is ready, then anchor.js can work properly.

```javascript
    // no param
    // return true || false
    anchorJS.ready();
```

#### load

Load pair from encrypted file which can verify account.

```javascript
    // @param encryJSON object      //polkadot encry data
    // @param password string       //password for encry data
    // return callback( pair || error )
    anchorJS.load(encryJSON,password,function(pair){

    });
```

#### balance

Get the balance of account, used to check insufficient balance normally.

```javascript
    // @param address string        //ss58 address of account
    // return callback( number || error )
    anchorJS.balance(address,function(amount){

    });
```

#### subcribe

Subscribe data on substrate node, when there is anchor data changed, will callback the data.

```javascript
    // return callback( [ anchor object ] )
    anchorJS.subcribe(function(object_list){

    });
```

### Storage part

#### write

Only way to write anchor data. Method will search the latest block number as the previous block number, then request to set_anchor method of anchor node.

```javascript
    // @param   pair      object         //account verify pair
    // @param   anchor    string         //unique anchor name, 40 bytes max
    // @param   raw       string         //data wil write to chain, 4MB max
    // @param   protocol  string         //customize protocol, 256 bytes max
    // return callback( status )
    anchorJS.write(pair, anchor, raw, protocol, function(status){

    });
```

#### search

Search an anchor name and return the latest data.

```javascript
    // @param   anchor      string      //anchor name
    // return callback( anchor object )
    anchorJS.search(anchor,function(object){

    });
```

#### owner

Check the ownership of anchor, return the owner ss58 address and latest block number.

```javascript
    // @param   anchor      string      //anchor name
    // return callback( owner, block_number )
    anchorJS.owner(anchor,function(owner,block){

    });
```

#### history

Get the whole linked list of anchor.

```javascript
    // @param   anchor      string      //anchor name
    // @param   limit       number      //ending block number
    // return callback( [ anchor object ] )
    anchorJS.history(anchor,function(object_array){

    },limit);
```

#### target

Get the target block number anchor data.

```javascript
    // @param   anchor      string      //anchor name
    // @param   block       number      //special block number
    // return callback( anchor object )
    anchorJS.target(anchor,block,function(object){

    });
```

#### multi

Get multi anchor data from list. There are two ways to get anchor. One is just the name, such as "hello" .Another way is the name and block number, such as ["hello",123].
You can use the mix list here, such as ["hello",["anchor_name",333],"world",["music",3345]] .

```javascript
    // @param   list        array       //[anchor,anchor]
    // return callback( [ anchor object ] )
    anchorJS.multi(list,function(object_array){

    });
```

### Market part

#### market

The list of selling anchors. No page function yet.

```javascript
    // return callback( [ market object ] )
    anchorJS.market(function(selling_array){

    });
```

#### sell

Set anchor to selling status. If set the target buyer, the anchor only can be sold to the buyer. You can recall this function to correct the wrong selling status.

```javascript
    // @param   pair      object         //account verify pair
    // @param   anchor    string         //unique anchor name
    // @param   price     number         //selling price
    // @param   target    string         //target buyer SS58 address, can be ignored.
    // return callback( status || error object )
    anchorJS.sell(pair,anchor,price,function(status){

    } ,target);
```

#### unsell

Revoke the anchor selling status.

```javascript
    // @param   pair      object         //account verify pair
    // @param   anchor    string         //unique anchor name
    // return callback( status || error object )
    anchorJS.unsell(pair,anchor,function(status){

    });
```

#### buy

Buy a selling anchor, will follow the seller's price.

```javascript
    // @param   pair      object         //account verify pair
    // @param   anchor    string         //unique anchor name
    // return callback( true || error object )
    anchorJS.buy(pair,anchor,function(status){

    });
```
