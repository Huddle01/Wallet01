// RM

import { useMutation } from '@tanstack/react-query';
import { BaseConnector } from '@wallet01/core';
import { useAtom } from 'jotai';
import { connected, did } from 'src/store/atoms';
import { clientAtom } from 'src/store/client';

interface DIDArgs {
  connector: BaseConnector;
  address: string;
}

export const useDid = ({ connector, address }: DIDArgs) => {
  const [client] = useAtom(clientAtom);
  const [name, setName] = useAtom(did);
  const [isConnected] = useAtom(connected);
  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('Client not initialised');

      if (!isConnected) throw new Error('Wallet not connected');

      setName(await connector.resolveDid(address));
    },
  });

  mutate();
  return {
    name,
    getDid: mutate,
  };
};
