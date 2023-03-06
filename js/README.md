# Anchor.js, lib to access Anchor node

## Overview

Anchor.js is a library to access Anchor pallet which supply the On-chain Linked List function. Playing on the Playgroud is the recommand way to know Anchor well. All functions in anchor.js  is used in the playground code.

## Data structure

Anchor is a simple way to access substrate world, there are four main data structure which you need paying attention to.

### Anchor Location

Coding with anchor, you need to locate the data on chain. There are two ways, almost the same, the most important part is anchor name. By the way, as the data is pubilc on-chain, anybody can access the anchor data without limitation.

```Javascript
    //just anchor name. Anchor.js treated as the latest data of anchor
    "anchor_name";

    //anchor name and block number. Anchor.js will search the target block to get the data.
    ["anchor_name","block_number"];
```

### Anchor Data Object

This object includes all details of a specific anchor. Anchor data object is combined both the storage details and teh market details.

```Javascript
{
    "name":"",          //unique anchor name
    "protocol":{},      //anchor protocol, JSON normally
    "raw":"",           //raw data
    "block":0,          //block number where data stored
    "stamp":0,          //time stamp when the on-chain data written.
    "pre":0,            //block number where previous data stored
    "signer":"",        //the signer ss58 address
    "empty":false,      //empty or not
    "owner":"",         //the owner ss58 address
    "sell":false,       //anchor selling status
    "cost":0,           //price of selling anchor
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

### Error

If there is any error, anchorJS will through error message on callback.

```Javascript
{error:"error message"}
```

## Methods

There are three parts in anchor.js as follow.

1. @polkadot/api, it is the dependence.
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

Set the @polkadot/api keyring class, it is used to verify the account.

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

Load pair from encry file which can verify account.

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

Only way to write anchor data, skip the previous block number. Will search the latest block number, then request to set_anchor method.

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

Search the target anchor name, return the latest data.

```javascript
    // @param   anchor      string      //anchor name
    // return callback( anchor object )
    anchorJS.search(anchor,function(object){

    });
```

#### owner

Search the target anchor name, return the latest data.

```javascript
    // @param   anchor      string      //anchor name
    // return callback( anchor object )
    anchorJS.owner(anchor,function(object){

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

Get the whole linked list of anchor.

```javascript
    // @param   anchor      string      //anchor name
    // @param   block       number      //special block number
    // return callback( anchor object )
    anchorJS.target(anchor,block,function(object){

    });
```

#### multi

Get multi anchor data from list. There are two ways to get anchor. One is just the name, such as "hello" .Another way is the name and target block, such as ["hello",123].
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

Set anchor to selling status. If set the target buyer, the anchor only can be sold to the buyer. If there is some wrong setting, you can recall this function to modify the status.

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
