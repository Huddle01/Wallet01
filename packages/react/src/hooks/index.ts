import { useConnect } from './useConnect';
import { useMessage } from './useMessage';
import { useSwitch } from './useSwitch';
import { useClient } from './useClient';
import { useWallet } from './useWallet';
import { useSetAtom } from 'jotai';
import { initClientAtom } from '../store/clientStore';

export { useConnect, useMessage, useSwitch, useClient, useWallet };

export const useInitClient = () => useSetAtom(initClientAtom);
