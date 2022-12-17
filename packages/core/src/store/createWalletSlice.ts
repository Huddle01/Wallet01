import { StateCreator } from 'zustand';
import { IWalletState } from './storeTypes';

const createWalletSlice: StateCreator<
  IWalletState,
  [],
  [],
  IWalletState
> = set => ({
  isConnected: false,
  chainId: null,
  setIsConnected: isConnected => {
    set(() => ({ isConnected }));
  },
  setChainId: chainId => {
    set(() => ({ chainId }));
  },
});

export default createWalletSlice;
