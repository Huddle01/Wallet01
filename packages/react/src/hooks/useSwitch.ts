import { useMutation } from '@tanstack/react-query';
import { useStore } from '@wallet01/core';

/**
 * @description This hooks will return switchChain function that will help chain in your desired wallet.
 * @params Accepts an object with properties connector and chainId
 * @returns isActive, isLoading, isError, error, switchChain().
 *
 * For more details visit {@link}
 */

interface ChainSwitchArgs {
  chainId: string;
}

export const useSwitch = ({ chainId }: ChainSwitchArgs) => {
  const { connectors, activeConnector, setAddress, setIsConnected, setDid } =
    useStore();

  const { isLoading, isError, error, mutate } = useMutation<
    void,
    Error,
    void,
    unknown
  >({
    mutationFn: async () => {
      // if (!client) throw new Error('Client not Initialised');

      if (!activeConnector) throw new Error('Wallet not connected');

      if (!connectors.includes(activeConnector)) {
        throw new Error('Connector not found');
      }

      if (!activeConnector.switchChain)
        throw new Error('Function not supported by wallet');

      await activeConnector.switchChain(chainId);
      setIsConnected(false);
      const address = (await activeConnector.getAccount())[0];
      setAddress(address);
      if (chainId === '1') {
        setDid(address ? await activeConnector.resolveDid(address) : null);
      }
      setIsConnected(true);
    },
  });

  return {
    isLoading,
    isError,
    error,
    switchChain: mutate,
  };
};
