# @wallet01/solana

This package will expose connectors for wallets such as:

- Phantom Wallet (PhantomConnector)
- Solflare Wallet (SolflareConnector)

All the connectors are of the type `BaseConnector`

Note: These connectors don’t contain `getChainId` method, as it does not apply to the Solana ecosystem.

## Installation

```
npm i @wallet01/solana
```