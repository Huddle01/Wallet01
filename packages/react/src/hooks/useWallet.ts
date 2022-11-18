import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';

import {
  connectedAtom,
  addressAtom,
  didAtom,
  chainAtom,
  connectorAtom,
  clientAtom,
} from '../store/clientStore';

export const useWallet = () => {
  const [client] = useAtom(clientAtom);
  const [isConnected, setIsConnected] = useAtom(connectedAtom);
  const [address, setAddress] = useAtom(addressAtom);
  const [name, setName] = useAtom(didAtom);
  const [chain, setChain] = useAtom(chainAtom);
  const [activeConnector, setActiveConnector] = useAtom(connectorAtom);

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('Client not Initialised');

      if (!activeConnector) throw new Error('Wallet not connected');

      if (!client.connectors.includes(activeConnector)) {
        throw new Error('Connector not found');
      }

      await activeConnector.disconnect();
      setActiveConnector(null);
      setAddress(null);
      setChain(null);
      setName(null);
      setIsConnected(false);
      localStorage.setItem('lastUsedConnector', '');
    },
  });

  return {
    isConnected,
    address,
    name,
    chain,
    activeConnector,
    disconnect: mutate,
  };
};
