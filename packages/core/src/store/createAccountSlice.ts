import { StateCreator } from "zustand";
import { IAccountState } from "./storeTypes";

const createAccountSlice: StateCreator<
  IAccountState,
  [],
  [],
  IAccountState
> = set => ({
  address: null,
  addresses: [],
  did: null,
  setAddress: address => {
    set(() => ({ address }));
  },
  setAddresses: addresses => {
    set(() => ({ addresses }));
  },
  setDid: did => {
    set(() => ({ did }));
  },
});

export default createAccountSlice;
