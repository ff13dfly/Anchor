# Playground

It is a web application to test anchor.js, you can try it by two ways.

1. Try on the demo site [https://playground.metanchor.net](https://playground.metanchor.net).

2. Run from source code by the shell as flow. You can access it here [http://localhost:3000](http://localhost:3000).

```SHELL
    # node works well too, you can follow the React manual.
    yarn start
```

 Additionally, if you want to access local private chain, please run it first. The "--state-pruning archive" param means that every block can be read by hash. Without this, after 2000 blocks, you can not get the data on block.

 ```SHELL
    # Change to the substrate directory, then run this command.
    # The substrate should include Anchor pallet.
    ./substrate --dev --state-pruning archive
 ```

## Requirement

* bootstrap [https://react-bootstrap.github.io/](https://react-bootstrap.github.io/)

```SHELL
    # Only install the libraries in the target project, please check the folde "node_modules"
    # This is the UI framework.
    yarn add react-bootstrap bootstrap
```

* @polkadot/api [https://polkadot.js.org/](https://polkadot.js.org/)

```SHELL
    # Only install the libraries in the target project, please check the folde "node_modules"
    # This is the key part to link to substrate node, anchor.js relies on it to read & write.
    yarn add @polkadot/api
```

## Issues

* Node version problem, can not install the JS library.
Solution : Update node by follow commands.

```SHELL
# It means that there is another application called "n" can upgrade node.
npm install -g n
n latest
```

## Functions

* Playground is the demo for anchor.js, you can get the released one here [https://github.com/ff13dfly/Anchor/js/publish](https://github.com/ff13dfly/Anchor/js/publish).

* Follow operation manual will treat [https://playground.metanchor.net](https://playground.metanchor.net) as default.

### Write to chain

* Click the navbar "Write" to access or just use this URL [https://playground.metanchor.net#write](https://playground.metanchor.net#write)

### View chain dada

### History data of target Anchor

### Market of Anchor