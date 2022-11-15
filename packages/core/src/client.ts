import { BaseConnector } from './types';

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
    autoConnect = false,
    connectors,
  }: {
    autoConnect?: boolean;
    connectors: BaseConnector[];
  }) {
    this.autoConnect = autoConnect;
    this.connectors = connectors;
    this.connected = false;

    if (localStorage.getItem('autoConnect') === null) {
      localStorage.setItem('autoConnect', String(autoConnect));
    }

    if (localStorage.getItem('autoConnect') !== String(autoConnect)) {
      localStorage.setItem('autoConnect', String(autoConnect));
    }

    if (
      localStorage.getItem('lastUsedConnector') !== null &&
      localStorage.getItem('autoConnect') === 'true'
    ) {
      const lastConnName = localStorage.getItem('lastUsedConnector');

      this.lastUsedConnector = connectors.filter(
        conn => conn.name === lastConnName
      )[0];

      this.lastUsedConnector?.connect({});
      this.connected = true;
    }
  }
}

export const createClient = ({
  autoConnect,
  connectors,
}: {
  autoConnect: boolean;
  connectors: BaseConnector[];
}) => {
  return new Client({ autoConnect: autoConnect, connectors: connectors });
};
