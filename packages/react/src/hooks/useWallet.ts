import { useMutation } from "@tanstack/react-query";
import { useStore } from "@wallet01/core";

export const useWallet = () => {
  const {
    did,
    chainId,
    address,
    connectors,
    isConnected,
    activeConnector,
    setDid,
    setAddress,
    setChainId,
    setIsConnected,
    setActiveConnector,
  } = useStore();

  const { mutate } = useMutation({
    mutationFn: async () => {
      // if (!client) throw new Error('Client not Initialised');

      if (!activeConnector) throw new Error("Wallet not connected");

      if (!connectors.includes(activeConnector)) {
        throw new Error("Connector not found");
      }

      await activeConnector.disconnect();
      setActiveConnector(null);
      setAddress(null);
      setChainId(null);
      setDid(null);
      setIsConnected(false);
      localStorage.setItem("lastUsedConnector", "");
    },
  });

  return {
    isConnected,
    address,
    did,
    chainId,
    activeConnector,
    disconnect: mutate,
  };
};
