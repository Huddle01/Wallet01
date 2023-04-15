import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Wallet01 } from "@wallet01/react";
import {
  CoinbaseConnector,
  InjectedConnector,
  WalletconnectConnector,
  BananaConnector
} from "@wallet01/evm";
import { KeplrConnector } from "@wallet01/cosmos";
import { PhantomConnector, SolflareConnector } from "@wallet01/solana";
import { TempleConnector } from "@wallet01/tezos";

import Layout from "../components/layout";
import { FilecoinConnector } from "../lib/filecoin";

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
        new TempleConnector(),
        new BananaConnector()
      ]}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Wallet01>
  );
}
