# Anchor Playground

This is a web application to test **anchor.js** to access **anchor node**, you can try it by two ways.

1. Try on the demo site [https://playground.metanchor.net](https://playground.metanchor.net).

2. Run from source code by the shell as follow. Then access here [http://localhost:3000](http://localhost:3000).

```SHELL
    # Get the code and run by yarn
    git clone https://github.com/ff13dfly/Anchor
    cd js/playground
    yarn install
    yarn start
```

 Additionally, if you want to access local private **anchor node** ( [download here](https://github.com/ff13dfly) ), please run it first. The "--state-pruning archive" paramete means that every block can be read by hash. Without this, after 2000 blocks, you can not get the data on block.

 ```SHELL
    # Change to the substrate directory, then run this command.
    # The substrate should include Anchor pallet.
    ./anchor_node --dev --state-pruning archive
 ```
More details about anchor node, please check [https://github.com/ff13dfly/Anchor/blob/main/README.md](https://github.com/ff13dfly/Anchor/blob/main/README.md)

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
**Solution** : Update node by follow commands.

```SHELL
# It means that there is another application called "n" can upgrade node.
npm install -g n
n latest
```

* Not suer the anchor node working status.
**Solution** : Using Polkadot.js UI to access the node to confirm.
URL : [https://polkadot.js.org/apps/](https://polkadot.js.org/apps)

## Functions


### Search anchor dada

* Link : [https://playground.metanchor.net#home](https://playground.metanchor.net#home)

* Local link :  [http://localhost:3000#home](http://localhost:3000#home)

* Search anchor name, you will find details about an anchor. A list of history will help you to check all anchor data.

* Sell/Unsell anchor function is also here, please try freely. The password for the mock account is tagged out by green badge.

* If you want to know the data details on storage , there is a link helps you to check via Polkadot UI.

### Write to chain

* Link : [https://playground.metanchor.net#write](https://playground.metanchor.net#write)

* Local link :  [http://localhost:3000#write](http://localhost:3000#write)

* It is 3 fields input form, try anything, then you do storage data on blockchain. But it takes seconds to fininsh the whole process, you can get the tips about the steps.

* You can find the anchor history and ownership on the right side.

### Market of Anchor

* Link : [https://playground.metanchor.net#market](https://playground.metanchor.net#market)

* Local link :  [http://localhost:3000#market](http://localhost:3000#market)

* The list of anchors which are on sell, try to buy one, you will know the ownership of anchor well.

### Nodes and Accounts

* Link : [https://playground.metanchor.net#setting](https://playground.metanchor.net#setting)

* Local link :  [http://localhost:3000#setting](http://localhost:3000#setting)

* Set the node here. Default is localhost and dev.metanchor.net.

* Set the mock accounts here, the account can be used in live network, but please do not do such thing, the passwords are exposed.

* There is a **free charge** button , at the first start, please click it to avoid the failure of writing anchor.

### Gameplay

* Link : [https://playground.metanchor.net#document](https://playground.metanchor.net#document)

* Local link :  [http://localhost:3000#document](http://localhost:3000#document)

* The suggest gameplay steps, enjoy !