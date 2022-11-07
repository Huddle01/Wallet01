import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useIsMounted } from 'usehooks-ts';
import { useConnect } from "@huddle01-wallets/react"

const Home: NextPage = () => {

  const { connect, isActive, name, address, isLoading, isError, disconnect } = useConnect()
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className='text-4xl font-bold w-fit'>Metamask</h1>
      <button className='p-3 bg-blue-500 text-white text-xl font-semibold rounded-lg' onClick={() => connect({ connector: "injected", _chainId: "8001" })}>
        {
          isActive && !isLoading ? address : "Connect Wallet"
        }
      </button>
      <span>
        {
          isLoading ? "...Loading" : name
        }
      </span>
      <span>
        {
          isActive ? address : "Not Active"
        }
      </span>

    </div>
  );
};

export default Home;
