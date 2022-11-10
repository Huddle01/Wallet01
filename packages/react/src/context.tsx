import React, { FunctionComponent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import { Client, clientAtom } from './store/client';

interface Props {
  client: Client;
  children: JSX.Element;
}

/**
 * @description A context that wraps your app under wallet01 states and providers
 */

const Wallet01: FunctionComponent<Props> = ({ children, client }) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Provider initialValues={[[clientAtom, client]]}>{children}</Provider>
    </QueryClientProvider>
  );
};

export default Wallet01;
