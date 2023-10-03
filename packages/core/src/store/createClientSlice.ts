import { StateCreator } from "zustand";
import { IClientState } from "./storeTypes";

const createClientSlice: StateCreator<
  IClientState,
  [],
  [],
  IClientState
> = set => ({
  ecosystem: null,
  connectors: [],
  activeConnector: null,
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
