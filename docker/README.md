# Anchor Node Docker Image

## Anchor Node, Substrate Node with Anchor Pallet

* Anchor pallet is an extend pallet for Substrate, it is On-chain Linked List and Name Service and On-chain Key-value Storage. By anchor way, it is easy to storage data on chain and do join the blockchain world.

* Follow the shell to build docker image of Anchor node.

    ```SHELL
        # create a temp folder
        mkdir temp
        cd temp

        # Get the shell file.
        git clone https://github.com/ff13dfly/Anchor
        
        # run the shell, take more than 30 mins to build
        sh Anchor/docker/anchor_build.sh

        # after successful build try to run, you can get the output of substrate node
        docker run -it --rm fuu/anchor --dev
    ```

## Port Expose Problem

* You can run the built image by command as follow `docker run -it --rm fuu/anchor --dev`, the you can find the substrate output on console. But when you try to connect to this node, you will fail, the reason is **Port Expose**, and it is a bit complex. You can try this to expose all ports.

    ```SHELL
        # Expose all ports, but not work on MacOS.
        docker run --network host -it --rm fuu/anchor --dev --state-pruning archive
    ```

## Issues

* This anchor image is build from the `anchor_builder.Dockerfile`, it will take more than 30 minutes to do it.

* The image do not include bash in it, so any try to login and run the bash will fail.

* If you are newer to docker, please check the install details here [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/). Easy way is here [https://docs.docker.com/engine/install/centos/#install-using-the-convenience-script](https://docs.docker.com/engine/install/centos/#install-using-the-convenience-script), and magic single command here `curl -fsSL https://get.docker.com/ | sh`.

* If you are building the image via virtual machine, please pay attention to the harddisk limitation. The exhaustion of harddisk will cause compilation failure.
