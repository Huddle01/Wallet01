import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Wallet01 } from '@wallet01/react';
import { CoinbaseConnector, InjectedConnector } from '@wallet01/evm';
import { KeplrConnector } from '@wallet01/cosmos';
import { PhantomConnector, SolflareConnector } from '@wallet01/solana';
import { FilecoinConnector } from '../lib/filecoin';
import Layout from '../components/layout';
import { WalletconnectConnector } from '@wallet01/evm';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Wallet01
      autoConnect={true}
      connectors={() => [
        new FilecoinConnector(),
        new InjectedConnector(),
        new CoinbaseConnector(),
        new WalletconnectConnector(),
        new PhantomConnector(),
        new SolflareConnector(),
        new KeplrConnector(),
      ]}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Wallet01>
  );
}
