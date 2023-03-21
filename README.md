# Anchor, an On-chain Linked List storage pallet base on Substrate

* Anchor is an On-chain Linked List system base on [Substrate](https://github.com/paritytech/substrate). On another hand, Anchor can alse be treated as Name Service or On-chain Key-value Storage.

* Anchor is an isolated Substrate pallet. It can provide flexible on-chain data structure and complex logic without upgrading the substrate node itself. That makes blockchain development easy for developer who does not know the blockchain well enough, just remeber read and write methods.

* You can access the [Playground](https://playground.metanchor.net) to know it well. And, it is easy to test local by following introduction.

## Overview

* There are three ways to integrate **Anchor Pallet**, meet different requirement.
    1. [Docker way](https://github.com/ff13dfly/Anchor#docker-testing)
    2. [Shell way](https://github.com/ff13dfly/Anchor#integration-shell)
    3. [Manual way](https://github.com/ff13dfly/Anchor#manual-integration)

* There are 4 methods exposed in **Anchor Pallet**
    1. [set_anchor](https://github.com/ff13dfly/Anchor#1-set_anchor-storage-part)
    2. [sell_anchor](https://github.com/ff13dfly/Anchor#2-sell_anchor-market-part)
    3. [unsell_anchor](https://github.com/ff13dfly/Anchor#3-unsell_anchor-market-part)
    4. [buy_anchor](https://github.com/ff13dfly/Anchor#4-buy_anchor-market-part)

## Integration

### Docker Testing

#### Build Docker Image

* There is a shell file to create docker image, you can build the docker image by run the shell file. It will take more than 30 minutes, please get a cup of coffee.

    ```SHELL
        # Download the target substrate source code
        # The latest substrate may have new feature, the follow one is tested.
        wget https://github.com/paritytech/substrate/archive/refs/tags/monthly-2023-02.tar.gz
        tar -zxvf monthly-2023-02.tar.gz

        mkdir substrate
        cp -r substrate-monthly-2023-02/* substrate/
        
        # Copy anchor pallet to substrate frame folder, combine the code
        git clone https://github.com/ff13dfly/Anchor
        cp Anchor/docker/anchor_builder.Dockerfile substrate/docker/

        # build docker image
        cd substrate
        docker build -f docker/anchor_builder.Dockerfile -t fuu/anchor:latest . --progress=plain
    ```

#### Run Docker Image

* The docker image do not have a bash, so you just need docker to run test. Details here [https://github.com/ff13dfly/Anchor/tree/main/docker/README.md](https://github.com/ff13dfly/Anchor/tree/main/docker/README.md).

    ```SHELL
        # After build successful, you can try the command
        # If everything is Ok, you can find the substrate output on console.
        docker run --rm --network host -it fuu/anchor --dev --state-pruning archive
    ```

* After the successful running, still challenges, you can check the [details](https://github.com/ff13dfly/Anchor/tree/main/docker/README.md), hope it helps.

### Integration Shell

* Anchor pallet have tested for the [2023.02 version substrate](https://github.com/paritytech/substrate/releases/tag/monthly-2023-02).Remove the Cargo.lock, in case the needed library out of time.

* Follow the shell, you can compile the souce code successful if your system is 

    ```SHELL
        # Get the substrate source code via github, latest tested is 2023-02 pre-release
        wget https://github.com/paritytech/substrate/archive/refs/tags/monthly-2023-02.tar.gz
        tar -zxvf monthly-2023-02.tar.gz

        mkdir substrate
        cp -r substrate-monthly-2023-02/* substrate/

        # Get the anchor pallet source code and copy to substrate frame folder
        git clone https://github.com/ff13dfly/Anchor
        cp -r Anchor/frame/anchor substrate/frame

        # Copy the intergrate files for anchor. Need you type `y` to confirm
        cp -rf Anchor/docker/deploy/202302/_Cargo.toml substrate/Cargo.toml
        cp -rf Anchor/docker/deploy/202302/bin_node_cli_src_chain_spec.rs substrate/bin/node/cli/src/chain_spec.rs
        cp -rf Anchor/docker/deploy/202302/bin_node_runtime_Cargo.toml substrate/bin/node/runtime/Cargo.toml
        cp -rf Anchor/docker/deploy/202302/bin_node_runtime_src_lib.rs substrate/bin/node/runtime/src/lib.rs
        cp -rf Anchor/docker/deploy/202302/bin_node_testing_src_genesis.rs substrate/bin/node/testing/src/genesis.rs

        # Go to combined code directory
        cd substrate

        # compile substrate node with anchor pallet
        cargo build --release
    ```

#### Issues about Rust & Substrate

1. **Rust language**

    It is popular and you will find a lot of resource to learn about it. Only one suggestion myself, be patient instead of being crazy.
    After the enviroment is set up successful, the following commands are used to test and build anchor code.

    ```SHELL
         # Unit test , change directory to frame/anchor first
        cargo test

        # Build substrate
        # it will take a bit long time more than 15 minutes depending on your hardware.
        cargo build --release

        # Clean the files, it is better to do it when switching task.
        cargo clean
    ```

    If you meet Rust version problem, try these ways.

    ```SHELL
        # Update rustup itself.
        rustup self update

        # Update rust tools
        rustup upgrade
        rustup update nightly
    ```

2. **Clang version**
    In some system such as centos which I have tested, the clang version is too low, you need to update and set to new version manually.

    ```SHELL
        # Set clang version to target one
        scl enable devtoolset-7 bash
    ```

3. **Protobuf**
    It is a new problem, this helps to reduce the size of substrate bin nearly 40%, but in MacOS, it is not installed.

    ```SHELL
        # Install protobuf to support substrate compile
        brew install automake
        brew install libtool
        brew install protobuf
        protoc --version
    ```

4. **Run anchor binrary**  
    Anchor pallet need to read the block hash, new versions of Substrate will drop the map to save memory. To avoid this, you need to add the parameters when start anchor node.

    ```SHELL
        # --state-pruning archive
        # Without this parameter, the hash of block can not been read.
        # Run release binrary to test, after `cargo build --release`
        target/release/substrate --dev --state-pruning archive
    ```

5. **Substrate Browser**

    Polkadot explorer works pretty good, you can run local by checking [polkadot-js](https://github.com/polkadot-js/) here. Or, just trying the [web application](https://polkadot.js.org/apps/) directly.

### Manual Integration

* If you need to try the latest substrate, it is the manual way. After the shell as follow, you need to modify 5 files, then you can try to compile the source code to check wether **Anchor Pallet** works well with the latest substrate code.

    ```SHELL
        # Get the latest substrate source code
        git clone https://github.com/paritytech/substrate

        # Get the anchor pallet source code
        git clone https://github.com/ff13dfly/Anchor

        # Copy anchor pallet to substrate frame folder
        cp -r Anchor/frame/anchor substrate/frame
    ```

#### 1. Cargo.toml

* You will find there is a list called `members`, paset code to the proper location, such as before `frame/alliance`. Then no more to do to this file.

    ```TEXT
        "frame/anchor",
    ```

#### 2. bin/node/runtime/Cargo.toml

* Just locate it to `pallet-alliance`, paste the code there, done.

    ```RUST
    pallet-anchor = { version = "2.0.0-dev", default-features = false, path = "../../../frame/anchor" }
    ```

#### 3. bin/node/runtime/src/lib.rs

* You can paste these code to the similar code such as `impl pallet_vesting::Config for Runtime`.

    ```RUST
    impl pallet_anchor::Config for Runtime {
        type RuntimeEvent = RuntimeEvent;
        type Currency = Balances;
        type WeightInfo = pallet_anchor::weights::SubstrateWeight<Runtime>;
    }
    ```

* Paste the follow code to "construct_runtime!()", you can locate it to `Vesting: pallet_vesting,`.

    ```RUST
    Anchor: pallet_anchor,
    ```

#### 4.bin/node/cli/src/chain_spec.rs

* Just locate it to `alliance: Default::default()`, paste the code there, done.

    ```RUST
    anchor:Default::default(),
    ```

#### 5.bin/node/testing/src/genesis.rs

* Just locate it to `alliance: Default::default()`, paste the code there, done.

    ```RUST
    anchor:Default::default(),
    ```

## Exposed Methods

* There are four exposed API calls in Anchor Pallet, and they can be treaded as two part , storage and market. Will supply the demo code base on **@polkadot/api** and **anchor.js**.

### 1. set_anchor, storage part

* To make it simple, there is just one single call to set anchor data.

    ```Javascript
        //@polkadot/api code
        polkadotWebsocket.tx.anchor.setAnchor(anchor, raw, protocol, previous_block).signAndSend(pair, (res) => {
            //Your code here.
        });
    ```

    ```Javascript
        //anchor.js code
        anchorJS.write(pair, anchor, raw, protocol, (status) => {
            //Your code here.
        });
    ```

* Substrate/Polkadot supplies API to access the storage, you can get the lastest anchor information as follow way.

    ```Javascript
        //@polkadot/api code
        polkadotWebsocket.query.anchor.anchorOwner(anchor, (res) =>{
            //Your code here.
        }).then((unsub) => {

        });
    ```

    ```Javascript
        //anchor.js code
        anchorJS.owner(anchor,(address,block)=>{
            //Your code here.
        })
    ```

* Anchor.js supply more methods to access the anchor data, you can check in details here.
[https://github.com/ff13dfly/Anchor/tree/main/js/README.md](https://github.com/ff13dfly/Anchor/tree/main/js/README.md)

### 2. sell_anchor, market part

* Set the anchor to selling status.

    ```Javascript
        //@polkadot/api code
        polkadotWebsocket.tx.anchor.sellAnchor(anchor,price,target).signAndSend(pair,(res) => {
            //Your code here.
        });
    ```

    ```Javascript
        //anchor.js code
        anchorJS.sell(pair,anchor,price,(status)=>{
            //Your code here.
        } ,target)
    ```

### 3. unsell_anchor, market part

* Revoke the anchor selling status.

    ```Javascript
        //@polkadot/api code
        polkadotWebsocket.tx.anchor.unsellAnchor(anchor).signAndSend(pair,(res) => {
            //Your code here.
        });
    ```

    ```Javascript
        //anchor.js code
        anchorJS.unsell(pair,anchor,(status)=>{
            //Your code here.
        })
    ```

### 4. buy_anchor, market part

* Buy the anchor. The ownership will change and the history data will not change.

    ```Javascript
        //@polkadot/api code
        polkadotWebsocket.tx.anchor.buyAnchor(anchor).signAndSend(pair,(res) => {
            //Your code here.
        });
    ```

    ```Javascript
        //anchor.js code
        anchorJS.buy(pair,anchor,(status)=>{
            //Your code here.
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
