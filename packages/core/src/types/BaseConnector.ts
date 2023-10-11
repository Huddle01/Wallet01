import { AddChainParameter } from "./methodTypes";
import { TEcosystem } from "../store/storeTypes";
import { EnhancedEventEmitter } from "../utils/EnhancedEventEmitter";
import {
  ChainSwitchResponse,
  ConnectionResponse,
  DisconnectionResponse,
  MessageSignedResponse,
} from "./methodTypes";
import { ClientEvents, ConnectorEvents } from "./events";

export abstract class BaseConnector<
  TProvider extends {} = {},
  TWalletName extends string = string,
> {
  abstract provider: TProvider;
  readonly name: TWalletName;
  readonly ecosystem: TEcosystem;
  readonly emitter: EnhancedEventEmitter<ConnectorEvents & ClientEvents> =
    EnhancedEventEmitter.init();

  constructor(name: TWalletName, ecosystem: TEcosystem) {
    this.name = name;
    this.ecosystem = ecosystem;
  }

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
