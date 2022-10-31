import { Connection, PublicKey } from '@solana/web3.js';
import { performReverseLookup, getAllDomains } from '@bonfida/spl-name-service';

import { BaseConnector, ConnectedData } from '../types';
import { PhantomProvider } from '../providers/phantomProvider';
import emitter from '../utils/emiter';

declare const window: {
  phantom: PhantomProvider;
};

export class PhantomConnector extends BaseConnector<PhantomProvider> {
  provider!: PhantomProvider;
  chain: string;

  constructor(chain: string = '') {
    super(chain);
    this.chain = chain;
    this.getProvider();
  }

  async getProvider(): Promise<PhantomProvider> {
    if (typeof window !== 'undefined' && window.phantom)
      this.provider = window.phantom;

    return this.provider;
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) throw new Error('Provider Undefined');
    try {
      await this.provider.connect();
      const accounts = this.provider.publicKey;
      return [String(accounts)];
    } catch (error) {
      console.error(error);
      throw new Error('Error in getting accounts');
    }
  }

  async getChainId(): Promise<string> {
    throw new Error('This method is not supported in Solana Wallets');
  }

  async switchChain(_chainId: string): Promise<void> {
    throw new Error('This method is not supported in Solana Wallets');
  }

  async connect(_chainId: string): Promise<void> {
    try {
      const provider = await this.getProvider();
      if (!provider) throw new Error('Phantom is not installed');

      if (provider.on) {
        provider.on('accountChanged', this.onAccountsChanged);
        provider.on('disconnect', this.onDisconnect);
      }

      const data: ConnectedData<PhantomProvider> = {
        account: (await this.getAccount())[0],
        chainId: this.chain,
        provider: this.provider,
      };

      emitter.emit('connected', data);
    } catch (error) {
      console.error(error);
      throw new Error('Error in Connecting');
    }
  }

  async disconnect(): Promise<void> {
    if (!this.provider) throw new Error('No wallet Conencted');
    this.provider.disconnect();
    emitter.emit('disconnected');
  }

  async resolveDid(address: string): Promise<string | null> {
    if (!this.provider) throw new Error('No wallet Connected');
    const connection = new Connection(
      'https://solana-api.syndica.io/access-token/590ibuUowWyZiI1R3d6f8ubDBXGMtGul6vjXAsZDLnGPMDdB4GojJuw7y23KDkP0/rpc'
    );

    try {
      const ownerWallet = new PublicKey(address);
      const allDomainKeys = await getAllDomains(connection, ownerWallet);
      const allDomainNames = await Promise.all(
        allDomainKeys.map(key => {
          return performReverseLookup(connection, key);
        })
      );
      if (!allDomainNames[0]) return null;
      return allDomainNames[0];
    } catch (error) {
      console.error(error);
      throw new Error('Error in fetching names');
    }
  }

  async signMessage(message: string): Promise<void> {
    if (!this.provider) throw new Error('No wallet Connected');
    try {
      const _message = new TextEncoder().encode(message);
      if (this.provider.signMessage && this.provider.publicKey) {
        await this.provider.signMessage(_message);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  protected onAccountsChanged(): void {
    console.log('Account Changed');
  }

  protected onChainChanged(_chain: string | number): void {
    console.log('Chain Changed');
  }

  protected onDisconnect(): void {
    console.log('Wallet disconnected');
  }
}
