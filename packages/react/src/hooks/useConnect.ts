import {
  connectorName,
  connect as _connect,
  getAccount,
  resolveDid,
  disconnect,
} from '@wallet01/multichain';
import { useAtom } from 'jotai';
import { account, did, connected, chainId } from '../store/atoms';
import { useMutation } from '@tanstack/react-query';

/**
 * @description This hooks will return essential states and two function for connecting and disconnecting the desired wallet.
 * @params Accepts an object with properties connector and chainId
 * @returns isActive, isLoading, isError, error, address, name (ex: theVatsal.eth), activeChain, connect() and disconnect()
 * 
 * For more details visit {@link}
 */

export const useConnect = () => {
  const [isActive, setIsActive] = useAtom(connected);
  const [address, setAddress] = useAtom(account);
  const [name, setName] = useAtom(did);
  const [activeChain] = useAtom(chainId);

  const { isLoading, isError, mutate, error } = useMutation(
    async ({
      connector,
      _chainId,
    }: {
      connector: connectorName;
      _chainId: string;
    }) => {
      await _connect(connector, _chainId);
      setIsActive(true);

      const _account = await getAccount(connector);
      setAddress(_account[0]);

      const _did = await resolveDid(connector, _account[0]);
      setName(_did);
    }
  );

  return {
    isActive,
    address,
    name,
    activeChain,
    isLoading,
    isError,
    error,
    connect: ({
      connector,
      _chainId,
    }: {
      connector: connectorName;
      _chainId: string;
    }) => mutate({ connector, _chainId }),
    disconnect,
  };
};


