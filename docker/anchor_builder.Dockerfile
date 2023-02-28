##Demo## docker run -t -i 9ddeb8c05d767e0b710e657ccd915fa36d5ebc478d92ce39a2ab632e5b0b6182 /bin/bash 
##Demo## docker run -it parity/substrate /bin/bash
##Demo## docker run -it ff13dfly/test /bin/bash -c

# This is the build stage for Substrate. Here we create the binary.
FROM docker.io/paritytech/ci-linux:production as builder

WORKDIR /substrate
COPY . /substrate

#Combine Anchor pallet code to substrate
RUN git clone https://github.com/ff13dfly/Anchor

RUN cp -rf Anchor/docker/deploy/Cargo.toml Cargo.toml 
RUN cp -rf Anchor/docker/deploy/bin_node_cli_src_chain_spec.rs bin/node/cli/src/chain_spec.rs 
RUN cp -rf Anchor/docker/deploy/bin_node_runtime_Cargo.toml bin/node/runtime/Cargo.toml
RUN cp -rf Anchor/docker/deploy/bin_node_runtime_src_lib.rs bin/node/runtime/src/lib.rs
RUN cp -rf Anchor/docker/deploy/bin_node_testing_src_genesis.rs bin/node/testing/src/genesis.rs
RUN cp -rf Anchor/frame/anchor/* frame

RUN	mkdir playground
RUN cp -rf Anchor/js/playground/* playground

RUN cargo build --locked --release

# This is the 2nd stage: a very small image where we copy the Substrate binary."
FROM docker.io/library/ubuntu:20.04
LABEL description="Docker image for Anchor pallet base on substrate: an On-chain Linked List" \
	io.parity.image.type="builder" \
	io.parity.image.authors="ff13dfly@163.com" \
	io.parity.image.vendor="Fuu" \
	io.parity.image.description="Anchor pallet test image" \
	io.parity.image.source="https://github.com/paritytech/polkadot/blob/${VCS_REF}/docker/substrate_builder.Dockerfile" \
	io.parity.image.documentation="https://github.com/ff13dfly/Anchor/"

COPY --from=builder /substrate/target/release/substrate /usr/local/bin
COPY --from=builder /substrate/target/release/subkey /usr/local/bin
COPY --from=builder /substrate/target/release/node-template /usr/local/bin
COPY --from=builder /substrate/target/release/chain-spec-builder /usr/local/bin

#copy playground code
#COPY --from=builder /substrate/ccc.md /home/ccc.md
RUN mkdir /home/playground
COPY --from=builder /substrate/playground/ /home/playground/

RUN useradd -m -u 1000 -U -s /bin/sh -d /substrate substrate
RUN mkdir -p /data /substrate/.local/share/substrate
RUN chown -R substrate:substrate /data
RUN ln -s /data /substrate/.local/share/substrate
RUN rm -rf /usr/bin /usr/sbin
RUN /usr/local/bin/substrate --version

USER substrate

EXPOSE 30333 9933 9944 9615 3000
VOLUME ["/data"]
