# Anchor, an On-chain Linked List storage pallet base on Substrate

Anchor is an On-chain Linked List system base on [Substrate](). On another hand, Anchor can alse be treated as Name Service or On-chain Key-value Storage.

Anchor is an isolated Substrate pallet. It can provide flexible on-chain data structure and complex logic without upgrading the substrate node itself. That makes blockchain development easy for developper who do not know the blockchain well enough.

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

1. Rust language.
It is popular and you will find a lot of resource to learn about it. Only one suggestion myself, be patient instead of being crazy.
After the enviroment is set up successful, the following commands are used to test and build anchor code.

```SHELL
# unit test , change directory to frame/anchor first
cargo test

# build substrate, it will take a bit long time more than 15 minutes depending on your hardware.
cargo build --release

# clean the files, it is better to do it when switching task.
cargo clean
```

2. Clang version.
In some system such as centos which I have tested, the clang version is too low, you need to update and set to new version manually.

```SHELL
# set clang version to target one
scl enable devtoolset-7 bash
```

3. Protobuf
It is a new problem, this helps to reduce the size of substrate bin nearly 40%, but in mac, it is not installed.

```SHELL
brew install automake
brew install libtool
brew install protobuf
protoc --version
```

4. Run anchor binrary  
Anchor pallet need to read the block hash, new versions of Substrate will drop the map to save memory. To avoid this, you need to add the parameters when start anchor node.

```SHELL
# --state-pruning archive
# without this parameter, the hash of block can not been read.
target/substrate --dev --state-pruning archive
```

5. Browser Substrate

Polkadot explorer works pretty good, you can run local by downloading here. Or, just trying the web application here.

## Docker testing

### Intergration files

The 5 files which are needed to modify, is included in folder "deploy". The path is included in filename, connect by "_".

* bin_node_cli_src_chain_spec.rs
* bin_node_runtime_Cargo.toml
* bin_node_runtime_src_lib.rs
* bin_node_testing_src_genesis.rs
* Cargo.toml

### Build from source code

There is a shell file to create docker image, you can test it by one command.

```SHELL
    sh build.sh
```

### Run from docker image

Not yet. It is still a problem need to sovle myself.

## API calls

There are four exposed API calls, and they can be treaded as two part , set and trade. Will supply the demo code base on [@polkadot/api]() and [anchor.js]().

### 1. set_anchor, storage part

To make it simple, there is just one single call to set anchor data.

```Javascript
    //@polkadot/api code
    polkadotWebsocket.tx.anchor.setAnchor(anchor, raw, protocol, previous_block).signAndSend(pair, (res) => {
    
    });
```

```Javascript
    //anchor.js code
    anchorJS.write(pair, anchor, raw, protocol, (status) => {
    
    });
```

Limitation of the parameters.

* Key : Vec<u8> , 40 bytes max
* Raw : Vec<u8> , 4MB max
* Protocol : Vec<u8>  , 256 bytes max
* Pre : block_number

Substrate/Polkadot supplies API to access the storage, you can get the lastest anchor information as follow way.

```Javascript
    //@polkadot/api code
    polkadotWebsocket.query.anchor.anchorOwner(anchor, (res) =>{

    }).then((unsub) => {

    });
```

```Javascript
    //anchor.js code
    anchorJS.owner(anchor,(object)=>{

    })
```

Anchor.js supply more methods to access the anchor data, you can check in details here.
[https://github.com/ff13dfly/Anchor/tree/main/js/README.md](https://github.com/ff13dfly/Anchor/tree/main/js/README.md)

### 2. sell_anchor, market part

Set the anchor to selling status.

```Javascript
    //@polkadot/api code
    polkadotWebsocket.tx.anchor.sellAnchor(anchor,price,target).signAndSend(pair,(res) => {
        // code here .
    });
```

```Javascript
    //anchor.js code
    anchorJS.sell(pair,anchor,price,(status)=>{

    } ,target)
```

### 3. unsell_anchor, market part

Revoke the anchor selling status.

```Javascript
    //@polkadot/api code
    polkadotWebsocket.tx.anchor.unsellAnchor(anchor).signAndSend(pair,(res) => {
        // code here .
    });
```

```Javascript
    //anchor.js code
    anchorJS.unsell(pair,anchor,(status)=>{

    })
```

### 4. buy_anchor, market part

Buy the anchor. The ownership will change and the history data will not change.

```Javascript
    //@polkadot/api code
    polkadotWebsocket.tx.anchor.buyAnchor(anchor).signAndSend(pair,(res) => {
        // code here .
    });
```

```Javascript
    //anchor.js code
    anchorJS.buy(pair,anchor,(status)=>{

    })
```

### Q&A about APIs

1. how to delete an exsist anchor ?

> No, you can not delete even you are the owner of the anchor.

2. How to remove the anchor data ?

> No, you can not delete an exsist anchor.

3. Can I update anchor when it is on selling ?

> Yes, you can.

4. Is UTF8 supported by Anchor ?

> Yes, but UTF8 characters will cost more bytes.

5. What does the "protocol" feild mean ?

> It is a 256 bytes string to define your own protocol on chain.
