# Anchor, an On-chain Linked List storage pallet base on Substrate

Anchor is an On-chain Linked List system base on substrate. On another hand, Anchor can alse be treated as Name Service or On-chain Key-value Storage.

Anchor is an isolated Substrate pallet. It can provide flexible on-chain data structureand and complex logic without upgrading the substrate node itself. That makes blockchain development easy for developer who do not know the blockchain well enough.

You can access the [Playground](https://playground.metanchor.net) to know it well. And, it is easy to test local by following introduction.

## Integration to Substrate

Anchor pallet have tested for the [2022.12 version substrate](https://github.com/paritytech/substrate/tree/monthly-2022-12). Before intergration, you need these codes as follow. After downloading or clone the git.

* Download the [Substrate](https://github.com/paritytech/substrate) code.

* Download the [Anchor pallet](https://github.com/ff13dfly/Anchor) code.

After copy the "Anchor pallet" to Substrate, the following 5 files need minor modifications. You will find that it is petty easy to finish this base on the great job of Substrate.

### 1. Cargo.toml

You will find there is a list called "members", paset code to the proper location, such as before "frame/alliance". Then no more to do to this file.

```TEXT
    "frame/anchor",
```

### 2. bin/node/runtime/Cargo.toml

Just locate it to "pallet-alliance", paste the code there, done.

```RUST
pallet-anchor = { version = "2.0.0-dev", default-features = false, path = "../../../frame/anchor" }
```

### 3. bin/node/runtime/src/lib.rs

You can paste these code to the similar code such as "impl pallet_vesting::Config for Runtime".

```RUST
impl pallet_anchor::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type Currency = Balances;
    type WeightInfo = pallet_anchor::weights::SubstrateWeight<Runtime>;
}
```

Paste the follow code to "construct_runtime!()", you can locate it to "Vesting: pallet_vesting,".

```RUST
Anchor: pallet_anchor,
```

### 4.bin/node/cli/src/chain_spec.rs

Just locate it to "alliance: Default::default()", paste the code there, done.

```RUST
anchor:Default::default(),
```

### 5.bin/node/testing/src/genesis.rs

Just locate it to "alliance: Default::default()", paste the code there, done.

```RUST
anchor:Default::default(),
```

### Issues about Rust & Substrate

* Set up Rust environment. It is popular and you will find a lot of resource to learn about it. Only one suggestion myself, be patient instead of being crazy.

```SHELL

# unit test , change directory to frame/anchor first
cargo test

# build substrate, it will take a bit long time more than 15 minutes depending on your hardware.
cargo build --release

# clean the files, it is better to do it when switching task.
cargo clean
```

* Library problems.

1. clang version
2. protobuf

* Run Substrate

```SHELL
target/substrate --dev --state-pruning archive
```

* Explorer Substrate

## Docker testing

## API calls

There are four exposed API calls, and they can be treaded as two part , set and trade. Will supply the demo code base on Polkadot.js and anchor.js.

### 1. set_anchor, storage part

To make it simple, there is just one single call to set anchor data.

```Javascript
    //polkadot.js code
    wsPolka.tx.anchor.setAnchor(anchor, raw, protocol, previous_block).signAndSend(pair, (res) => {
    
    });
```

```Javascript
    //anchor.js code
```

Limitation of the parameters.

* Key :
* Raw :
* Protocol :
* Pre :

Substrate/Polkadot supplies API to access the storage, you can get the lastest anchor information as follow way.

```Javascript
    //polkadot.js code
    wsPolka.query.anchor.anchorOwner(anchor, (res) =>{

    }).then((unsub) => {

    });
```

Anchor.js supply more methods to access the anchor data, you can check in details here.
[https://github.com/ff13dfly/Anchor/tree/main/js/README.md](https://github.com/ff13dfly/Anchor/tree/main/js/README.md)

### 2. sell_anchor, market part

Set the anchor to selling status.

```Javascript
    //polkadot.js code
    wsPolka.tx.anchor.sellAnchor(anchor,price).signAndSend(pair,(res) => {
        // code here .
    });
```

```Javascript
    //anchor.js code
```

### 3. unsell_anchor, market part

Revoke the anchor selling status.

```Javascript
    //polkadot.js code
    wsPolka.tx.anchor.unsellAnchor(anchor).signAndSend(pair,(res) => {
        // code here .
    });
```

```Javascript
    //anchor.js code
```

### 4. buy_anchor, market part

Buy the anchor.

```Javascript
    //polkadot.js code
    wsPolka.tx.anchor.buyAnchor(anchor).signAndSend(pair,(res) => {
        // code here .
    });
```

```Javascript
    //anchor.js code
```

### Q&A about APIs

1. How to delete an anchor ?

2. Can I update anchor when it is on selling ?

3. Is UTF8 supported by Anchor ?

4. What does the "protocol" feild mean ?

5. How to load the anchor code ?

## More details

### EasyPolka

Anchor is the storage part of EasyPolka.

### Anchor details

* Name Service

* Key-value Storage

### Playground details

* This web application is base on React.