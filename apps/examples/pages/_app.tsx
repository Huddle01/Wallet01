import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';

import { Wallet01, Client } from '@wallet01/react';

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
  const [client] = React.useState(
    () =>
      new Client({
        autoConnect: true,
        connectors: [],
      })
  );

  return (
    <Wallet01 client={client}>
      <Component {...pageProps} />
    </Wallet01>
  );
}

export default MyApp;
