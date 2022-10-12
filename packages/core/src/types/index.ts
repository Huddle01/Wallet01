import { Web3Provider } from "@ethersproject/providers";
import { CustomChainConfig } from "./ChainConfig";
import { BaseConnector } from "./ConnectorTypes";

type ClientConfig = {
    chainConfig: CustomChainConfig;
    connector: BaseConnector;
}

type ConnectedData = {
    account: string;
    chainId: string;
    provider: Web3Provider
}

export  {
    type CustomChainConfig,
    type ClientConfig,
    type ConnectedData,
    BaseConnector
}