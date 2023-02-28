# Anchor.js, lib to access to anchor network

## Overview

Anchor.js is a library to access Anchor pallet which supply the On-chain Linked List function. 

## Data structure

### anchor

```Javascript
    "anchor_name";
    ["anchor_name","block_number"];
```

### anchor oject

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

### marker oject

```Javascript
{
    name:"",            //unique anchor name
    owner:"",           //the owner ss58 address
    price:100,          //price of selling anchor
    target:"",          //the target buyer
    free:true,          //wether free to buy
}
```

### error

If there is any error, will through error message on callback.

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
    function set(ws){}
```

#### setKeyring

Set the @polkadot/api keyring class, it is used to verify the account.

```javascript
    // @param ks object  //polkadot Keyring class
    // return true || false
    function setKeyring(ks){}
```

#### ready

Check wether the websocket linker is ready, then anchor.js can work properly.

```javascript
    // no param
    // return true || false
    function ready(){}
```

#### load

Load pair from encry file which can verify account.

```javascript
    // @param encryJSON object      //polkadot encry data
    // @param password string       //password for encry data
    // @param callback function     //callback function
    // return callback( pair || error )
    function load(encryJSON,password,callback){}
```

#### balance

Get the balance of account, used to check insufficient balance normally.

```javascript
    // @param address string        //ss58 address of account
    // @param callback function     //callback function
    // return callback( number || error )
    function balance(address,callback){}
```

#### subcribe

Subscribe data on substrate node, when there is anchor data changed, will callback the data.

```javascript
    // @param callback function     //callback function
    // return callback( anchor object )
    function subcribe(callback){}
```

### Storage part

#### write

Only way to write anchor data, skip the previous block number. Will search the latest block number, then request to set_anchor method.

```javascript
    // @param   pair      object         //account verify pair
    // @param   anchor    string         //unique anchor name, 40 bytes max
    // @param   raw       string         //data wil write to chain, 4MB max
    // @param   protocol  string         //customize protocol, 256 bytes max
    // @param   callback  function       //callback function
    // return callback( anchor object )
    function write(pair, anchor, raw, protocol, callback){}
```

#### search

Search the target anchor name, return the latest data.

```javascript
    // @param   anchor      string      //anchor name
    // @param   callback    function    //callback function
    // return callback( anchor object )
    function search(anchor,callback){}
```

#### history

Get the whole linked list of anchor.

```javascript
    // @param   anchor      string      //anchor name
    // @param   callback    function    //callback function
    // @param   limit       number      //ending block number
    // return callback( [ anchor object ] )
    function history(anchor,callback,limit){}
```

#### target

#### multi

Get multi anchor data from list.

```javascript
    // @param   list        array       //[anchor,anchor]
    // @param   callback    function    //callback function
    // return callback( [ anchor object ] )
    function multi(list,callback){}
```

### Market part

#### market

The list of selling anchors. No page function yet.

```javascript
    // @param   callback    function    //callback function
    // return callback( [ market object ] )
    function market(callback){}
```

#### sell

Set anchor to selling status. If set the target buyer, the anchor only can be sold to the buyer. If there is some wrong setting, you can recall this function to modify the status.

```javascript
    // @param   pair      object         //account verify pair
    // @param   anchor    string         //unique anchor name
    // @param   price     number         //selling price
    // @param   callback  function       //callback function
    // @param   target    string         //target buyer SS58 address
    // return callback( true || error object )
    function sell(pair,anchor,price,callback ,target){}
```

#### unsell

Revoke the anchor selling status.

```javascript
    // @param   pair      object         //account verify pair
    // @param   anchor    string         //unique anchor name
    // @param   callback  function       //callback function
    // return callback( true || error object )
    function unsell(pair,anchor,callback){}
```

#### buy

Buy a selling anchor, will follow the seller's price.

```javascript
    // @param   pair      object         //account verify pair
    // @param   anchor    string         //unique anchor name
    // @param   callback  function       //callback function
    // return callback( true || error object )
    function buy(pair,anchor,callback){}
```
