import { BaseConnector, useStore } from "@wallet01/core";
import { useContext, useEffect } from "react";
import { ClientProvider } from "../context";
import { ClientNotFoundError } from "../utils/errors";

interface useChainConfig {
  onChainChanged?: (chainId: string, activeConnector: BaseConnector) => void;
}

export const useChain = (params?: useChainConfig) => {
  const client = useContext(ClientProvider);
  const { activeConnector, chainId } = useStore();

  useEffect(() => {
    if (!client) throw new ClientNotFoundError("useChain");

    if (params?.onChainChanged)
      client.emitter.on("chainChanged", params.onChainChanged);
  }, [activeConnector, client]);

  return {
    chainId,
    activeConnector,
  };
};
