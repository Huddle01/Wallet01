import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { atomWithStorage } from 'jotai/utils';

import Client, { Config } from '../client';

const clientAtom = atom<Client | undefined>(undefined);

const initClientAtom = atom(null, (get, set, config: Config) => {
  if (get(clientAtom)) return;

  const client = new Client(config, get, set);

  set(clientAtom, client);
});

const auto = focusAtom(clientAtom, optic =>
  optic.valueOr({} as { autoConnect: undefined }).prop('autoConnect')
);
const autoConnectedAtom = atomWithStorage('autoConnect', auto.read(atom));

const connectedAtom = focusAtom(clientAtom, optic =>
  optic.valueOr({} as { connected: undefined }).prop('connected')
);

const addressAtom = focusAtom(clientAtom, optic =>
  optic.valueOr({} as { address: undefined }).prop('address')
);

const didAtom = focusAtom(clientAtom, optic =>
  optic.valueOr({} as { name: undefined }).prop('name')
);

const chainAtom = focusAtom(clientAtom, optic =>
  optic.valueOr({} as { chainId: undefined }).prop('chainId')
);

const connectorAtom = focusAtom(clientAtom, optic =>
  optic.valueOr({} as { activeConnector: undefined }).prop('activeConnector')
);

export {
  autoConnectedAtom,
  connectedAtom,
  addressAtom,
  didAtom,
  chainAtom,
  connectorAtom,
  clientAtom,
  initClientAtom,
};
