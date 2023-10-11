import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { ChainSwitchResponse } from "@wallet01/core/dist/types/methodTypes";
import { useCallback, useContext } from "react";
import { ClientProvider } from "../context";
import {
  ClientNotFoundError,
  NoWalletConnectedError,
  UnsupportedFunctionCalledError,
} from "../utils/errors";
import { BaseConnector } from "@wallet01/core";

interface ChainSwitchArgs {
  chainId: string;
}

interface useMessageConfig {
  onError?: UseMutationOptions<void, Error, ChainSwitchArgs>["onError"];
  onChainSwitched?: (
    fromChainId: string | "mainnet",
    toChainId: string | "mainnet",
    activeConnector: BaseConnector
  ) => void;
}

/**
 * @description This hooks will return switchChain function that will help chain in your desired wallet.
 * @params Accepts an object with properties connector and chainId
 * @returns isActive, isLoading, isError, error, switchChain().
 *
 * For more details visit {@link}
 */

export const useSwitch = (params?: useMessageConfig) => {
  const client = useContext(ClientProvider);

  const { isLoading, isError, error, mutate, mutateAsync } = useMutation<
    ChainSwitchResponse,
    Error,
    ChainSwitchArgs,
    unknown
  >({
    mutationFn: async ({ chainId }: ChainSwitchArgs) => {
      if (!client) throw new ClientNotFoundError();

      const activeConnector = client.store.getActiveConnector();
      const connectors = client.store.getConnectors();

      if (!activeConnector)
        throw new NoWalletConnectedError({ methodName: "switchChain" });

      if (!connectors.includes(activeConnector)) {
        throw new Error("Connector not found");
      }

      if (!activeConnector.switchChain)
        throw new UnsupportedFunctionCalledError({
          methodName: "switchChain",
          walletName: activeConnector.name,
        });

      if (params?.onChainSwitched)
        client.emitter.on("switchingChain", params.onChainSwitched);

      const response = await activeConnector.switchChain(chainId);

      return response;
    },
    onError: params?.onError,
  });

  const switchChain = useCallback(
    (params: ChainSwitchArgs) => {
      return mutate(params);
    },
    [client]
  );

  const switchChainAsync = useCallback(
    (params: ChainSwitchArgs) => {
      return mutateAsync(params);
    },
    [client]
  );

  return {
    isLoading,
    isError,
    error,
    switchChain,
    switchChainAsync,
  };
};
