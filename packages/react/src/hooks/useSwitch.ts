import { useAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import { account, did, connected, chainId } from '../store/atoms';
import {
  connectorName,
  getAccount,
  getChainId,
  resolveDid,
  switchChain,
} from '@wallet01/multichain';

/**
 * @description This hooks will return switchChain function that will help chain in your desired wallet.
 * @params Accepts an object with properties connector and chainId
 * @returns isActive, isLoading, isError, error, switchChain().
 * 
 * For more details visit {@link}
 */

export const useSwitch = () => {
  const [, setAddress] = useAtom(account);
  const [, setName] = useAtom(did);
  const [, setIsActive] = useAtom(connected);
  const [, setActiveChainId] = useAtom(chainId);

  const { isLoading, isError, error, mutate } = useMutation(
    async ({
      connector,
      _chainId,
    }: {
      connector: connectorName;
      _chainId: string;
    }) => {
      await switchChain(connector, _chainId);

      const _address = await getAccount(connector);
      setAddress(_address[0]);

      const _name = await resolveDid(connector, _address[0]);
      setName(_name);

      const _id = await getChainId(connector);
      setActiveChainId(_id);

      setIsActive(true);
    }
  );

  return {
    isLoading,
    isError,
    error,
    switchChain: ({
      connector,
      _chainId,
    }: {
      connector: connectorName;
      _chainId: string;
    }) => mutate({ connector, _chainId }),
  };
};
