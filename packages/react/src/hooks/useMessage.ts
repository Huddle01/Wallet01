import { useMutation } from '@tanstack/react-query';
import { useStore } from '@wallet01/core';
/**
 * @description This hooks will return signMessage function that helps sign messages from desired wallet.
 * @params Accepts an object with properties connector and message
 * @returns isActive, isLoading, isError, error and signMessage()
 *
 * For more details visit {@link}
 */

interface SignMessageArgs {
  message: string;
}

export const useMessage = () => {
  const { connectors, activeConnector } = useStore();

  const { data, isLoading, isError, mutate, mutateAsync, error } = useMutation<
    string,
    Error,
    SignMessageArgs,
    unknown
  >({
    mutationFn: async ({ message }: SignMessageArgs) => {
      // if (!client) throw new Error('Client not Initialised');

      if (!activeConnector) throw new Error('Wallet not connected');

      if (!connectors.includes(activeConnector)) {
        throw new Error('Connector not found');
      }

      const hash = await activeConnector.signMessage(message);
      return hash;
    },
  });

  return {
    hash: data,
    isLoading,
    isError,
    error: error?.message,
    signMessage: mutate,
    signMessageAsync: mutateAsync,
  };
};
