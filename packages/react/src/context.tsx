import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useAtom } from 'jotai';
import {
  addressAtom,
  chainAtom,
  clientAtom,
  connectedAtom,
  didAtom,
} from './store/clientStore';
import { Client } from '@wallet01/core';

interface Props {
  client: Client;
  children: JSX.Element;
}
/**
 * @description A context that wraps your app under wallet01 states and providers
 */
const Wallet01: FunctionComponent<Props> = ({ children, client }) => {
  const [, setClient] = useAtom(clientAtom);
  const [, setIsConnected] = useAtom(connectedAtom);
  const [, setAddress] = useAtom(addressAtom);
  const [, setName] = useAtom(didAtom);
  const [, setChainId] = useAtom(chainAtom);

  const [queryClient] = React.useState(() => new QueryClient());

  if (typeof window === 'undefined') <>{children}</>;
  setClient(client);

  client.on('connect', async data => {
    console.log(data);
    setAddress(await data.address);
    setName(await data.did);
    setChainId(await data.chainId);
    setIsConnected(true);
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Provider initialValues={[[clientAtom, client]]}>{children}</Provider>
    </QueryClientProvider>
  );
};

export default Wallet01;
