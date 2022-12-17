import { BaseConnector } from '../types';

export interface IAccountState {
  address: string | null;
  did: string | null;
  setAddress: (address: string | null) => void;
  setDid: (did: string | null) => void;
}

export interface IWalletState {
  isConnected: boolean;
  chainId: string | null;
  setIsConnected: (val: boolean) => void;
  setChainId: (id: string | null) => void;
}

export interface IClientState {
  autoConnect: boolean;
  connectors: BaseConnector[];
  activeConnector: BaseConnector | null;
  lastUsedConnector: BaseConnector | null;
  setAutoConnect: (val: boolean) => void;
  setConnectors: (connectors: BaseConnector[]) => void;
  setActiveConnector: (connector: BaseConnector | null) => void;
  setLastUsedConnector: (connector: BaseConnector | null) => void;
}

export type IState = IAccountState & IWalletState & IClientState;
