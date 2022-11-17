import { useAtom } from 'jotai';
import { clientAtom } from '../store/clientStore';

export const useClient = () => {
  const [client] = useAtom(clientAtom);

  return {
    connectors: client?.connectors,
  };
};
