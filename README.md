# Wallet01

>This package is in beta stage, handle with care.

> Documentation for the Wallet01 can be found [here.](https://huddle01.notion.site/Wallet01-66b9a56d73964fd19614743fb7a38780)
## What is Wallet01?

Wallets are an essential part of the ecosystem as they serve as the gateway to interact with the blockchain and represent your unique identity in the blockchain. Therefore, it’s extremely important your app has the ability to communicate with the wallet to transact and make changes on the blockchain.

Wallet01 provides a set of magic sticks and hats to ease your (the developers’) life by making interaction with wallets as easy as possible.

The following are the core features of Wallet01:

- Chain Agnostic
- Modular, plug n’ play
- Statically typed

## Wallet01 Overview

Wallet01 provides a plug n’ play architecture to make your app chain agnostic. Wallet01 package lets you interact with wallets of different ecosystems.

The `@wallet01/core` package powers the whole Wallet01 package ecosystem by laying out the basic structure and shape to make your app more and more chain agnostic.

We currently support the following three ecosystems. Each of these has its own connector packages. The packages are:

- `@wallet01/evm`: Ethereum Ecosystem
- `@wallet01/solana`: Solana Ecosystem
- `@wallet01/cosmos`: Cosmos Ecosystem

---
## Installing packages

All the packages are under `@wallet01` organisation, thus you can install any of them by,

``` bash
npm i @wallet01/core
```
``` bash
npm i @wallet01/react
```
``` bash
npm i @wallet01/evm
```
``` bash
npm i @wallet01/cosmos
```
``` bash
npm i @wallet01/solana
```

---
## Contributors

- [@deepso7](https://github.com/deepso7)
- [@thevatsal-eth](https://github.com/thevatsal-eth)