// DELETE

import { useMutation } from '@tanstack/react-query';
import { BaseConnector } from '@wallet01/core';
import { useAtom } from 'jotai';
import { account, connected } from 'src/store/atoms';
import { clientAtom } from 'src/store/client';

interface ConnectorArgs {
  connector: BaseConnector;
}

export const useAccount = ({ connector }: ConnectorArgs) => {
  const [address, setAddress] = useAtom(account);
  const [isConnected] = useAtom(connected);
  const [client] = useAtom(clientAtom);

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('Client not initialised');

      if (!isConnected) throw new Error('Wallet not connected');

      if (!client.connectors.includes(connector))
        throw new Error('Connector not found');

      setAddress((await connector.getAccount())[0]);
    },
  });

  mutate();

  return {
    address,
    getAccount: mutate,
  };
};
