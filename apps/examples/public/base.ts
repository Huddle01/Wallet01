import { default as EventEmitter } from "eventemitter3";
import { Web3Provider } from '@ethersproject/providers';


export type ConnectorData<Provider = any> = {
  account?: string;
  chain?: { id: number; };
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


  abstract connect(chainId: number): Promise<ConnectorData<any> | undefined>;
  abstract disconnect(): Promise<void>;
  abstract getAccount(): Promise<string[]>;
  abstract getChainId(): Promise<string>;
  abstract getProvider(): Promise<Web3Provider>;
  abstract getSigner(config?: { chainId?: number }): Promise<Signer>;
  abstract resolveDid(address: string): Promise<string | null>;
  abstract signMessage(message: string): Promise<void>;
  switchChain?(chainId: number): Promise<void>;


  protected abstract onAccountsChanged(accounts: string[]): void;
  protected abstract onChainChanged(chain: number | string): void;
  protected abstract onDisconnect(error: Error): void;
}