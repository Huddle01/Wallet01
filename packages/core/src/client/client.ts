import { store, autoConnectAtom, lastUsedConnectorAtom } from "../store/atoms";
import { BaseConnector } from "../types";
import { Wallet01Store } from "./store";

type ClientConfig = {
  autoConnect?: boolean;
  connectors: BaseConnector[];
};

export default class Client extends Wallet01Store {
  private static instance: Client;
  activeConnector: BaseConnector | null = null;

  constructor({ autoConnect, connectors }: ClientConfig) {
    super();

    // Need to subscribe to get value from storage
    store.sub(autoConnectAtom, () => {});
    store.sub(lastUsedConnectorAtom, () => {});

    this.setAutoConnect(autoConnect || false);
    this.setConnectors(connectors);

    if (this.getLastConnName() && this.getAutoConnect()) {
      this.ac();
    }
  }

  static init = (config: ClientConfig) => {
    if (!Client.instance) Client.instance = new Client(config);
    return Client.instance;
  };

  private async ac() {
    this.setIsAutoConnecting(true);
    const lastConnName = this.getLastConnName();

    const connector = this.getConnectors().find(
      conn => conn.name === lastConnName
    );

    if (!connector) return;
    else this.setLastUsedConnector(connector);

    this.setActiveConnector(this.getLastUsedConnector());
    this.activeConnector = this.getLastUsedConnector();

    if (this.activeConnector) {
      this.activeConnector.connect({});
      const addresses = await this.activeConnector.getAccount();

      const address = addresses[0];

      if (!address) return;

      this.setAddress(address);
      try {
        if (
          this.activeConnector.getChainId &&
          (await this.activeConnector.getChainId()) === "1"
        )
          this.setDid(await this.activeConnector.resolveDid(address));
      } catch (error) {
        console.error(error);
      }

      this.activeConnector.getChainId
        ? this.setChainId(await this.activeConnector.getChainId())
        : this.setChainId(null);

      this.setIsAutoConnecting(false);
      this.setIsConnected(true);
    }
  }
}
