import { BaseConnector, useStore } from "@wallet01/core";
import { useContext, useEffect } from "react";
import { ClientProvider } from "../context";

interface useChainConfig {
  onChainChanged?: (chainId: string, activeConnector: BaseConnector) => void;
}

export const useChain = (params?: useChainConfig) => {
  const client = useContext(ClientProvider);
  const { activeConnector, chainId } = useStore();

  useEffect(() => {
    if (params?.onChainChanged && client)
      client.emitter.on("chainChanged", params.onChainChanged);

    return () => {
      if (params?.onChainChanged && client)
        client.emitter.off("chainChanged", params.onChainChanged);
    };
  }, [activeConnector, client]);

  return {
    chainId,
    activeConnector,
  };
};
