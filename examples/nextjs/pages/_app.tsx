import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Wallet01 } from "@wallet01/react";
import {
  CoinbaseConnector,
  InjectedConnector,
  WalletconnectConnector,
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
        new WalletconnectConnector("1", {
          chains: [1,4, 137],
          projectId: "190ea8e3ce540de271817462e33e310b",
          qrModalOptions: {
            themeMode: "dark",
          }
        }),
        new PhantomConnector(),
        new SolflareConnector(),
        new KeplrConnector(),
        new TempleConnector(),
      ]}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Wallet01>
  );
}
