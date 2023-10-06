import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useCallback, useContext } from "react";
import { ClientProvider } from "../context";
import { ClientNotFoundError, NoWalletConnectedError } from "../utils/errors";
import { MessageSignedResponse } from "@wallet01/core/dist/types/methodTypes";
interface SignMessageArgs {
  message: string;
}

interface useMessageConfig {
  onError?: UseMutationOptions<void, Error, unknown>["onError"];
  onMessageSigned?: ({
    activeConnector,
    signature,
  }: MessageSignedResponse) => void;
}
/**
 * @description This hooks will return signMessage function that helps sign messages from desired wallet.
 * @params Accepts an object with properties connector and message
 * @returns isActive, isLoading, isError, error and signMessage()
 *
 * For more details visit {@link}
 */

export const useMessage = ({ onError }: useMessageConfig) => {
  const client = useContext(ClientProvider);

  const { data, isLoading, isError, mutate, mutateAsync, error } = useMutation<
    MessageSignedResponse,
    Error,
    SignMessageArgs,
    unknown
  >({
    mutationFn: async ({ message }: SignMessageArgs) => {
      try {
        if (!client) throw new ClientNotFoundError();

        const activeConnector = client.store.getActiveConnector();

        if (!activeConnector)
          throw new NoWalletConnectedError({ methodName: "signMessage" });

        const response = await activeConnector.signMessage(message);

        // if (onMessageSigned)
        //   client.on("messageSigned", (signature, activeConnector) =>
        //     onMessageSigned({ signature, activeConnector })
        //   );

        return response;
      } catch (error) {
        throw error;
      }
    },
    onError,
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
