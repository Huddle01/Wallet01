import { BaseConnector } from "@wallet01/core";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useCallback, useContext } from "react";
import { ClientProvider } from "../context";
import { ClientNotFoundError, ConnectorNotFoundError } from "../utils/errors";
import { ConnectionResponse } from "@wallet01/core/dist/types/methodTypes";
import { TEcosystem } from "@wallet01/core/dist/store/storeTypes";

type ConnectArgs = {
  connector: BaseConnector;
  chainId?: string;
};

type UseConenctConfig = {
  onError?: UseMutationOptions<void, Error, ConnectArgs>["onError"];
  onConnect?: (
    address: string,
    chainId: string,
    walletName: string,
    ecosystem: TEcosystem,
    activeConnector: BaseConnector
  ) => Promise<void> | void;
};

export const useConnect = (params?: UseConenctConfig) => {
  const client = useContext(ClientProvider);

  const { mutate, mutateAsync, isLoading, isError, error } = useMutation<
    ConnectionResponse,
    Error,
    ConnectArgs,
    unknown
  >({
    mutationFn: async ({ connector, chainId }: ConnectArgs) => {
      if (!client) throw new ClientNotFoundError();

      const connectors = client.store.getConnectors();

      if (!connectors.includes(connector))
        throw new ConnectorNotFoundError({ connectorName: connector.name });

      let connectionResult: ConnectionResponse;

      if (params?.onConnect) client.emitter.on("connected", params.onConnect);
      if (chainId) {
        connectionResult = await connector.connect({ chainId: chainId });
      } else {
        connectionResult = await connector.connect();
      }

      return connectionResult;
    },
    onError: params?.onError,
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
