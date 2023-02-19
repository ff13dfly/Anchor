# Anchor, a On-chain Linked List storage pallet base on Substrate

Anchor is a On-chain Linked List system base on substrate 3.0.0. It is used to support cApp ( Chain Application, 100% on chain ) development. On another hand, Anchor can alse be treated as Name Service or On-chain Key-value Storage.

Anchor is an isolated Substrate pallet. It can provide flexible data structure on the chain and handle complex logic without upgrading the substrate node itself.

You can access the [Playground](https://playground.metanchor.net) to know it well.

## Integration to Substrate

Anchor pallet have tested for the substrate which released on 2022.12.Before intergration, you need these codes as follow. After downloading or clone the git.

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

* Set up Rust environment

```SHELL
cargo test
cargo build --release
```

* Run Substrate

```SHELL
target/substrate --dev --state-pruning archive
```

* Explorer Substrate

## Docker testing

## More details

### EasyPolka

### Anchor details

* Name Service

* Key-value Storage

### Playground details
