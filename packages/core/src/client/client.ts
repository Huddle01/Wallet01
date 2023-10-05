import { ClientEvents, ConnectorEvents } from "../types/events";
import { ClientConfig } from "../types/methodTypes";
import { EnhancedEventEmitter } from "../utils/EnhancedEventEmitter";
import { Wallet01Store } from "./store";

export default class Wallet01Client extends EnhancedEventEmitter<
  ClientEvents & ConnectorEvents
> {
  static #instance: Wallet01Client;

  public store: Wallet01Store = Wallet01Store.init();

  constructor({ autoConnect = false, connectors }: ClientConfig) {
    super();
    this.store.setConnectors(connectors);
    this.registerEventListeners();

    if (localStorage.getItem("autoConnect") === null)
      localStorage.setItem("autoConnect", String(autoConnect));

    if (localStorage.getItem("autoConnect") === "false") {
      return;
    }

    if (localStorage.getItem("autoConnect") !== String(autoConnect))
      localStorage.setItem("autoConnect", String(autoConnect));

    if (!localStorage.getItem("lastUsedConnector")) {
      return;
    }

    if (
      localStorage.getItem("lastUsedConnector") &&
      localStorage.getItem("autoConnect") === "true"
    ) {
      this.autoConnect();
    }
  }

  static init = (config: ClientConfig) => {
    if (!Wallet01Client.#instance)
      Wallet01Client.#instance = new Wallet01Client(config);
    return Wallet01Client.#instance;
  };

  private registerEventListeners() {
    // this.on("isAutoConnecting", (ecosystem) => {})
    this.on(
      "connected",
      (address, chainId, walletName, ecosystem, activeConnector) => {
        localStorage.setItem("lastUsedConnector", walletName);
        this.store.setActiveConnector(activeConnector);
        this.store.setAddress(address);
        this.store.setChainId(chainId);
        this.store.setEcosystem(ecosystem);
        this.store.setIsConnected(true);
      }
    );

    this.on("disconnected", () => {
      localStorage.removeItem("lastUsedConnector");
      this.store.setActiveConnector(null);
      this.store.setAddress(null);
      this.store.setChainId(null);
      this.store.setEcosystem(null);
      this.store.setIsConnected(false);
      this.removeAllListeners();
    });

    this.on("chainChanged", chainId => {
      this.store.setChainId(chainId);
    });

    this.on("accountsChanged", addresses => {
      this.store.setAddresses(addresses);
    });
  }

  private async autoConnect() {
    const lastUsedConnectorName = localStorage.getItem("lastUsedConnector");

    if (!lastUsedConnectorName) {
      console.info({
        message: "No last used connector found",
      });
      return;
    }

    const lastUsedConnector = this.store
      .getConnectors()
      .find(conn => conn.name === lastUsedConnectorName);

    if (!lastUsedConnector) {
      console.warn({
        message: `The connector for wallet name: ${lastUsedConnectorName} was not found in the list of connectors`,
      });
      return;
    }

    this.store.setActiveConnector(lastUsedConnector);

    const activeConnector = this.store.getActiveConnector();

    if (activeConnector) {
      this.emit("isAutoConnecting", activeConnector.ecosystem, activeConnector);

      await activeConnector.init();
      await activeConnector.connect();
    }
  }
}
