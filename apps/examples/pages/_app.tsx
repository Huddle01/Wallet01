import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { WalletConfig } from '../../../packages/react/src/hooks/context';
// import { InjectedConnector } from '@huddle01-wallets/evm';
import { Web3Provider } from '@ethersproject/providers'
import React from 'react';

export type CustomChainConfig = {
  chainNamespace: 'eip155' | 'solana' | 'other';
  chainId: string;
  rpcTarget?: string;
  displayName: string;
  blockExplorer?: string;
  ticker: string;
  tickerName: string;
};

const defaultChainConfig: CustomChainConfig = {
  chainNamespace: 'eip155',
  chainId: '1',
  displayName: 'ethereum',
  ticker: 'ETH',
  tickerName: 'Ethereum',
};


function MyApp({ Component, pageProps }: AppProps) {
  // const connector = new InjectedConnector()
  return (
    // <WalletConfig provider={Web3Provider} chainConfig={defaultChainConfig} connector={connector}>
      <Component {...pageProps} />
    // </WalletConfig>
  )
}

export default MyApp;
