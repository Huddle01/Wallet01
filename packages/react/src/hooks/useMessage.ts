import { useMutation } from '@tanstack/react-query';
import {
  connectorName,
  connect as _connect,
  signMessage as _sign,
} from '@wallet01/multichain';

/**
 * @description This hooks will return signMessage function that helps sign messages from desired wallet.
 * @params Accepts an object with properties connector and message
 * @returns isActive, isLoading, isError, error and signMessage()
 * 
 * For more details visit {@link}
 */

export const useMessage = () => {
  const { isLoading, isError, mutate, error } = useMutation(
    async ({
      connector,
      message,
    }: {
      connector: connectorName;
      message: string;
    }) => {
      await _sign(connector, message);
    }
  );

  return {
    isLoading,
    isError,
    error,
    signMessage: ({
      connector,
      message,
    }: {
      connector: connectorName;
      message: string;
    }) => mutate({ connector, message }),
  };
};
