import { PhantomProvider, SolflareProvider } from '@wallet01/solana';
import { KeplrProvider } from '@wallet01/cosmos/src';

import { Web3Provider } from '@ethersproject/providers';
import { WalletLinkProvider } from 'walletlink';
import EthereumProvider from '@walletconnect/ethereum-provider';

export type TProvider =
  | Web3Provider
  | EthereumProvider
  | WalletLinkProvider
  | PhantomProvider
  | SolflareProvider
  | KeplrProvider;