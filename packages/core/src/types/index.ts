import { BaseConnector } from './baseConnector';
import { TProvider } from './TProvider';

type ClientConfig<P extends TProvider> = {
  chainId: string;
  connector: BaseConnector<P>;
};

type ConnectedData<T extends TProvider> = {
  account: string;
  chainId: string;
  provider: T;
};

export {
  type ClientConfig,
  type ConnectedData,
  BaseConnector,
  type TProvider,
};
