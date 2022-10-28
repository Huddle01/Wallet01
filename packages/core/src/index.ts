import { Wallet } from './wallet';
import {
  InjectedConnector,
  CoinbaseConnector,
  PhantomConnector,
} from './connectors';
import {
  type CustomChainConfig,
  type ClientConfig,
  type ConnectedData,
  BaseConnector,
} from './types';
import { Web3Provider } from '@ethersproject/providers';
import { WalletLinkProvider } from 'walletlink';
import WalletConnectProvider from '@walletconnect/ethereum-provider';

export {
  Wallet,
  InjectedConnector,
  type CustomChainConfig,
  type ClientConfig,
  type ConnectedData,
  BaseConnector,
  CoinbaseConnector,
  WalletLinkProvider,
  PhantomConnector,
  Web3Provider,
  WalletConnectProvider,
};
