import { useStore } from '@wallet01/core';

export const useClient = () => {
  const { connectors, isAutoConnecting } = useStore();

  return {
    connectors,
    isAutoConnecting,
  };
};
