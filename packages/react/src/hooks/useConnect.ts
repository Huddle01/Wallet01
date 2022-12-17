import { BaseConnector, useStore } from '@wallet01/core';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

type ConnectArgs = {
  connector: BaseConnector | undefined;
  chainId?: string;
};

type UseConenctConfig = {
  onError?: UseMutationOptions<void, Error, unknown>['onError'];
  onSuccess?: UseMutationOptions<void, Error, unknown>['onSuccess'];
};

export const useConnect = ({
  onError,
  onSuccess,
}: Partial<UseConenctConfig> = {}) => {
  const {
    connectors,
    setActiveConnector,
    setIsConnected,
    setAddress,
    setDid,
    setChainId,
  } = useStore();

  const { mutate, isLoading, isError, error } = useMutation<
    void,
    Error,
    ConnectArgs,
    unknown
  >({
    mutationFn: async ({ connector, chainId }: ConnectArgs) => {
      if (connectors.length === 0) throw new Error('Client not initialised');

      if (!connector) throw new Error('Connector required to connect');
      setActiveConnector(connector);

      if (!connectors.includes(connector))
        throw new Error('Connector not found');

      if (chainId) {
        await connector.connect({ chainId: chainId });
      } else {
        await connector.connect({});
      }

      setIsConnected(true);

      const accounts = await connector.getAccount();
      setAddress(accounts[0]);

      setDid(await connector.resolveDid(accounts[0]));

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
