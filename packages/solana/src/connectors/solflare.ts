import { Connection, PublicKey } from '@solana/web3.js';
import { performReverseLookup, getAllDomains } from '@bonfida/spl-name-service';
import { BaseConnector, setLastUsedConnector } from '@wallet01/core';

import { SolflareProvider } from '../providers/solflareProvider';
import emitter from '../utils/emiter';

declare const window: {
  solflare: SolflareProvider;
};

export class SolflareConnector extends BaseConnector<SolflareProvider> {
  provider!: SolflareProvider;
  chain: string;
  name: string;

  constructor(chain: string = '') {
    super(chain);
    this.chain = chain;
    this.name = 'Solflare';
  }

  async getProvider(): Promise<SolflareProvider> {
    if (
      typeof window !== 'undefined' &&
      window.solflare &&
      window.solflare.isSolflare
    ) {
      this.provider = window.solflare;
      return this.provider;
    } else {
      throw new Error('Wallet Not Installed');
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) throw new Error('Provider Undefined');
    try {
      await this.provider.connect();
      const accounts = this.provider.publicKey;
      return [String(accounts)];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async connect({}): Promise<void> {
    try {
      const provider = await this.getProvider();
      if (!provider) throw new Error('Solflare is not installed');

      if (provider.on) {
        provider.on('accountChanged', this.onAccountsChanged);
        provider.on('disconnect', this.onDisconnect);
      }

      await this.provider.connect();
      setLastUsedConnector(this.name);
    } catch (error) {
      console.error(error);
      throw error;
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
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    console.log({ message });
    if (!this.provider) throw new Error('No wallet Connected');
    try {
      const _message = new TextEncoder().encode(message);
      console.log({ _message });
      const hash = await this.provider.signMessage(_message, 'utf8');
      console.log(hash, 'Hash');
      return new TextDecoder('utf-8').decode(hash);
    } catch (err) {
      console.error(err);
      throw err;
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
