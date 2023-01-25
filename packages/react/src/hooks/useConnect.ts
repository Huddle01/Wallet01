import { BaseConnector, useStore } from "@wallet01/core";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type ConnectArgs = {
  connector: BaseConnector | undefined;
  chainId?: string;
};

type UseConenctConfig = {
  onError?: UseMutationOptions<void, Error, unknown>["onError"];
  onSuccess?: UseMutationOptions<string, Error, unknown>["onSuccess"];
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
    setActiveChain,
  } = useStore();

  const { mutate, mutateAsync, isLoading, isError, error } = useMutation<
    string,
    Error,
    ConnectArgs,
    unknown
  >({
    mutationFn: async ({ connector, chainId }: ConnectArgs) => {
      if (connectors.length === 0) throw new Error("Client not initialised");

      if (!connector) throw new Error("Connector required to connect");
      setActiveConnector(connector);

      if (!connectors.includes(connector))
        throw new Error("Connector not found");

      if (chainId) {
        await connector.connect({ chainId: chainId });
      } else {
        await connector.connect({});
      }

      const account = (await connector.getAccount())[0];

      if (!account) throw new Error("No account found");

      setAddress(account);

      setActiveChain(connector.activeChain);
      setIsConnected(true);

      setDid(await connector.resolveDid(account));
      if (connector.getChainId) {
        setChainId(await connector.getChainId());
      }

      return account;
    },
    onError,
    onSuccess,
  });

  return {
    connect: mutate,
    connectAsync: mutateAsync,
    isLoading,
    isError,
    error,
  };
};
