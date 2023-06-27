import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Wallet01 } from "@wallet01/react";
import {
  CoinbaseConnector,
  InjectedConnector,
  WalletconnectConnector,
  BananaConnector,
  OkxWalletConnector
} from "@wallet01/evm";
import { KeplrConnector } from "@wallet01/cosmos";
import { PhantomConnector, SolflareConnector } from "@wallet01/solana";
import { TempleConnector } from "@wallet01/tezos";
import Layout from "../components/layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Wallet01
      autoConnect={true}
      connectors={() => [
        new InjectedConnector(),
        new WalletconnectConnector({
          chain: "1",
          chains: [1],
          optionalChains: [137, 80001],
          projectId: "cef77f9c3969fb563468d997449c92d2",
          showQrModal: true,
        }),
        new CoinbaseConnector(),
        new PhantomConnector(),
        new SolflareConnector(),
        new KeplrConnector(),
        new TempleConnector(),
        new BananaConnector(),
        new OkxWalletConnector()
      ]}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Wallet01>
  );
}
