import { atom } from 'jotai';
import { focusAtom } from 'jotai/optics';
import { BaseConnector } from '@wallet01/core';

export class Client {
  autoConnect: boolean;
  lastUsedConnector: BaseConnector | null;

  connectors: BaseConnector[];
  connected: boolean;
  address: string | null;
  name: string | null;
  chainId: string | null;
  activeConnector: BaseConnector | null;

  constructor({
    autoConnect,
    connectors,
  }: {
    autoConnect: boolean;
    connectors: BaseConnector[];
  }) {
    this.autoConnect = autoConnect;
    this.connectors = connectors;
    this.connected = false;
    if (autoConnect && connectors.length > 0) {
      connectors[0].connect({});
    }
  }
}

const clientAtom = atom<Client>(
  new Client({ autoConnect: false, connectors: [] })
);

const connectedAtom = focusAtom(clientAtom, optic => optic.prop('connected'));
const addressAtom = focusAtom(clientAtom, optic => optic.prop('address'));
const didAtom = focusAtom(clientAtom, optic => optic.prop('name'));
const chainAtom = focusAtom(clientAtom, optic => optic.prop('chainId'));
const connectorAtom = focusAtom(clientAtom, optic =>
  optic.prop('activeConnector')
);

export {
  connectedAtom,
  addressAtom,
  didAtom,
  chainAtom,
  connectorAtom,
  clientAtom,
};
