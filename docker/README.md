# Anchor Node Docker Image

## Anchor Node, Substrate Node with Anchor Pallet

Anchor pallet is an extend pallet for Substrate, it is On-chain Linked List and Name Service and On-chain Key-value Storage. By anchor way, it is easy to storage data on chain and do join the blockchain world.

To get the undivided source code for anchor node, you need follow the manual [https://github.com/ff13dfly/Anchor#integration-to-substrate](https://github.com/ff13dfly/Anchor#integration-to-substrate). It means to combine **anchor pallet** code to **substrate**.

After that, swtich to combined code directory, you can build an image from `anchor_builder.Dockerfile`.If you are a docker export, pleas try freely. There is also a shell to help, you can try as follow.

```SHELL
    # please go back to the dirctory where you save the combined source code first.
    # then change to the docker folder
    cd docker

    # need to compile a binrary from substrate source code with anchor pallet.
    # it will take a bit long time to do this, nearly 30 mins.
    sh anchor_build.sh

    # after build successful, you can try the run shell
    # if everything is Ok, you can find the substrate output on console.
    # Great! The image is ready. 
    sh anchor_run.sh --dev --state-pruning archive
```

## Port Expose Problem

You can run the built image by command as follow `docker run -it --rm fuu/anchor --dev`, the you can find the substrate output on console. But when you try to connect to this node, you will fail, the reason is **Port Expose**, and it is a bit complex.

You can try this to expose all ports.

```SHELL
    # expose all ports, but not work on MacOS.
    docker run --network host -it --rm fuu/anchor --dev --state-pruning archive
```

## Anchor Builder Docker Image

### How to

The Docker image in this folder is a `builder` image. It is self contained and allow users to build the binaries themselves.
There is no requirement on having Rust or any other toolchain installed but a working Docker environment.

Unlike the `parity/polkadot` image which contains a single binary (`polkadot`!) used by default, the image in this folder builds and contains several binaries and you need to provide the name of the binary to be called.

You should refer to the .Dockerfile for the actual list. At the time of editing, the list of included binaries is:

- anchor_node

The image can be used by passing the selected binary followed by the appropriate tags for this binary.

Your best guess to get started is to pass the `--help flag`. Here are a few examples:

- `docker run -it --rm fuu/anchor anchor_node --version`
- `docker run -it --rm fuu/anchor --dev`

### Issues

- This anchor image is build from the `anchor_builder.Dockerfile`, it will take more than 30 minutes to do it.

- The build need substrate code as base, if not work, it may be the update of substrate. Please contact me, I will try to fix the bug.

- The image do not include bash in it, so any try to login and run the bash will fail.
