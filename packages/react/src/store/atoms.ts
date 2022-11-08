import { atom, useAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import {
  connectorName,
  connect,
  getAccount,
  resolveDid,
  disconnect,
} from '@wallet01/multichain';

const connected = atom<boolean>(false);

const account = atom<string | null>(null);

const did = atom<string | null>(null);

const chainId = atom<string | null>(null);

const connectLoadable = loadable(
  atom(
    null,
    async (
      _,
      set,
      { connector, _chainId }: { connector: connectorName; _chainId: string }
    ) => {
      await connect(connector, _chainId);

      const _account = await getAccount(connector);
      set(account, _account[0]);

      const _did = await resolveDid(connector, _account[0]);
      set(did, _did);
      set(connected, true);
    }
  )
);

export { connected, account, did, chainId, connectLoadable };
