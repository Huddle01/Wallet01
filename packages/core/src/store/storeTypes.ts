import { BaseConnector } from "../types";

export type TEcosystem = "ethereum" | "solana" | "cosmos" | "tezos";

export interface IAccountState {
  address: string | null;
  addresses: string[];
  did: string | null;
  setAddress: (address: string | null) => void;
  setAddresses: (addresses: string[]) => void;
  setDid: (did: string | null) => void;
}

export interface IWalletState {
  isConnected: boolean;
  chainId: "default" | string;
  setIsConnected: (val: boolean) => void;
  setChainId: (id: "default" | string) => void;
}

export interface IClientState {
  ecosystem: TEcosystem | null;
  connectors: BaseConnector[];
  activeConnector: BaseConnector | null;
  setEcosystem: (val: TEcosystem) => void;
  setConnectors: (connectors: BaseConnector[]) => void;
  setActiveConnector: (connector: BaseConnector | null) => void;
}

export type IState = IAccountState & IWalletState & IClientState;
