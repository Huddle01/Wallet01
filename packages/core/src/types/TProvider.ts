import {
  KeplrProvider,
  PhantomProvider,
  SolanaProvider,
  SolanaWindow,
  SolflareProvider,
} from '../providers';

import { Web3Provider } from '@ethersproject/providers';
import { WalletLinkProvider } from 'walletlink';

export type TProvider =
  | Web3Provider
  | WalletLinkProvider
  | PhantomProvider
  | SolanaProvider
  | SolflareProvider
  | KeplrProvider
  | SolanaWindow;
