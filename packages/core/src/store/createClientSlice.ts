import { StateCreator } from "zustand";
import { IClientState } from "./storeTypes";

const createClientSlice: StateCreator<
  IClientState,
  [],
  [],
  IClientState
> = set => ({
  isAutoConnecting: false,
  ecosystem: null,
  connectors: [],
  activeConnector: null,
  setAutoConnecting: val => {
    set(() => ({ isAutoConnecting: val }));
  },
  setEcosystem: ecosystem => {
    set(() => ({ ecosystem }));
  },
  setConnectors: connectors => {
    set(() => ({ connectors }));
  },
  setActiveConnector: activeConnector => {
    set(() => ({ activeConnector }));
  },
});

export default createClientSlice;
