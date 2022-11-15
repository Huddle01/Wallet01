import { Client, createClient } from './client';

import {
  type ClientConfig,
  type ConnectedData,
  BaseConnector,
  TProvider,
} from './types';

import setLastUsedConnector from './utils/util';

export {
  Client,
  createClient,
  type ClientConfig,
  type ConnectedData,
  type TProvider,
  BaseConnector,
  setLastUsedConnector,
};
