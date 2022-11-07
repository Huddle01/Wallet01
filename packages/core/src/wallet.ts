import { ClientConfig, CustomChainConfig } from './types';
import { BaseConnector } from './types/baseConnector';
import { TProvider } from './types/TProvider';
import emitter from './utils/emiter';
export class Wallet<P extends TProvider> {
  readonly chainConfig: CustomChainConfig;
  provider!: P | null;
  account!: string;
  did!: string | null;
  readonly connector: BaseConnector<P>;
  chainId: string;

  constructor({ chainConfig, connector }: ClientConfig<P>) {
    this.chainConfig = chainConfig;
    this.connector = connector;
    this.chainId = chainConfig.chainId;

    if (emitter) {
      emitter.on('disconnected', () => {
        this.provider = null;
        this.account = '';
        this.did = null;
      });
    }
  }

  async getProvider() {
    const provider = await this.connector.getProvider();
    this.provider = provider;
    return provider;
  }

  async getAccount() {
    const accounts = await this.connector.getAccount();
    this.account = accounts[0];
    return this.account;
  }

  async connect() {
    await this.connector.connect(this.chainId);
  }

  async disconnect() {
    this.account = '';
    this.did = '';
    this.provider = null;
  }

  async getDid() {
    const did = await this.connector.resolveDid(await this.getAccount());
    this.did = did;
    return did;
  }

  async signMessage(message: string) {
    await this.connector.signMessage(message);
  }

  async switchChain(chainId: string) {
    if (!this.connector.switchChain)
      throw new Error('Switch chain Unsupported');
    await this.connector.switchChain(chainId);
  }
}
