import React, { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useIsMounted } from 'usehooks-ts';
// import { connect } from '../../../packages/multichain/dist';
// import { InjectedConnector } from '@huddle01-wallets/evm'

import { connect } from '@huddle01-wallets/multichain'

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

const Home: NextPage = () => {
  const isMounted = useIsMounted();
  const [account, setAccount] = useState<string>();
  const [did, setDid] = useState<string | null>(null);

  

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={() => connect("injected")}>Metamask</button>
      <button onClick={() => connect("solflare")}>Solflare</button>
      <button onClick={() => connect("phantom")}>Phantom</button>
      <button onClick={() => connect("keplr")}>Keplr</button>
      
    </div>
  );
};

export default Home;
