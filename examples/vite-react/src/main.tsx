import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Wallet01, Client } from '@wallet01/react';
import { InjectedConnector, CoinbaseConnector } from '@wallet01/evm';
import { PhantomConnector, SolflareConnector } from '@wallet01/solana';
import { KeplrConnector } from '@wallet01/cosmos';

const client = new Client({
  autoConnect: false,
  connectors: [
    new InjectedConnector(),
    new CoinbaseConnector(),
    new PhantomConnector(),
    new SolflareConnector(),
    new KeplrConnector(),
  ],
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Wallet01 client={client}>
      <App />
    </Wallet01>
  </React.StrictMode>
);
