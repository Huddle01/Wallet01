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
  setAddress: address => {
    set(() => ({ address }));
  },
  setAddresses: addresses => {
    set(() => ({ addresses }));
  },
});

export default createAccountSlice;
