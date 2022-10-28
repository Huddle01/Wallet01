export abstract class BaseConnector<TProvider> {
  readonly chain: string;
  abstract provider?: TProvider;

  constructor(chain: string) {
    this.chain = chain;
  }

  abstract connect(chainId: string): Promise<void>;

  // DISCUSSION: We might wanna have the disconnect method only in the client as there is no specific function in wallets
  abstract disconnect(): Promise<void>;

  abstract getAccount(): Promise<string[]>;

  abstract getChainId(): Promise<string>;

  abstract getProvider(): Promise<TProvider>;

  abstract resolveDid(address: string): Promise<string | null>;

  abstract signMessage(message: string): Promise<void>;

  switchChain?(chainId: string): Promise<void>;

  protected abstract onAccountsChanged(): void;
  protected abstract onChainChanged(chain: number | string): void;
  protected abstract onDisconnect(): void;
}
