import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useAtom } from 'jotai';
import { clientAtom } from './store/clientStore';
import { Client } from '@wallet01/core';

interface Props {
  client: Client | (() => Client);
  children: JSX.Element;
}
/**
 * @description A context that wraps your app under wallet01 states and providers
 */
const Wallet01: FunctionComponent<Props> = ({ children, client }) => {
  const [, setClient] = useAtom(clientAtom);
  const [queryClient] = React.useState(() => new QueryClient());

  if (typeof window === 'undefined') <>{children}</>;
  setClient(client);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider initialValues={[[clientAtom, client]]}>{children}</Provider>
    </QueryClientProvider>
  );
};

export default Wallet01;
