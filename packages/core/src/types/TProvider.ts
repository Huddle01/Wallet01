import { PhantomProvider, SolflareProvider } from '@huddle01-wallets/solana'
import { KeplrProvider } from '@huddle01-wallets/cosmos/src'

import { Web3Provider } from '@ethersproject/providers';
import { WalletLinkProvider } from 'walletlink';
import EthereumProvider from '@walletconnect/ethereum-provider'

  export type TProvider =
  | Web3Provider
  | EthereumProvider
  | WalletLinkProvider
  | PhantomProvider
  | SolflareProvider
  | KeplrProvider