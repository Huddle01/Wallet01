import { BaseConnector } from "@wallet01/core";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useCallback, useContext } from "react";
import { ClientProvider } from "../context";
import { ClientNotFoundError, ConnectorNotFoundError } from "../utils/errors";
import { ConnectionResponse } from "@wallet01/core/dist/types/methodTypes";

type ConnectArgs = {
  connector: BaseConnector;
  chainId?: string;
};

type UseConenctConfig = {
  onError?: UseMutationOptions<void, Error, unknown>["onError"];
  onConnect?: (params: ConnectionResponse) => Promise<void> | void;
};

export const useConnect = ({
  onError,
} // onConnect,
: Partial<UseConenctConfig> = {}) => {
  const client = useContext(ClientProvider);

  const { mutate, mutateAsync, isLoading, isError, error } = useMutation<
    ConnectionResponse,
    Error,
    ConnectArgs,
    unknown
  >({
    mutationFn: async ({ connector, chainId }: ConnectArgs) => {
      try {
        if (!client) throw new ClientNotFoundError();

        const connectors = client.store.getConnectors();

        if (!connectors.includes(connector))
          throw new ConnectorNotFoundError({ connectorName: connector.name });

        let connectionResult: ConnectionResponse;

        if (chainId) {
          connectionResult = await connector.connect({ chainId: chainId });
        } else {
          connectionResult = await connector.connect();
        }

        // if (onConnect)
        //   client.on(
        //     "connected",
        //     (address, chainId, walletName, ecosystem, activeConnector) =>
        //       onConnect({
        //         activeConnector,
        //         address,
        //         chainId,
        //         ecosystem,
        //         walletName,
        //       })
        //   );

        return connectionResult;
      } catch (error) {
        throw error;
      }
    },
    onError,
  });

  const connect = useCallback(
    (params?: ConnectArgs) => {
      return mutate(params as ConnectArgs);
    },
    [client]
  );

  const connectAsync = useCallback(
    (params?: ConnectArgs) => {
      return mutateAsync(params as ConnectArgs);
    },
    [client]
  );

  return {
    connect,
    connectAsync,
    isLoading,
    isError,
    error,
  };
};
