import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { DisconnectionResponse } from "@wallet01/core/dist/types/methodTypes";
import { ClientProvider } from "../context";
import { useCallback, useContext, useEffect } from "react";
import { ClientNotFoundError, NoWalletConnectedError } from "../utils/errors";
import { TEcosystem } from "@wallet01/core/dist/store/storeTypes";

interface useDisconnectConfig {
  onError?: UseMutationOptions<void, Error, unknown>["onError"];
  onSuccessfulDisconnect?: UseMutationOptions<
    DisconnectionResponse,
    Error,
    void
  >["onSuccess"];
  onDisconnect?: (walletName: string, ecosystem: TEcosystem) => void;
}

export const useDisconnect = (params?: useDisconnectConfig) => {
  const client = useContext(ClientProvider);

  const { data, isLoading, isError, mutate, mutateAsync, error } = useMutation<
    DisconnectionResponse,
    Error,
    void,
    unknown
  >({
    mutationFn: async () => {
      if (!client) throw new ClientNotFoundError("useDisconnect");

      const activeConnector = client.store.getActiveConnector();

      if (!activeConnector)
        throw new NoWalletConnectedError({ methodName: "disconnect" });
      const response = await activeConnector.disconnect();

      return response;
    },
    onSuccess: params?.onSuccessfulDisconnect,
    onError: params?.onError,
  });

  const disconnect = useCallback(() => {
    return mutate();
  }, [client]);

  const disconnectAsync = useCallback(() => {
    return mutateAsync();
  }, [client]);

  useEffect(() => {
    if (params?.onDisconnect && client)
      client.emitter.on("disconnected", params.onDisconnect);

    return () => {
      if (params?.onDisconnect && client)
        client.emitter.off("disconnected", params.onDisconnect);
    };
  }, [client]);

  return {
    disconnect,
    disconnectAsync,
    disconnectionResponse: data,
    isLoading,
    isError,
    error,
  };
};
