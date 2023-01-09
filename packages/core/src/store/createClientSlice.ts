import { StateCreator } from "zustand";
import { IClientState } from "./storeTypes";

const createClientSlice: StateCreator<
  IClientState,
  [],
  [],
  IClientState
> = set => ({
  connectors: [],
  activeConnector: null,
  lastUsedConnector: null,
  isAutoConnecting: false,

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
