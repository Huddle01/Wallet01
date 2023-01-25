import { useStore } from "@wallet01/core";

export const useClient = () => {
  const { connectors, isAutoConnecting, activeChain } = useStore();

  return {
    connectors,
    isAutoConnecting,
    activeChain,
  };
};
