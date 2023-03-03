# Anchor Playground

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

### Write to chain

* Link : [https://playground.metanchor.net#write](https://playground.metanchor.net#write)

* It is 3 feilds input form, try anything, then you do storage data on blockchain.

### Search anchor dada

* Link : [https://playground.metanchor.net#home](https://playground.metanchor.net#home)

* Search target anchor name, you will find details more than 3 feilds. Even a link helps you to check the raw data on anchor node.

### Market of Anchor

* Link : [https://playground.metanchor.net#market](https://playground.metanchor.net#market)

* The list of anchors which are on sell, try to buy one, you will know the ownship of anchor well.

### Nodes and Accounts

* Link : [https://playground.metanchor.net#setting](https://playground.metanchor.net#setting)

* Set the node here. Default is localhost and dev.metanchor.net.

* Set the mock accounts here, the account can be used in live network, but please do not do such thing, the passwords are exposed.

### More details

* Link : [https://playground.metanchor.net#document](https://playground.metanchor.net#document)

* More help, enjoy !