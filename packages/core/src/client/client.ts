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
    this.setAutoConnect(autoConnect || false);
    this.setConnectors(connectors);
    // this.setAddress('INITNIT');

    if (localStorage.getItem("autoConnect") === null)
      localStorage.setItem("autoConnect", String(autoConnect));

    if (localStorage.getItem("autoConnect") !== String(autoConnect))
      localStorage.setItem("autoConnect", String(autoConnect));

    if (
      localStorage.getItem("lastUsedConnector") &&
      localStorage.getItem("autoConnect") === "true"
    ) {
      this.ac();
    }
  }

  static init = (config: ClientConfig) => {
    if (!Client.instance) Client.instance = new Client(config);
    return Client.instance;
  };

  private async ac() {
    this.setIsAutoConnecting(true);
    const lastConnName = localStorage.getItem("lastUsedConnector");

    const connector = this.getConnectors().find(
      conn => conn.name === lastConnName
    );

    if (!connector) return;
    else this.setLastUsedConnector(connector);

    this.setActiveConnector(this.getLastUsedConnector());
    this.activeConnector = this.getLastUsedConnector();

    if (this.activeConnector) {
      await this.activeConnector.connect({});
      const addresses = await this.activeConnector.getAccount();

      const address = addresses[0];

      if (!address) return;

      this.setAddress(address);

      const did = await this.activeConnector.resolveDid(address).catch(err => {
        console.error({ error: err });
        return null;
      });

      this.setDid(did);

      const chain = this.activeConnector.getChainId
        ? await this.activeConnector.getChainId()
        : null;

      this.setChainId(chain);

      this.setActiveChain(this.activeConnector.activeChain);
      this.setIsAutoConnecting(false);
      this.setIsConnected(true);
    }
  }
}
