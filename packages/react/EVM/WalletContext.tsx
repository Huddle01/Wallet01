import React, { createContext } from 'react';
import { Wallet } from '@huddle01/wallets';

function WalletContext<TProvider>() {
  createContext(Wallet<TProvider>);
}

export default WalletContext;
