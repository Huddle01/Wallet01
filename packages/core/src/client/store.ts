import { getState } from "../store/rootStore";
import { IState } from "../store/storeTypes";
import { BaseConnector } from "../types";

export class Wallet01Store {
  static #instance: Wallet01Store;

  constructor() {
    this.getState = getState;
  }

  public static init() {
    if (!Wallet01Store.#instance) {
      Wallet01Store.#instance = new Wallet01Store();
    }
    return Wallet01Store.#instance;
  }

  getState: () => IState;

  getEcosystem() {
    const { ecosystem } = getState();
    return ecosystem;
  }

  getAddress() {
    const { address } = getState();
    return address;
  }

  getAddresses() {
    const { addresses } = getState();
    return addresses;
  }

  getDid(): string | null {
    const { did } = getState();
    return did;
  }

  getIsConnected(): boolean {
    const { isConnected } = getState();
    return isConnected;
  }

  getChain(): string | null {
    const { chainId } = getState();
    return chainId;
  }

  getConnectors(): BaseConnector[] {
    const { connectors } = getState();
    return connectors;
  }

  getActiveConnector(): BaseConnector | null {
    const { activeConnector } = getState();
    return activeConnector;
  }

  setEcosystem(ecosystem: "ethereum" | "solana" | "cosmos" | "tezos") {
    const { setEcosystem } = getState();
    setEcosystem(ecosystem);
  }

  setAddress(address: string | null) {
    const { setAddress } = getState();
    setAddress(address);
  }

  setDid(did: string | null) {
    const { setDid } = getState();
    setDid(did);
  }

  setIsConnected(val: boolean) {
    const { setIsConnected } = getState();
    setIsConnected(val);
  }

  setChainId(id: string | "default") {
    const { setChainId } = getState();
    setChainId(id);
  }

  setConnectors(connectors: BaseConnector[]) {
    const { setConnectors } = getState();
    setConnectors(connectors);
  }

  setActiveConnector(connector: BaseConnector | null) {
    const { setActiveConnector } = getState();
    setActiveConnector(connector);
  }
}
