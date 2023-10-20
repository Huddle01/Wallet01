import { ClientEvents, ConnectorEvents } from "../types/events";
import { ClientConfig } from "../types/methodTypes";
import { EnhancedEventEmitter } from "../utils/EnhancedEventEmitter";
import { Wallet01Store } from "./store";

export default class Wallet01Client {
  static #instance: Wallet01Client;
  public readonly emitter: EnhancedEventEmitter<ConnectorEvents & ClientEvents>;

  public store: Wallet01Store = Wallet01Store.init();

  private constructor({ autoConnect = false, connectors }: ClientConfig) {
    this.emitter = EnhancedEventEmitter.init();
    this.store.setConnectors(connectors);

    console.log("Creating client class");

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
    this.emitter.on(
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

    this.emitter.on("disconnected", () => {
      localStorage.removeItem("lastUsedConnector");
      this.store.setActiveConnector(null);
      this.store.setAddress(null);
      this.store.setChainId(null);
      this.store.setEcosystem(null);
      this.store.setIsConnected(false);
    });

    this.emitter.on(
      "switchingChain",
      async (_f, toChainId, activeConnector) => {
        const accounts = await activeConnector.getAccount();
        if (accounts[0]) this.store.setAddress(accounts[0]);
        this.store.setActiveConnector(activeConnector);
        this.store.setChainId(toChainId);
      }
    );

    this.emitter.on("chainChanged", chainId => {
      this.store.setChainId(chainId);
    });

    this.emitter.on("accountsChanged", addresses => {
      console.log("accountsChanged", addresses);
      this.store.setAddresses(addresses);
      if (addresses[0]) this.store.setAddress(addresses[0]);
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
      this.emitter.emit(
        "isAutoConnecting",
        activeConnector.ecosystem,
        activeConnector
      );

      this.store.setIsAutoConnecting(true);
      await activeConnector
        .connect()
        .then(() => {
          this.store.setIsAutoConnecting(false);
        })
        .catch(() => {
          this.store.setIsAutoConnecting(false);
        });
    }
  }
}
