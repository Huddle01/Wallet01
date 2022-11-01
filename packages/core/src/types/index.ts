import { CustomChainConfig } from './chainConfig';
import { BaseConnector } from './baseConnector';
import { TProvider } from './TProvider';

type ClientConfig<P extends TProvider> = {
  chainConfig: CustomChainConfig;
  connector: BaseConnector<P>;
};

type ConnectedData<T extends TProvider> = {
  account: string;
  chainId: string;
  provider: T;
};

export {
  type CustomChainConfig,
  type ClientConfig,
  type ConnectedData,
  BaseConnector,
  TProvider
};
