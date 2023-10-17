import { BaseConnector } from "@wallet01/core";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useCallback, useContext, useEffect } from "react";
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
  onSuccessfulConnect?: UseMutationOptions<
    ConnectionResponse,
    Error,
    ConnectArgs
  >["onSuccess"];
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
      if (!client) throw new ClientNotFoundError("useConnect");

      const connectors = client.store.getConnectors();

      if (!connectors.includes(connector))
        throw new ConnectorNotFoundError({ connectorName: connector.name });

      let connectionResult: ConnectionResponse;

      if (chainId) {
        connectionResult = await connector.connect({ chainId: chainId });
      } else {
        connectionResult = await connector.connect();
      }

      return connectionResult;
    },
    onSuccess: params?.onSuccessfulConnect,
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

  useEffect(() => {
    if (params?.onConnect && client)
      client.emitter.on("connected", params.onConnect);

    return () => {
      if (params?.onConnect && client)
        client.emitter.off("connected", params.onConnect);
    };
  }, [client]);

  return {
    connect,
    connectAsync,
    isLoading,
    isError,
    error,
  };
};
