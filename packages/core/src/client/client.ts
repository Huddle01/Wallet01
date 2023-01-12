import { store, autoConnectAtom, lastUsedConnectorAtom } from "../store/atoms";
import { BaseConnector } from "../types";
import { Wallet01Store } from "./store";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ClientConfig = {
  autoConnect?: boolean;
  connectors: BaseConnector[];
};

export default class Client extends Wallet01Store {
  private static instance: Client;
  activeConnector: BaseConnector | null = null;

  constructor({ autoConnect, connectors }: ClientConfig) {
    super();

    console.log(
      AsyncStorage.multiGet(["autoConnect", "lastUsedConnector"]),
      localStorage.length
    );

    // Need to subscribe to get value from storage
    store.sub(autoConnectAtom, () => {});
    store.sub(lastUsedConnectorAtom, () => {});

    this.setAutoConnect(autoConnect || false);
    this.setConnectors(connectors);

    this.ac();
  }

  static init = (config: ClientConfig) => {
    if (!Client.instance) Client.instance = new Client(config);
    return Client.instance;
  };

  private async ac() {
    if (
      (await this.getLastConnName()) &&
      (await this.getAutoConnect()) === "true"
    ) {
      this.setIsAutoConnecting(true);
      const conneNameRaw = await this.getLastConnName();
      const lastConnName = conneNameRaw?.substring(1, conneNameRaw.length - 1);

      const connector = this.getConnectors().find(
        conn => conn.name === lastConnName
      );
      console.log(connector);

      if (!connector) {
        this.setIsAutoConnecting(false);
        return;
      } else this.setLastUsedConnector(connector);

      this.setActiveConnector(this.getLastUsedConnector());
      this.activeConnector = this.getLastUsedConnector();
      console.log(this.activeConnector);
      if (this.activeConnector) {
        this.activeConnector.connect({});
        const addresses = await this.activeConnector.getAccount();
        console.log(addresses);

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
}
