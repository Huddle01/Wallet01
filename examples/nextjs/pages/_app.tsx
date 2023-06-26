import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Wallet01 } from "@wallet01/react";
import { InjectedConnector, WalletconnectConnector } from "@wallet01/evm";

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
          projectId: "190ea8e3ce540de271817462e33e310b",
          showQrModal: true,
        }),
      ]}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Wallet01>
  );
}
