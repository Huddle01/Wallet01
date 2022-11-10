import { atom } from 'jotai';
import { BaseConnector } from '@wallet01/core';

// export interface Client {
//   autoConnect: boolean;
//   connectors: (() => BaseConnector<any>[]) | BaseConnector<any>[];
//   connected: boolean;
// }

export const clientAtom = atom<Client | null>(null);

export class Client {
  autoConnect: boolean;
  // connectors: (() => BaseConnector[]) | BaseConnector[];
  connectors: BaseConnector[];
  connected: boolean;

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
  }
}
