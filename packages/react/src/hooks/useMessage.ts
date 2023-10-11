import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useCallback, useContext } from "react";
import { ClientProvider } from "../context";
import { ClientNotFoundError, NoWalletConnectedError } from "../utils/errors";
import {
  MessageSignedResponse,
  SignatureHash,
} from "@wallet01/core/dist/types/methodTypes";
import { BaseConnector } from "@wallet01/core";
interface SignMessageArgs {
  message: string;
}

interface useMessageConfig {
  onError?: UseMutationOptions<
    MessageSignedResponse,
    Error,
    SignMessageArgs
  >["onError"];
  onMessageSigned?: (
    signature: SignatureHash,
    activeConnector: BaseConnector
  ) => void;
}
/**
 * @description This hooks will return signMessage function that helps sign messages from desired wallet.
 * @params Accepts an object with properties connector and message
 * @returns isActive, isLoading, isError, error and signMessage()
 *
 * For more details visit {@link}
 */

export const useMessage = (params?: useMessageConfig) => {
  const client = useContext(ClientProvider);

  const { data, isLoading, isError, mutate, mutateAsync, error } = useMutation<
    MessageSignedResponse,
    Error,
    SignMessageArgs,
    unknown
  >({
    mutationFn: async ({ message }: SignMessageArgs) => {
      if (!client) throw new ClientNotFoundError();

      const activeConnector = client.store.getActiveConnector();

      if (!activeConnector)
        throw new NoWalletConnectedError({ methodName: "signMessage" });

      if (params?.onMessageSigned)
        client.emitter.on("messageSigned", params.onMessageSigned);

      const response = await activeConnector.signMessage(message);

      return response;
    },
    onError: params?.onError,
  });

  const signMessage = useCallback(
    (params: SignMessageArgs) => {
      return mutate(params);
    },
    [client]
  );

  const signMessageAsync = useCallback(
    (params: SignMessageArgs) => {
      return mutateAsync(params);
    },
    [client]
  );

  return {
    hash: data?.signature,
    isLoading,
    isError,
    error: error?.message,
    signMessage,
    signMessageAsync,
  };
};
