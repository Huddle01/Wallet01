// import { autoConnectAtom, lastUsedConnectorAtom, store } from "../store/atoms";
import getState from "../store/rootStore";
import { BaseConnector } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class Wallet01Store {
  getAddress(): string | null {
    const { address } = getState();
    return address;
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

  getLastUsedConnector(): BaseConnector | null {
    const { lastUsedConnector } = getState();
    return lastUsedConnector;
  }

  getIsAutoConnecting(): boolean {
    const { isAutoConnecting } = getState();
    return isAutoConnecting;
  }

  setAddress(address: string | null): void {
    const { setAddress } = getState();
    setAddress(address);
  }

  setDid(did: string | null): void {
    const { setDid } = getState();
    setDid(did);
  }

  setIsConnected(val: boolean): void {
    const { setIsConnected } = getState();
    setIsConnected(val);
  }

  setChainId(id: string | null): void {
    const { setChainId } = getState();
    setChainId(id);
  }

  setConnectors(connectors: BaseConnector[]): void {
    const { setConnectors } = getState();
    setConnectors(connectors);
  }

  setActiveConnector(connector: BaseConnector | null): void {
    const { setActiveConnector } = getState();
    setActiveConnector(connector);
  }

  setLastUsedConnector(connector: BaseConnector | null): void {
    const { setLastUsedConnector } = getState();
    setLastUsedConnector(connector);
    AsyncStorage.setItem("lastUsedConnector", connector?.name ?? "");
  }

  setIsAutoConnecting(val: boolean): void {
    const { setIsAutoConnecting } = getState();
    setIsAutoConnecting(val);
  }

  getAutoConnect() {
    return AsyncStorage.getItem("autoConnect");
  }

  setAutoConnect(val: boolean): void {
    AsyncStorage.setItem("autoConnect", String(val));
  }

  getLastConnName() {
    return AsyncStorage.getItem("lastUsedConnector");
  }
}
