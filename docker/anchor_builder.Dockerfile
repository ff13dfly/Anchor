## This is the build stage for Substrate. Here we create the binary.
FROM docker.io/paritytech/ci-linux:production as builder

WORKDIR /substrate
COPY . /substrate

## Combine Anchor pallet code to substrate
RUN ls -alh\
	&& git clone https://github.com/ff13dfly/Anchor\
	&& cp -rf Anchor/docker/deploy/Cargo.toml Cargo.toml \
	&& cp -rf Anchor/docker/deploy/bin_node_cli_src_chain_spec.rs bin/node/cli/src/chain_spec.rs\ 
	&& cp -rf Anchor/docker/deploy/bin_node_runtime_Cargo.toml bin/node/runtime/Cargo.toml\
	&& cp -rf Anchor/docker/deploy/bin_node_runtime_src_lib.rs bin/node/runtime/src/lib.rs\
	&& cp -rf Anchor/docker/deploy/bin_node_testing_src_genesis.rs bin/node/testing/src/genesis.rs\
	&& cp -rf Anchor/frame/anchor/* frame\
	&& cargo build --locked --release

## This is the 2nd stage: a very small image where we copy the Anchor Substrate binary."
FROM docker.io/library/ubuntu:20.04
LABEL description="Anchor pallet testing image base on Substrate" \
	io.parity.image.type="builder" \
	io.parity.image.authors="ff13dfly@163.com" \
	io.parity.image.vendor="Fuu" \
	io.parity.image.description="Anchor is an On-chain Linked List storage pallet" \
	io.parity.image.source="https://github.com/ff13dfly/anchor/docker/anchor_builder.Dockerfile" \
	io.parity.image.documentation="https://github.com/ff13dfly/anchor/"

COPY --from=builder /substrate/target/release/substrate /usr/local/bin/anchor_node

## setup substrate env
RUN useradd -m -u 1000 -U -s /bin/sh -d /substrate substrate\
	&& mkdir -p /data /substrate/.local/share/substrate\
	&& chown -R substrate:substrate /data\
	&& ln -s /data /substrate/.local/share/substrate\
	&& rm -rf /usr/bin /usr/sbin

USER substrate

EXPOSE 30333 9933 9944 9615
VOLUME ["/data"]
ENTRYPOINT ["/usr/local/bin/anchor_node"]