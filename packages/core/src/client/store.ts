import getState from "../store/rootStore";
import { BaseConnector } from "../types";

export class Wallet01Store {
  getActiveChain(): "ethereum" | "solana" | "cosmos" | "tezos" | null {
    const { activeChain } = getState();
    return activeChain;
  }

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

  getAutoConnect(): boolean {
    const { autoConnect } = getState();
    return autoConnect;
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

  setActiveChain(
    activeChain: "ethereum" | "solana" | "cosmos" | "tezos" | null
  ): void {
    const { setActiveChain } = getState();
    setActiveChain(activeChain);
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

  setAutoConnect(val: boolean): void {
    const { setAutoConnect } = getState();
    setAutoConnect(val);
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
  }

  setIsAutoConnecting(val: boolean): void {
    const { setIsAutoConnecting } = getState();
    setIsAutoConnecting(val);
  }
}
