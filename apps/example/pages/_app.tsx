import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Wallet01, Client } from '@wallet01/react';
import {
  InjectedConnector,
  CoinbaseConnector,
  WalletconnectConnector,
} from '@wallet01/evm';
import { KeplrConnector } from '@wallet01/cosmos';
import { PhantomConnector, SolflareConnector } from '@wallet01/solana';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [client] = useState(
    () =>
      new Client({
        autoConnect: false,
        connectors: [
          new InjectedConnector(),
          new CoinbaseConnector(),
          new WalletconnectConnector(),
          new KeplrConnector(),
          new PhantomConnector(),
          new SolflareConnector(),
        ],
      })
  );

  return (
    <Wallet01 client={client}>
      <Component {...pageProps} />
    </Wallet01>
  );
}
