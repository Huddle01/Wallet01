import { useStore } from "@wallet01/core";

export const useWallet = () => {
  const { chainId, address, isConnected, activeConnector } = useStore();

  return {
    walletName: activeConnector?.name,
    ecosystem: activeConnector?.ecosystem,
    isConnected,
    address,
    chainId,
    activeConnector,
  };
};
