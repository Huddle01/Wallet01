import {
  SendOptions,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';
import EventEmitter from 'eventemitter3';

export interface PhantomProvider extends EventEmitter {
  isPhantom?: boolean;
  publicKey?: { toBytes(): Uint8Array };
  isConnected: boolean;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
  signAndSendTransaction(
    transaction: Transaction,
    options?: SendOptions
  ): Promise<{ signature: TransactionSignature }>;
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
