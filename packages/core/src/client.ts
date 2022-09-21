import { providers } from "ethers";
import { EventEmitter } from "eventemitter3";
import { Connector } from "./connectors/base";
import { InjectedConnector } from "./connectors/injected";
import { CustomChainConfig } from "./types";

export const ADAPTER_STATUS = {
    NOT_READY: "not_ready",
    READY: "ready",
    CONNECTING: "connecting",
    CONNECTED: "connected",
    DISCONNECTED: "disconnected",
    ERRORED: "errored",
  } as const;

export type ADAPTER_STATUS_TYPE = typeof ADAPTER_STATUS[keyof typeof ADAPTER_STATUS];

type Provider = providers.BaseProvider & CustomChainConfig[]


export type ClientConfig = {
    chainConfig: Partial<CustomChainConfig> & Pick<CustomChainConfig, "chainNamespace">
    connector: Connector;
    provider: Provider
}

interface IClient {
    chainConfig: Partial<CustomChainConfig> & Pick<CustomChainConfig, "chainNamespace">;
    status: ADAPTER_STATUS_TYPE;
    connector: Connector;
    connect: () => void;
    disconnect(): void;
}

export default class Client extends EventEmitter implements IClient {
    chainConfig: Partial<CustomChainConfig> & Pick<CustomChainConfig, "chainNamespace">
    status: ADAPTER_STATUS_TYPE = 'not_ready';
    connector: Connector;
    provider: Provider;

    constructor({
        chainConfig,
        connector = new InjectedConnector(),
        provider
    }: ClientConfig) {
        super();
        this.chainConfig = chainConfig;
        this.connector = connector;
        this.provider = provider
    }

    connect() {
        this.connector.connect()
    }

    disconnect(): void {
        this.connector.disconnect()
    }
}