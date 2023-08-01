import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Wallet01 } from "@wallet01/react";
import {
  CoinbaseConnector,
  InjectedConnector,
  WalletconnectConnector,
  BananaConnector,
  OkxWalletConnector,
} from "@wallet01/evm";
import { KeplrConnector } from "@wallet01/cosmos";
import { PhantomConnector, SolflareConnector } from "@wallet01/solana";
import { BeaconConnector, TempleConnector } from "@wallet01/tezos";
import Layout from "../components/layout";
import { ColorMode } from "@wallet01/tezos/dist/types";

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
        new BananaConnector(),
        new OkxWalletConnector(),
        new CoinbaseConnector(),
        new PhantomConnector({
          rpcUrl: "https://api.mainnet-beta.solana.com",
        }),
        new SolflareConnector({
          rpcUrl: "https://api.mainnet-beta.solana.com",
        }),
        new KeplrConnector(),
        new TempleConnector({ projectName: "Wallet01" }),
        new BeaconConnector({
          name: "Wallet01",
          featuredWallets: ["temple", "umami", "kukai", "naan"],
          colorMode: ColorMode.DARK,
        }),
      ]}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Wallet01>
  );
}
