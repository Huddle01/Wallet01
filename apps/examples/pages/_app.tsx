import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';

import { Wallet01 } from '@huddle01-wallets/react';

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
  return (
    <Wallet01>
      <Component {...pageProps} />
    </Wallet01>
  )
}

export default MyApp;
