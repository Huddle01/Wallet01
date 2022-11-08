import { PublicKey } from '@solana/web3.js';
import EventEmitter from 'eventemitter3';

export interface SolflareProvider extends EventEmitter {
  isSolflare?: boolean;

  publicKey(): PublicKey | null;
  connected(): boolean;

  connect(): Promise<void>;
  disconnect(): Promise<void>;
  signTransaction(message: Uint8Array): Promise<Uint8Array>;
  signAllTransactions(messages: Uint8Array[]): Promise<Uint8Array[]>;
  signMessage(data: Uint8Array, display: 'hex' | 'utf8'): Promise<Uint8Array>;
}
