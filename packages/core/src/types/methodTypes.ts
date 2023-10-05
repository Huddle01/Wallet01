import { TEcosystem } from "../store/storeTypes";
import { BaseConnector } from "./BaseConnector";

export type SignatureHash = string | Uint8Array;

export type ClientConfig = {
  autoConnect?: boolean;
  connectors: BaseConnector[];
};

export interface AddChainParameter {
  chainId: string;
  blockExplorerUrls?: string[];
  chainName?: string;
  iconUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
}

export type ConnectionResponse = {
  address: string;
  chainId: string;
  walletName: string;
  ecosystem: TEcosystem;
  activeConnector: BaseConnector;
};

export type DisconnectionResponse = {
  walletName: string;
  ecosystem: TEcosystem;
};

export type MessageSignedResponse = {
  signature: SignatureHash;
  activeConnector: BaseConnector;
};

export type ChainSwitchResponse = {
  fromChainId: string | "default";
  toChainId: string | "default";
  activeConnector: BaseConnector;
};
