# Anchor Pallet Docker Image

## Anchor Pallet

Anchor pallet is an extend pallet for Substrate, it is On-chian Linked List and Name Service and On-chain Key-value Storage. By anchor way, it is easy to storage data on chain and do join the blockchain world.

## Anchor Builder Docker Image

### How to

The Docker image in this folder is a `builder` image. It is self contained and allow users to build the binaries themselves.
There is no requirement on having Rust or any other toolchain installed but a working Docker environment.

Unlike the `parity/polkadot` image which contains a single binary (`polkadot`!) used by default, the image in this folder builds and contains several binaries and you need to provide the name of the binary to be called.

You should refer to the .Dockerfile for the actual list. At the time of editing, the list of included binaries is:

- anchor_node

The image can be used by passing the selected binary followed by the appropriate tags for this binary.

Your best guess to get started is to pass the `--help flag`. Here are a few examples:

- `docker run --rm -it fuu/anchor anchor_node --version`
- `docker run -it --rm fuu/anchor --dev`

### Issues

- This anchor image is build from the "anchor_builder.Dockerfile", it will take more than 15 minutes to do it.

- The build need substrate code as base, if not work, it may be the update of substrate. Please contact me, I will try and fix the bug.

- The image do not include bash in it, so do not try to get it. The ENTRYPOINT is "/usr/local/bin/anchor_node", just run the image and append the parameters. For example, you want to load as dev simulator, try this command `docker run -it --rm fuu/anchor --dev`
