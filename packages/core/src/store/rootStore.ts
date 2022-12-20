import create from 'zustand';
import createAccountSlice from './createAccountSlice';
import createClientSlice from './createClientSlice';
import createWalletSlice from './createWalletSlice';
import { IState } from './storeTypes';

export const useStore = create<IState>()((...a) => ({
  ...createAccountSlice(...a),
  ...createWalletSlice(...a),
  ...createClientSlice(...a),
}));

const { getState } = useStore;

export default getState;
