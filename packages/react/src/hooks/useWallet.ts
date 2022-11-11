import { useAtom } from 'jotai';
import { connected, account, did, chainId } from 'src/store/atoms';
import { clientAtom } from 'src/store/client';

export const useWallet = () => {
  const [isConnected] = useAtom(connected);
  const [address] = useAtom(account);
  const [name] = useAtom(did);
  const [chain] = useAtom(chainId);
  const [client] = useAtom(clientAtom);
  if (!client) throw new Error('Client not initialised');

  return {
    isConnected,
    address,
    name,
    chain,
  };
};
