import { BaseConnector } from "../types";

export type TEcosystem = "ethereum" | "solana" | "cosmos" | "tezos";

export interface IAccountState {
  address: string | null;
  addresses: string[];
  setAddress: (address: string | null) => void;
  setAddresses: (addresses: string[]) => void;
}

export interface IWalletState {
  isConnected: boolean;
  chainId: "mainnet" | string | null;
  setIsConnected: (val: boolean) => void;
  setChainId: (id: "mainnet" | string | null) => void;
}

export interface IClientState {
  ecosystem: TEcosystem | null;
  connectors: BaseConnector[];
  activeConnector: BaseConnector | null;
  setEcosystem: (val: TEcosystem | null) => void;
  setConnectors: (connectors: BaseConnector[]) => void;
  setActiveConnector: (connector: BaseConnector | null) => void;
}

export type IState = IAccountState & IWalletState & IClientState;
