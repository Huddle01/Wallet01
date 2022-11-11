import { useAtom } from 'jotai';
import { BaseConnector } from '@wallet01/core';
import { useMutation } from '@tanstack/react-query';

import { account, connected, connectorAtom } from '../store/atoms';
import { clientAtom } from '../store/client';

type ConnectArgs = {
  connector: BaseConnector;
  chainId?: string;
};

/**
 * @description This hooks will return essential states and two function for connecting and disconnecting the desired wallet.
 * @params Accepts an object with properties connector and chainId
 * @returns isActive, isLoading, isError, error, address, name (ex: theVatsal.eth), activeChain, connect() and disconnect()
 *
 * For more details visit {@link}
 */
export const useConnect = ({ connector, chainId }: ConnectArgs) => {
  const [client] = useAtom(clientAtom);
  const [, setAccount] = useAtom(account);
  const [, isActive] = useAtom(connected);
  const [, setConnector] = useAtom(connectorAtom);

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('Client not initialised');

      if (!client.connectors.includes(connector))
        throw new Error('Connector not found');

      await connector.connect({ chainId: chainId });
      const accounts = await connector.getAccount();
      setAccount(accounts[0]);
      setConnector(connector);
      isActive(true);
    },
  });

  return {
    connect: mutate,
    isLoading,
    isError,
    error,
  };
};
