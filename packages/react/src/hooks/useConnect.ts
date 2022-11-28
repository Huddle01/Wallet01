import { useAtom, useSetAtom } from 'jotai';
import { BaseConnector } from '@wallet01/core';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  addressAtom,
  chainAtom,
  connectedAtom,
  connectorAtom,
  didAtom,
} from '../store/clientStore';
import { clientAtom } from '../store/clientStore';

type ConnectArgs = {
  connector: BaseConnector | undefined;
  chainId?: string;
};

type UseConenctConfig = {
  onError: UseMutationOptions<void, Error, unknown>['onError'];
  onSuccess: UseMutationOptions<void, Error, unknown>['onSuccess'];
};

export const useConnect = ({
  onError,
  onSuccess,
}: Partial<UseConenctConfig>) => {
  const [client] = useAtom(clientAtom);
  const setConnector = useSetAtom(connectorAtom);
  // const isConnected = useAtomValue(connectedAtom);

  const isActive = useSetAtom(connectedAtom);
  const setAccount = useSetAtom(addressAtom);
  const setName = useSetAtom(didAtom);
  const setChainId = useSetAtom(chainAtom);

  const { mutate, isLoading, isError, error } = useMutation<
    void,
    Error,
    ConnectArgs,
    unknown
  >({
    mutationFn: async ({ connector, chainId }: ConnectArgs) => {
      if (client?.connectors.length === 0)
        throw new Error('Client not initialised');

      if (!connector) throw new Error('Connector required to connect');
      setConnector(connector);

      if (!client?.connectors.includes(connector))
        throw new Error('Connector not found');

      if (chainId) {
        await connector.connect({ chainId: chainId });
      } else {
        await connector.connect({});
      }

      isActive(true);

      const accounts = await connector.getAccount();
      setAccount(accounts[0]);

      setName(await connector.resolveDid(accounts[0]));

      if (connector.getChainId) {
        setChainId(await connector.getChainId());
      }
    },
    onError,
    onSuccess,
  });

  return {
    connect: mutate,
    isLoading,
    isError,
    error,
  };
};
