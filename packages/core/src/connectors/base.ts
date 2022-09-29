import { default as EventEmitter } from "eventemitter3";
import { defaultChains } from "../constants";
import { CustomChainConfig } from "../types";

export type ConnectorData<Provider = any> = {
  account?: string;
  chain?: { id: number; unsupported: boolean };
  provider?: Provider;
};

export interface ConnectorEvents<Provider = any> {
  change(data: ConnectorData<Provider>): void;
  connect(data: ConnectorData<Provider>): void;
  message({ type, data }: { type: string; data?: unknown }): void;
  disconnect(): void;
  error(error: Error): void;
}

export abstract class Connector<
  Provider = any,
  Signer = any
> extends EventEmitter<ConnectorEvents<Provider>> {

  abstract readonly id: string;
  abstract readonly name: string;
  readonly chains: CustomChainConfig[];
  abstract readonly ready: boolean;

  constructor({
    chains = defaultChains,
  }: {
    chains?: CustomChainConfig[];
  }) {
    super();
    this.chains = chains;
  }

  abstract connect(chainId: number): Promise<Required<ConnectorData> | undefined>;
  abstract disconnect(): Promise<void>;
  abstract getAccount(): Promise<string[]>;
  abstract getChainId(): Promise<string>;
  // abstract getProvider(): Promise<Provider>;
  abstract getSigner(config?: { chainId?: number }): Promise<Signer>;
  abstract isAuthorized(): Promise<boolean>;
  abstract resolveDid(): Promise<string>;
  abstract signTxn(message: string): Promise<void>;
  switchChain?(chainId: number): Promise<CustomChainConfig>;
  watchAsset?(asset: {
    address: string;
    image?: string;
    symbol: string;
  }): Promise<boolean>;


  protected abstract onAccountsChanged(accounts: string[]): void;
  protected abstract onChainChanged(chain: number | string): void;
  protected abstract onDisconnect(error: Error): void;

  // protected getBlockExplorerUrls(chain: Chain) {
  //   const { default: blockExplorer, ...blockExplorers } =
  //     chain.blockExplorers ?? {};
  //   if (blockExplorer)
  //     return [
  //       blockExplorer.url,
  //       ...Object.values(blockExplorers).map((x) => x.url),
  //     ];
  //   return [];
  // }

  protected isChainUnsupported(chainId: number) {
    return !this.chains.some((x) => x.chainId === chainId);
  }
}
