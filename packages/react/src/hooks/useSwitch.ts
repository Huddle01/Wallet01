import { useAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import { clientAtom } from '../store/clientStore';
import {
  addressAtom,
  connectedAtom,
  connectorAtom,
} from '../store/clientStore';

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
  const [client] = useAtom(clientAtom);
  const [connector] = useAtom(connectorAtom);

  const [, setAddress] = useAtom(addressAtom);
  const [, setIsActive] = useAtom(connectedAtom);

  const { isLoading, isError, error, mutate } = useMutation<
    void,
    Error,
    void,
    unknown
  >({
    mutationFn: async () => {
      if (!client) throw new Error('Client not Initialised');

      if (!connector) throw new Error('Wallet not connected');

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
