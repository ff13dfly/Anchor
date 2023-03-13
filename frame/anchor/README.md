# Anchor Pallet, On-chain Linked List

* Anchor is an On-chain Linked List pallet for [substrate](https://github.com/paritytech/substrate), it is based on substrate transfer extension.

* You can storage data on chain by anchor, as this way, it is a On-chain Key-value Storage.

* Anchor is also can be treaded as Name Service, you can own special anchor name by initializing it. 

## Overview

### Terminology

* Anchor: The name saved in AnchorOwner storage. You can treaded it as the domain on anchor chain.

* Protocol: Custom protocol, 256 bytes max.

* Raw: Any data you want to storage on chain.

### Unit Test

The unit test follow the substrate standard. Just change directory to frame/anchor, then run unit test as follow command.

```SHELL
    cargo clean
    cargo test
```

### Compatibility

* Compiled successful on [https://github.com/paritytech/substrate/releases/tag/monthly-2023-02](https://github.com/paritytech/substrate/releases/tag/monthly-2023-02)

## Exposed Methods

### set_anchor

Set anchor data function. There are two conditions. If the target anchor exsists, will check the ownership, then update the data. Otherwise, will initialize a new anchor.

```RUST
    pub fn set_anchor(
      origin: OriginFor<T>,   //default
      key: Vec<u8>,           //Anchor name
      raw: Vec<u8>,           //raw data to storage
      protocol: Vec<u8>,      //data protocol, used to decide how to decode raw data
      pre:T::BlockNumber      //the previous block number which storage anchor data
    ) -> DispatchResult {
      // code here.
      Ok(())
    }
```

### sell_anchor

Set the anchor on selling, two ways can be supported.

1. sell anchor freely
2. sell anchor to target account

```RUST
    pub fn sell_anchor(
      origin: OriginFor<T>,   //default
      key: Vec<u8>,           //Anchor name
      cost: u32,              //unit accuracy
      target:<T::Lookup as StaticLookup>::Source  //target buyer SS58 address. If the same as owner, can be sold to anyone.
    ) -> DispatchResult {
      // code here.
      Ok(())
    }
```

### unsell_anchor

Revoke the selling status.

```RUST
    pub fn unsell_anchor(
      origin: OriginFor<T>,   //default
      key: Vec<u8>,           //Anchor name
    ) -> DispatchResult {
      // code here.
      Ok(())
    }
```

### buy_anchor

Buy the selling anchor.

```RUST
    pub fn buy_anchor(
        origin: OriginFor<T>,    //default
      key: Vec<u8>,            //Anchor name
    ) -> DispatchResult {
      // code here.
      Ok(())
    }
```

## Storages

### AnchorOwner

  ```RUST
    // (T::AccountId,T::BlockNumber)
    //  T::AccountId, the anchor owner ss58 address
    //  T::BlockNumber, last block number when updated data successfully.
    pub(super) type AnchorOwner<T: Config> = StorageMap < 
        _, 
        Twox64Concat,
        Vec<u8>,                        //anchor name
        (T::AccountId,T::BlockNumber)   //check the head lines
    >;
  ```

### SellList

  ```RUST
    // (T::AccountId, u32,T::AccountId)
    // T::AccountId, the anchor owner ss58 address
    // u32, the sell price for the anchor
    // T::AccountId, the target buyer. If the same as owner, it is free to buy.
    pub(super) type SellList<T: Config> = StorageMap<
        _,
        Twox64Concat,
        Vec<u8>,                            //anchor name
        (T::AccountId,u32,T::AccountId)     //check the head lines
    >;
  ```

## Events

### AnchorToSell

When an anchor is set to selling status, will trigger this event.

  ```RUST
    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
      AnchorToSell(T::AccountId,u32,T::AccountId),  //(owner, price , target)
    }
  ```
