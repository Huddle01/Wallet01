import { useAtom } from 'jotai';

import {
  connectedAtom,
  accountAtom,
  didAtom,
  chainIdAtom,
  connectorAtom,
} from '../store/atoms';
import { clientAtom } from '../store/client';

export const useWallet = () => {
  const [isConnected] = useAtom(connectedAtom);
  const [address] = useAtom(accountAtom);
  const [name] = useAtom(didAtom);
  const [chain] = useAtom(chainIdAtom);
  const [activeConnector] = useAtom(connectorAtom);
  const [client] = useAtom(clientAtom);
  if (!client) throw new Error('Client not initialised');

  return {
    isConnected,
    address,
    name,
    chain,
    activeConnector,
  };
};
