import React, { FunctionComponent, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BaseConnector, Client } from '@wallet01/core';

interface Props {
  children: JSX.Element;
  autoConnect: boolean;
  connectors: BaseConnector[] | (() => BaseConnector[]);
}
/**
 * @description A context that wraps your app under wallet01 states and providers
 */
const Wallet01: FunctionComponent<Props> = ({
  children,
  autoConnect,
  connectors,
}) => {
  // if (typeof window === 'undefined') <>{children}</>;
  const [queryClient] = React.useState(() => new QueryClient());

  useEffect(() => {
    Client.init({
      autoConnect,
      connectors: typeof connectors === 'function' ? connectors() : connectors,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Wallet01;
