import { useAtom } from 'jotai';

import {
  connectedAtom,
  addressAtom,
  didAtom,
  chainAtom,
  connectorAtom,
} from '../store/clientStore';
import { clientAtom } from '../store/clientStore';

export const useWallet = () => {
  const [isConnected] = useAtom(connectedAtom);
  const [address] = useAtom(addressAtom);
  const [name] = useAtom(didAtom);
  const [chain] = useAtom(chainAtom);
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
