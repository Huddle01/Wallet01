import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { atomWithStorage } from 'jotai/utils';
import { Client, BaseConnector } from '@wallet01/core';

const clientAtom = atom<Client | undefined>(undefined);

const auto = focusAtom(clientAtom, optic =>
  optic.valueOr({} as { autoConnect: undefined }).prop('autoConnect')
);
const autoConnectedAtom = atomWithStorage('autoConnect', auto.read);

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

const createClient = ({
  autoConnect,
  connectors,
}: {
  autoConnect: boolean;
  connectors: BaseConnector[];
}) => {
  const client = new Client({ autoConnect, connectors });
  return client;
};

export {
  autoConnectedAtom,
  connectedAtom,
  addressAtom,
  didAtom,
  chainAtom,
  connectorAtom,
  clientAtom,
  createClient,
};
