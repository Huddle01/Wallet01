import { AddChainParameter } from "./methodTypes";
import { Wallet01Store } from "../client/store";
import { TEcosystem } from "../store/storeTypes";
import { EnhancedEventEmitter, Events } from "../utils/EnhancedEventEmitter";
import {
  ChainSwitchResponse,
  ConnectionResponse,
  DisconnectionResponse,
  MessageSignedResponse,
} from "./methodTypes";
import { ConnectorEvents } from "./events";

export abstract class BaseConnector<
  TProvider extends {} = {},
  TWalletName extends string = string,
  TEvents extends Events = ConnectorEvents,
> extends EnhancedEventEmitter<ConnectorEvents> {
  abstract provider: TProvider;
  readonly name: TWalletName;
  readonly ecosystem: TEcosystem;
  readonly store: Wallet01Store = Wallet01Store.init();

  constructor(name: TWalletName, ecosystem: TEcosystem) {
    super();
    this.name = name;
    this.ecosystem = ecosystem;
  }

  abstract init(): BaseConnector<TProvider, TWalletName, TEvents>;

  abstract connect({
    chainId,
  }?: {
    chainId?: string | undefined;
  }): Promise<ConnectionResponse>;

  abstract disconnect(): Promise<DisconnectionResponse>;

  abstract getAccount(): Promise<string[]>;

  getChainId?(): Promise<string>;

  abstract getProvider(): Promise<TProvider>;

  abstract signMessage(message: string): Promise<MessageSignedResponse>;

  switchChain?(chainId: string): Promise<ChainSwitchResponse>;
  switchChain?(options: AddChainParameter): Promise<ChainSwitchResponse>;
}
