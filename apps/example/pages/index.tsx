import Head from 'next/head';
import Image from 'next/image';
import ConnectButtons from '../components/ConnectButtons';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div>
      <ConnectButtons />
    </div>
  );
}
