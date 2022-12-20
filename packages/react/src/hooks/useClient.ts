import { useStore } from '@wallet01/core';

export const useClient = () => {
  const { connectors } = useStore();

  return {
    connectors: connectors,
  };
};
