    # Get the target substrate release version
    wget https://github.com/paritytech/substrate/archive/refs/tags/monthly-2023-02.tar.gz
    tar -zxvf monthly-2023-02.tar.gz

    mkdir substrate
    cp -r substrate-monthly-2023-02/* substrate/
    
    # Copy anchor pallet to substrate frame folder, combine the code
    git clone https://github.com/ff13dfly/Anchor
    cp Anchor/docker/anchor_builder.Dockerfile substrate/docker/
    cp -r Anchor/frame/anchor substrate/frame

    # Copy files to substrate 
    cp -rf Anchor/docker/deploy/202302/_Cargo.toml substrate/Cargo.toml
    cp -rf Anchor/docker/deploy/202302/bin_node_cli_src_chain_spec.rs substrate/bin/node/cli/src/chain_spec.rs
    cp -rf Anchor/docker/deploy/202302/bin_node_runtime_Cargo.toml substrate/bin/node/runtime/Cargo.toml
    cp -rf Anchor/docker/deploy/202302/bin_node_runtime_src_lib.rs substrate/bin/node/runtime/src/lib.rs
    cp -rf Anchor/docker/deploy/202302/bin_node_testing_src_genesis.rs substrate/bin/node/testing/src/genesis.rs

    # build docker image
    cd substrate
    docker build -f docker/anchor_builder.Dockerfile -t fuu/anchor:latest . --progress=plain