import { BaseConnector, useStore } from "@wallet01/core";
import { ClientProvider } from "../context";
import { useContext, useEffect } from "react";
import { ClientNotFoundError } from "../utils/errors";

type useAccountConfig = {
  onAccountChange?: (
    address: string[],
    activeConnector: BaseConnector
  ) => Promise<void> | void;
};

export const userAccount = ({ onAccountChange }: useAccountConfig) => {
  const client = useContext(ClientProvider);
  const { address, addresses, activeConnector } = useStore();

  useEffect(() => {
    if (!client) throw new ClientNotFoundError();

    if (onAccountChange) client.emitter.on("accountsChanged", onAccountChange);
  }, [activeConnector, client]);

  return {
    address,
    addresses,
    activeConnector,
  };
};
