import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { atomWithStorage } from 'jotai/utils';
import { Client, createClient as init, BaseConnector } from '@wallet01/core';

const clientAtom = atom<Client>(
  new Client({ autoConnect: false, connectors: [] })
);

const auto = focusAtom(clientAtom, optic => optic.prop('autoConnect'));
const autoConnectedAtom = atomWithStorage('autoConnect', auto.read);

const connectedAtom = focusAtom(clientAtom, optic => optic.prop('connected'));

const addressAtom = focusAtom(clientAtom, optic => optic.prop('address'));

const didAtom = focusAtom(clientAtom, optic => optic.prop('name'));

const chainAtom = focusAtom(clientAtom, optic => optic.prop('chainId'));

const connectorAtom = focusAtom(clientAtom, optic =>
  optic.prop('activeConnector')
);

const createClient = ({
  autoConnect,
  connectors,
}: {
  autoConnect: boolean;
  connectors: BaseConnector[];
}) => {
  const client = init({ autoConnect: autoConnect, connectors: connectors });
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
