import { AddChainParameter } from "./methodTypes";
import { Wallet01Store } from "../client/store";
import { TEcosystem } from "../store/storeTypes";
import { EnhancedEventEmitter } from "../utils/EnhancedEventEmitter";
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

  abstract init(): BaseConnector<TProvider, TWalletName>;

  abstract connect(options?: { chainId: string }): Promise<ConnectionResponse>;

  abstract disconnect(): Promise<DisconnectionResponse>;

  abstract getAccount(): Promise<string[]>;

  getChainId?(): Promise<string>;

  abstract getProvider(): Promise<TProvider>;

  abstract signMessage(message: string): Promise<MessageSignedResponse>;

  switchChain?(
    chainId: string,
    options?: AddChainParameter
  ): Promise<ChainSwitchResponse>;
}
