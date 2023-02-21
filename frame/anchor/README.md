# Anchor Pallet, On-chain Linked List

## Overview

### Terminology

* Anchor: The name saved in AnchorOwner storage. You can treaded it as the domain on substrate chain.

* Protocol:

## Exposed methods

### set_anchor

Set anchor data function. There are two conditions. If the target anchor exsists, will check the ownership, then update the data. Otherwise, will initialize a new anchor.

### sell_anchor

Set the anchor on selling, two ways can be supported.

1. sell anchor freely
2. sell anchor to target account

### unsell_anchor

Revoke the selling status.

### buy_anchor

Buy the selling anchor.

## Storages

### AnchorOwner

### SellList
