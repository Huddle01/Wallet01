import { useAtom } from 'jotai';
import { clientAtom } from '../store/client';

export const useClient = () => {
  const [client] = useAtom(clientAtom);

  return {
    connectors: client?.connectors,
  };
};
