// import { Client, createClient } from './client';
import Client from './client/client';
import { useStore } from './store/rootStore';

import {
  type ClientConfig,
  type ConnectedData,
  BaseConnector,
  TProvider,
} from './types';

import setLastUsedConnector from './utils/util';

export {
  Client,
  type ClientConfig,
  type ConnectedData,
  type TProvider,
  BaseConnector,
  setLastUsedConnector,
  useStore,
};
