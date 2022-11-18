import { useWallet } from '@wallet01/react';
import Head from 'next/head';
import Image from 'next/image';
import ConnectButtons from '../components/ConnectButtons';
import ConnectedModal from '../components/ConnectedModal';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { isConnected } = useWallet();

  return (
    <div className="flex justify-center items-center">
      {isConnected ? <ConnectedModal /> : <ConnectButtons />}
    </div>
  );
}
