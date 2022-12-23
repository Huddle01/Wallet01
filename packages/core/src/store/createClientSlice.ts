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
  isAutoConnecting: false,
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
  setIsAutoConnecting: val => {
    set(() => ({ isAutoConnecting: val }));
  },
});

export default createClientSlice;
