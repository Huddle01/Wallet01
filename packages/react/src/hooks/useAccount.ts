import { BaseConnector, useStore } from "@wallet01/core";
import { ClientProvider } from "../context";
import { useContext, useEffect } from "react";

type useAccountConfig = {
  onAccountChange?: (
    address: string[],
    activeConnector: BaseConnector
  ) => Promise<void> | void;
};

export const useAccount = (params?: useAccountConfig) => {
  const client = useContext(ClientProvider);
  const { address, addresses, activeConnector } = useStore();

  useEffect(() => {
    if (params?.onAccountChange && client)
      client.emitter.on("accountsChanged", params.onAccountChange);

    return () => {
      if (params?.onAccountChange && client)
        client.emitter.off("accountsChanged", params.onAccountChange);
    };
  }, [activeConnector, client]);

  return {
    address,
    addresses,
    activeConnector,
  };
};
