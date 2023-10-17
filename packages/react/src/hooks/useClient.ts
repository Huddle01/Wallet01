import { useStore } from "@wallet01/core";

export const useClient = () => {
  const { connectors, ecosystem, activeConnector, isAutoConnecting } =
    useStore();

  return {
    connectors,
    ecosystem,
    activeConnector,
    isAutoConnecting,
  };
};
