import {
  PublicKey,
  SendOptions,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';
import EventEmitter from 'eventemitter3';

interface PhantomWalletEvents {
  connect(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
  accountChanged(newPublicKey: PublicKey): unknown;
}

export default interface SolflareProvider extends EventEmitter {
  isSolflare?: boolean;

  publicKey(): PublicKey | null;
  connected(): boolean;

  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signTransaction(message: Uint8Array): Promise<Uint8Array>;
  signAllTransactions(messages: Uint8Array[]): Promise<Uint8Array[]>;
  signMessage(data: Uint8Array, display: 'hex' | 'utf8'): Promise<Uint8Array>;
}
