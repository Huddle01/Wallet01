import { ethers } from 'ethers';
import { hexValue } from 'ethers/lib/utils';
import { Web3Provider, ExternalProvider } from '@ethersproject/providers';
import detectEthereumProvider from '@metamask/detect-provider';

import { BaseConnector, setLastUsedConnector } from '@wallet01/core';

export class FilecoinConnector extends BaseConnector<Web3Provider> {
  provider?: Web3Provider;
  chain: string;
  name: string;

  constructor(chain: string = '3141') {
    super(chain);
    this.chain = chain;
    this.name = 'Filecoin';
    this.getProvider();
  }

  async getProvider() {
    const provider = await detectEthereumProvider();

    if (provider) {
      const _provider = new ethers.providers.Web3Provider(
        <ExternalProvider>(<unknown>provider)
      );
      this.provider = _provider;
      return this.provider;
    } else {
      throw new Error('Please install a Browser Wallet');
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error('No Provider Found!');
      const result = await this.provider.send('eth_requestAccounts', []);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Error in getting Accounts');
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

    const id = hexValue(Number(chainId));
    try {
      await provider?.send('wallet_switchEthereumChain', [{ chainId: id }]);
    } catch (error) {
      console.error('error in switching chain', error);
      throw error;
    }
  }

  async connect({ chainId = '3141' }) {
    try {
      const provider = await this.getProvider();
      this.provider = provider;

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged);
        provider.on('chainChanged', this.onChainChanged);
        provider.on('disconnect', this.onDisconnect);
      }

      let id = await this.getChainId();

      if (chainId && id !== chainId) {
        await this.switchChain(chainId);
      }
      setLastUsedConnector(this.name);
    } catch (error) {
      console.error(error, 'in connect');
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.provider = undefined;
  }

  async resolveDid(address: string): Promise<string | null> {
    return null;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) throw new Error('Connect a wallet!');
    const signer = await this.provider.getSigner();
    const hash = await signer.signMessage(message);
    return hash;
  }

  protected onAccountsChanged(): void {
    console.log('Account Changed');
  }

  protected onChainChanged(_chain: string): void {
    console.log('Chain Changed');
  }

  protected onDisconnect(): void {
    console.log('Wallet disconnected');
  }
}
