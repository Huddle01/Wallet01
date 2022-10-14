import { Web3Provider } from "@ethersproject/providers";
import { CustomChainConfig } from "./ChainConfig";
import { BaseConnector } from "./BaseConnector";

type ClientConfig<TProvider> = {
    chainConfig: CustomChainConfig;
    connector: BaseConnector<TProvider>;
}

type ConnectedData<TProvider> = {
    account: string;
    chainId: string;
    provider: TProvider;
}

export  {
    type CustomChainConfig,
    type ClientConfig,
    type ConnectedData,
    BaseConnector
}