import React, { useState } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import  {Client, InjectedConnector } from '@huddle01/wallets'
import { useIsMounted } from 'usehooks-ts'

export type CustomChainConfig = {
  chainNamespace: "eip155" | "solana" | "other";
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
  tickerName: 'Ethereum'

}

const Home: NextPage = () => {

  const isMounted = useIsMounted()
  const [ account, setAccount ] = useState<string>()
  const [ did, setDid ] = useState<string>()

  let client = new Client({chainConfig: defaultChainConfig, connector:  new InjectedConnector()});



  const connect = async () => {
    if (!isMounted) throw new Error('No Window mounted')
    const data = await client.connect(1)
    const account = await client.getAccount()
    console.log(data, "ETH data")
    setAccount(account)
  }

  const getDid = async () => {
    if (!account) throw new Error("No Account Found")
    const name = await client.resolveDid('0x905040585A59C5B0E83Be2b247fC15a81FF4E533')
    setDid(name)
    return name
  }

  const signMessage = async () =>{
    await client.signMessage("hello")
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={connect}>Connect Wallet</button>
      <span>{account}</span>
      <button onClick={getDid}>GetDID</button>
      <span>{did}</span>
      <button onClick={signMessage}>Sign Message</button>
        
    </div>
  )
}

export default Home
