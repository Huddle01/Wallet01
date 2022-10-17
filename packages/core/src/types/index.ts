import { CustomChainConfig } from "./chainConfig";
import { BaseConnector } from "./baseConnector";

type ClientConfig<TProvider> = {
    chainConfig: CustomChainConfig;
    connector: BaseConnector<TProvider>;
}

type ConnectedData<TProvider> = {
    account: string;
    chainId: string;
    provider: TProvider;
}




export {
    type CustomChainConfig,
    type ClientConfig,
    type ConnectedData,
    BaseConnector,
}