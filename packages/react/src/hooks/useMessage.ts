import { useMutation } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { connectorAtom } from '../store/atoms';
import { clientAtom } from '../store/client';

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

export const useMessage = ({ message }: SignMessageArgs) => {
  const [client] = useAtom(clientAtom);
  const [connector] = useAtom(connectorAtom);

  const { isLoading, isError, mutate, error } = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('Client not Initialised');

      if (!connector) throw new Error('Wallet not connected');

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
