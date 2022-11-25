import { useAtom, useSetAtom } from 'jotai';
import { BaseConnector } from '@wallet01/core';
import { useMutation } from '@tanstack/react-query';

import {
  addressAtom,
  chainAtom,
  connectedAtom,
  connectorAtom,
  didAtom,
} from '../store/clientStore';
import { clientAtom } from '../store/clientStore';

type ConnectArgs = {
  connector: BaseConnector | undefined;
  chainId?: string;
};

/**
 * @description This hooks will return essential states and two function for connecting and disconnecting the desired wallet.
 * @params Accepts an object with properties connector and chainId
 * @returns isActive, isLoading, isError, error, address, name (ex: theVatsal.eth), activeChain, connect() and disconnect()
 *
 * For more details visit {@link}
 */
export const useConnect = () => {
  const [client] = useAtom(clientAtom);
  const setConnector = useSetAtom(connectorAtom);

  const isActive = useSetAtom(connectedAtom);
  const setAccount = useSetAtom(addressAtom);
  const setName = useSetAtom(didAtom);
  const setChainId = useSetAtom(chainAtom);

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: async ({ connector, chainId }: ConnectArgs) => {
      if (client?.connectors.length === 0)
        throw new Error('Client not initialised');

      if (!connector) throw new Error('Connector required to connect');
      setConnector(connector);

      if (!client?.connectors.includes(connector))
        throw new Error('Connector not found');
      console.log(chainId, 'inUseConnect');
      if (chainId) {
        await connector.connect({ chainId: chainId });
      } else {
        await connector.connect({});
      }

      const accounts = await connector.getAccount();
      setAccount(accounts[0]);

      setName(await connector.resolveDid(accounts[0]));

      if (connector.getChainId) {
        setChainId(await connector.getChainId());
      }

      isActive(true);
    },
  });

  return {
    connect: mutate,
    isLoading,
    isError,
    error,
  };
};
