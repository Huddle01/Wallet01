import { StateCreator } from 'zustand';
import { IClientState } from './storeTypes';

const createClientSlice: StateCreator<
  IClientState,
  [],
  [],
  IClientState
> = set => ({
  autoConnect: false,
  connectors: [],
  activeConnector: null,
  lastUsedConnector: null,
  setAutoConnect: autoConnect => {
    set(() => ({ autoConnect }));
  },
  setConnectors: connectors => {
    set(() => ({ connectors }));
  },
  setActiveConnector: activeConnector => {
    set(() => ({ activeConnector }));
  },
  setLastUsedConnector: lastUsedConnector => {
    set(() => ({ lastUsedConnector }));
  },
});

export default createClientSlice;
