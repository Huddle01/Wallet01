import EventEmitter from 'eventemitter3';
import { BaseConnector } from './types';

type Config = {
  autoConnect?: boolean;
  connectors: BaseConnector[];
};

interface ClientEventEmitter {
  connect: ({
    address,
    did,
    chainId,
  }: {
    address: Promise<string | null>;
    did: Promise<string | null>;
    chainId: Promise<string | null>;
  }) => void;
  disconnect: () => void;
  error: ({ error, message }: { error: Error; message: string }) => void;
}

export class Client extends EventEmitter<ClientEventEmitter> {
  autoConnect: boolean;
  lastUsedConnector: BaseConnector | null;

  connectors: BaseConnector[];
  connected: boolean;
  address: string | null;
  name: string | null;
  chainId: string | null;
  activeConnector: BaseConnector | null;

  constructor({ autoConnect = false, connectors }: Config) {
    super();

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

      const connector = connectors.find(conn => conn.name === lastConnName);

      if (!connector) {
        this.emit('error', {
          error: new Error('Connector not Found'),
          message: 'Connector Not Found',
        });
        return;
      } else this.lastUsedConnector = connector;

      this.lastUsedConnector.connect({});
      this.activeConnector = this.lastUsedConnector;
      this.emit('connect', {
        address: this.getAddress(),
        chainId: this.getChainId(),
        did: this.resolveDid(),
      });
      this.connected = true;
    }
  }

  async getAddress() {
    if (!this.activeConnector) return null;
    const add = await this.activeConnector.getAccount();
    this.address = add[0];
    return add[0];
  }

  async getChainId() {
    if (!(this.activeConnector && this.activeConnector.getChainId)) return null;
    const chain = await this.activeConnector.getChainId();
    this.chainId = chain;
    return chain;
  }

  async resolveDid() {
    if (!(this.activeConnector && this.activeConnector.resolveDid)) return null;
    if (!this.address) return null;
    const name = await this.activeConnector.resolveDid(this.address);
    this.name = name;
    return name;
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
