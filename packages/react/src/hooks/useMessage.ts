import { useMutation } from '@tanstack/react-query';
import { BaseConnector } from '@wallet01/core';
import { useAtom } from 'jotai';
import { clientAtom } from 'src/store/client';

/**
 * @description This hooks will return signMessage function that helps sign messages from desired wallet.
 * @params Accepts an object with properties connector and message
 * @returns isActive, isLoading, isError, error and signMessage()
 *
 * For more details visit {@link}
 */

interface SignMessageArgs {
  connector: BaseConnector;
  message: string;
}

export const useMessage = ({ connector, message }: SignMessageArgs) => {
  const [client] = useAtom(clientAtom);

  const { isLoading, isError, mutate, error } = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('Client not Initialised');

      if (!client.connectors.includes(connector)) {
        throw new Error('Connector not found');
      }

      await connector.signMessage(message);
    },
  });

  return {
    isLoading,
    isError,
    error,
    signMessage: mutate,
  };
};
