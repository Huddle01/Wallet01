import { BaseConnector, useStore } from "@wallet01/core";
import { useContext, useEffect } from "react";
import { ClientProvider } from "../context";
import { ClientNotFoundError } from "../utils/errors";

interface useChainConfig {
  onChainChanged?: (chainId: string, activeConnector: BaseConnector) => void;
}

export const useChain = ({ onChainChanged }: useChainConfig) => {
  const client = useContext(ClientProvider);
  const { activeConnector, chainId } = useStore();

  useEffect(() => {
    if (!client) throw new ClientNotFoundError();

    if (onChainChanged) client.emitter.on("chainChanged", onChainChanged);
  }, [activeConnector, client]);

  return {
    chainId,
    activeConnector,
  };
};
