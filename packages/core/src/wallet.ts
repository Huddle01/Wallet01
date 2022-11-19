import { ClientConfig } from './types';
import { BaseConnector } from './types/baseConnector';
import { TProvider } from './types/TProvider';

/**
 * @class A central wallet object to maintain a connection and its states
 * @params ChainId and Connector Class (ex: new InjectedConnector())
 */
export class Wallet<P extends TProvider> {
  /**
   * @prop stores the wallet provider that the wallet uses.
   */
  provider!: P | null;

  /**
   * @prop Stores the account address that app is connected to.
   */
  account!: string;

  /**
   * @props Stores the DID (ex: theVatsal.eth) that we are connected to.
   * @value A string or null
   */
  did!: string | null;

  /**
   * @prop Stores an instance of the active connector for interaction between the wallet and app.
   */
  readonly connector: BaseConnector<P>;

  /**
   * @prop Stores the chainId of the connected chain.
   */
  chainId: string;

  /**
   * @constructor
   */
  constructor({ chainId, connector }: ClientConfig<P>) {
    this.connector = connector;
    this.chainId = chainId;
  }

  /**
   * @method getProvider()
   * @description Gets the available provider, invoked by the connector
   * @returns Provider object
   */
  async getProvider() {
    const provider = await this.connector.getProvider();
    this.provider = provider;
    return provider;
  }

  /**
   * @method getAccount()
   * @description Gets the connected account from the connector
   * @returns The connected account
   */
  async getAccount() {
    const accounts = await this.connector.getAccount();
    this.account = accounts[0];
    return this.account;
  }

  /**
   * @method connect()
   * @description Connects the app to the wallet, invoked by the connector
   */
  async connect() {
    await this.connector.connect({ chainId: this.chainId });
  }

  /**
   * @method disconnect()
   * @description Disconnects the wallet
   */
  async disconnect() {
    this.account = '';
    this.did = '';
    this.provider = null;
  }

  /**
   * @method getDid()
   * @description Gets DID (ex: ENS, .sol) related to the connected address
   * @returns String or null
   */
  async getDid() {
    const did = await this.connector.resolveDid(await this.getAccount());
    this.did = did;
    return did;
  }

  /**
   * @method signMessage()
   * @param message
   * @description Prompts sign message dialog from the wallet.
   */
  async signMessage(message: string) {
    await this.connector.signMessage(message);
  }

  /**
   * @method switchChain()
   * @param chainId String indicating the chainId app wants to switch to
   * @description Switches chain in the supported wallets
   */
  async switchChain(chainId: string) {
    if (!this.connector.switchChain)
      throw new Error('Switch chain Unsupported');
    await this.connector.switchChain(chainId);
  }
}
