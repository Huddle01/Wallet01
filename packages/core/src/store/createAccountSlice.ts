import { StateCreator } from 'zustand';
import { IAccountState } from './storeTypes';

const createAccountSlice: StateCreator<
  IAccountState,
  [],
  [],
  IAccountState
> = set => ({
  address: null,
  did: null,
  setAddress: address => {
    set(() => ({ address }));
  },
  setDid: did => {
    set(() => ({ did }));
  },
});

export default createAccountSlice;
