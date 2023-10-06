"use client";
import React, { FunctionComponent, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BaseConnector, Client } from "@wallet01/core";

interface Props {
  children: JSX.Element;
  autoConnect: boolean;
  connectors: BaseConnector[] | (() => BaseConnector[]);
}

export const ClientProvider = React.createContext<Client | null>(null);
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
  const [wallet01Client, setWalletClient] = useState<Client | null>(null);

  useEffect(() => {
    const client = Client.init({
      autoConnect,
      connectors: typeof connectors === "function" ? connectors() : connectors,
    });

    setWalletClient(client);
  }, [connectors]);

  return (
    <QueryClientProvider client={queryClient}>
      <ClientProvider.Provider value={wallet01Client}>
        {children}
      </ClientProvider.Provider>
    </QueryClientProvider>
  );
};

export default Wallet01;
