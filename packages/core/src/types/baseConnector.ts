import { TProvider } from './TProvider';

export abstract class BaseConnector<P extends TProvider> {
  readonly chain: string;
  abstract provider?: P;

  constructor(chain: string) {
    this.chain = chain;
  }

  abstract connect(chainId: string): Promise<void>;

  // DISCUSSION: We might wanna have the disconnect method only in the client as there is no specific function in wallets
  abstract disconnect(): Promise<void>;

  abstract getAccount(): Promise<string[]>;

  abstract getChainId(): Promise<string>;

  abstract getProvider(): Promise<P>;

  abstract resolveDid(address: string): Promise<string | null>;

  abstract signMessage(message: string): Promise<void>;

  switchChain?(chainId: string): Promise<void>;

  protected abstract onAccountsChanged(): void;
  protected abstract onChainChanged(chain: number | string): void;
  protected abstract onDisconnect(): void;
}
