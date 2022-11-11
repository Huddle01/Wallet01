import { useAtom } from 'jotai';
import { account, connected } from '../store/atoms';
import { useMutation } from '@tanstack/react-query';
import { clientAtom } from '../store/client';
import { BaseConnector } from '@wallet01/core';

/**
 * @description This hooks will return essential states and two function for connecting and disconnecting the desired wallet.
 * @params Accepts an object with properties connector and chainId
 * @returns isActive, isLoading, isError, error, address, name (ex: theVatsal.eth), activeChain, connect() and disconnect()
 *
 * For more details visit {@link}
 */

type ConnectArgs = {
  connector: BaseConnector;
  chainId?: string;
};

export const useConnect = ({ connector, chainId }: ConnectArgs) => {
  const [client] = useAtom(clientAtom);
  const [, setAccount] = useAtom(account);
  const [, isActive] = useAtom(connected);

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('Client not initialised');

      if (!client.connectors.includes(connector))
        throw new Error('Connector not found');

      await connector.connect({ chainId: chainId });
      const accounts = await connector.getAccount();
      setAccount(accounts[0]);
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
