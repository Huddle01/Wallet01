import { BaseConnector, setLastUsedConnector } from '@wallet01/core';
import { CoinbaseWalletProvider } from '@coinbase/wallet-sdk';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { hexValue } from 'ethers/lib/utils.js';
import { chainData } from '../utils/chains';

export class CoinbaseConnector extends BaseConnector<CoinbaseWalletProvider> {
  provider?: CoinbaseWalletProvider;
  chain: string;
  name: string;

  constructor(chain: string = '1') {
    super(chain);
    this.chain = chain;
    this.name = 'Coinbase';
  }

  async getProvider(): Promise<CoinbaseWalletProvider> {
    try {
      const _provider = new CoinbaseWalletSDK({
        appName: 'Wallet01',
      }).makeWeb3Provider();
      this.provider = _provider;
      return this.provider;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error('Wallet Not Connected');
      const result: string[] = await this.provider.send(
        'eth_requestAccounts',
        []
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getChainId(): Promise<string> {
    if (this.provider) {
      const id = this.provider.chainId;
      return id;
    }
    return '';
  }

  async switchChain(chainId: string): Promise<void> {
    if (!this.provider) throw new Error('Wallet Not Connected');
    const id = hexValue(Number(chainId));

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: id }],
      });
    } catch (error) {
      console.error(error);
      if (chainData[chainId]) {
        this.provider.request({
          method: 'wallet_addEthereumChain',
          params: [{ data: chainData[chainId] }],
        });
        this.switchChain(chainId);
      }
      throw error;
    }
  }

  async connect({ chainId }: { chainId?: string | undefined }): Promise<void> {
    if (!this.provider) await this.getProvider();
    try {
      await this.provider?.enable();

      let currentId = await this.getChainId();
      if (chainId && currentId !== chainId) {
        await this.switchChain(chainId);
      }

      setLastUsedConnector(this.name);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.provider) throw new Error('Wallet already disconnected');
    await this.provider.disconnect();
    this.provider = undefined;
  }

  async resolveDid(address: string): Promise<string | null> {
    try {
      if (!this.provider) throw new Error('Wallet not connected');
      if (this.chain !== '1') return null;

      const _provider = new Web3Provider(
        this.provider as unknown as ExternalProvider
      );
      const name = _provider.lookupAddress(address);
      return name;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      if (!this.provider) throw new Error('Wallet not Connected!');
      const _address = await this.getAccount();

      const signer = new Web3Provider(
        this.provider as unknown as ExternalProvider
      ).getSigner(_address[0]);

      const hash = await signer.signMessage(message);
      return hash;
    } catch (error) {
      console.error(error);
      throw error;
    }
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
