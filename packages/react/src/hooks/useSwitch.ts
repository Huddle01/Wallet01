import { useAtom } from 'jotai';
import { BaseConnector } from '@wallet01/core';
import { useMutation } from '@tanstack/react-query';
import { clientAtom } from 'src/store/client';
import { account, connected } from '../store/atoms';

/**
 * @description This hooks will return switchChain function that will help chain in your desired wallet.
 * @params Accepts an object with properties connector and chainId
 * @returns isActive, isLoading, isError, error, switchChain().
 *
 * For more details visit {@link}
 */

interface ChainSwitchArgs {
  connector: BaseConnector;
  chainId: string;
}

export const useSwitch = ({ connector, chainId }: ChainSwitchArgs) => {
  const [client] = useAtom(clientAtom);
  const [, setAddress] = useAtom(account);
  const [, setIsActive] = useAtom(connected);

  const { isLoading, isError, error, mutate } = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error('Client not Initialised');

      if (!client.connectors.includes(connector)) {
        throw new Error('Connector not found');
      }

      if (!connector.switchChain)
        throw new Error('Function not supported by wallet');
      setIsActive(false);
      await connector.switchChain(chainId);
      setAddress((await connector.getAccount())[0]);
      setIsActive(true);
    },
  });

  return {
    isLoading,
    isError,
    error,
    switchChain: mutate,
  };
};
