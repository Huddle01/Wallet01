import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Wallet01, useInitClient } from '@wallet01/react';
import {
  InjectedConnector,
  CoinbaseConnector,
  // WalletconnectConnector,
} from '@wallet01/evm';
import { KeplrConnector } from '@wallet01/cosmos';
import { PhantomConnector, SolflareConnector } from '@wallet01/solana';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const init = useInitClient();

  useEffect(() => {
    init({
      autoConnect: true,
      connectors: [
        new InjectedConnector(),
        new CoinbaseConnector(),
        // new WalletconnectConnector(),
        new PhantomConnector(),
        new SolflareConnector(),
        new KeplrConnector(),
      ],
    });
  }, [init]);

  return (
    <Wallet01>
      <Component {...pageProps} />
    </Wallet01>
  );
}
