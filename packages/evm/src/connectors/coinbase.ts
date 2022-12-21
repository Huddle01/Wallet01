import { Web3Provider } from '@ethersproject/providers';
import { ExternalProvider } from '@ethersproject/providers';
import { WalletLinkProvider, WalletLink } from 'walletlink';
import { hexValue } from 'ethers/lib/utils.js';
import { BaseConnector, setLastUsedConnector } from '@wallet01/core';

import emitter from '../utils/emiter';
import { ConnectedData } from '../types';

export class CoinbaseConnector extends BaseConnector<WalletLinkProvider> {
  provider?: WalletLinkProvider;
  chain: string;
  name: string;

  constructor(chain: string = '1') {
    super(chain);
    this.chain = chain;
    this.name = 'Coinbase';
  }

  async getProvider(): Promise<WalletLinkProvider> {
    try {
      const client = new WalletLink({
        appName: 'huddle01',
      });
      this.provider = client.makeWeb3Provider(
        'https://mainnet.infura.io/v3/0a7d1e04fd0845d5994516cfb80e0813',
        Number(this.chain)
      );
      return this.provider;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) await this.getProvider();
    try {
      const result = await this.provider?.send('eth_requestAccounts', []);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getChainId(): Promise<string> {
    if (this.provider) {
      const { result } = await this.provider?.send('eth_chainId', []);
      return result;
    }
    return '';
  }

  async switchChain(chainId: string): Promise<void> {
    const provider = await this.getProvider();

    const id = hexValue(chainId);
    try {
      await provider?.send('wallet_switchEthereumChain', [{ chainId: id }]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async connect({ chainId = '1' }) {
    try {
      const provider = await this.getProvider();
      this.provider = provider;

      provider.on('accountsChanged', this.onAccountsChanged);
      provider.on('chainChanged', this.onChainChanged);
      provider.on('disconnect', this.onDisconnect);

      const id = await this.getChainId();

      if (chainId && id !== chainId) {
        await this.switchChain(chainId);
      }

      setLastUsedConnector(this.name);

      const data: ConnectedData<WalletLinkProvider> = {
        account: (await this.getAccount())[0],
        chainId: this.chain,
        provider: this.provider,
      };

      emitter.emit('connected', data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    this.provider = undefined;
    emitter.emit('disconnected');
  }

  async resolveDid(address: string): Promise<string | null> {
    try {
      if (this.chain !== '1') return null;
      const provider = await this.getProvider();
      const _provider = new Web3Provider(<ExternalProvider>(<unknown>provider));

      const name = await _provider.lookupAddress(address);
      return name;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      if (!this.provider) throw new Error('Connect a Wallet');
      const _provider = new Web3Provider(
        <ExternalProvider>(<unknown>this.provider)
      );
      const signer = await _provider.getSigner();
      const hash = await signer.signMessage(message);
      return hash;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  onAccountsChanged(): void {
    console.log('Account Changed');
  }

  onChainChanged(_chain: string | number): void {
    console.log('Chain Changed');
  }

  onDisconnect(): void {
    console.log('Wallet disconnected');
  }
}
