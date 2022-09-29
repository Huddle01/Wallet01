import { providers } from "ethers";
import { EventEmitter } from "eventemitter3";
import { Connector, ConnectorData } from "./connectors/base";
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
    connect: (chainId: number) => void;
    disconnect(): void;
    resolveDid(): Promise<string>;
    getAccount(): Promise<string>;
    signTxn(): Promise<void>;
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
        this.provider = provider;
    }

    async getAccount(): Promise<string> {
        const account = await this.connector.getAccount()
        return account[0]
    }

    connect(chainId: number) {
        this.connector.connect(chainId)
        this.status = 'connected'
    }

    disconnect() {
        this.connector.disconnect()
        this.status = 'disconnected'
    }

    async resolveDid() {
        const did = await this.connector.resolveDid()
        return did
    }

    async signTxn(): Promise<void> {
        await this.connector.signTxn('')
    }

    getChainId () {
        return this.chainConfig.chainId;
    }
}