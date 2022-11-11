import { BaseConnector } from './baseConnector';
import { TProvider } from './TProvider';

type ClientConfig<TProvider> = {
  chainId: string;
  connector: BaseConnector<TProvider>;
};

type ConnectedData<TProvider> = {
  account: string;
  chainId: string;
  provider: TProvider;
};

export { type ClientConfig, type ConnectedData, BaseConnector, type TProvider };
