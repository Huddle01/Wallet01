import { TEcosystem } from "../store/storeTypes";
import { BaseConnector } from "./BaseConnector";
import { SignatureHash } from "./methodTypes";

export type ConnectorEvents = {
  connecting: [walletName: string, ecosystem: TEcosystem];
  connected: [
    address: string,
    chainId: string,
    walletName: string,
    ecosystem: TEcosystem,
    activeConnector: BaseConnector,
  ];
  disconnected: [walletName: string, ecosystem: TEcosystem];
  chainChanged: [chainId: string, activeConnector: BaseConnector];
  accountsChanged: [address: string[], activeConnector: BaseConnector];
  messageSigned: [signature: SignatureHash, activeConnector: BaseConnector];
  error: [error: Error];
  switchingChain: [
    fromChainId: string | "default",
    toChainId: string | "default",
    activeConnector: BaseConnector,
  ];
};

export type ClientEvents = {
  isAutoConnecting: [ecosystem: TEcosystem, lastUsedConnector: BaseConnector];
};
