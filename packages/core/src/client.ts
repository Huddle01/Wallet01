import { providers } from "ethers";
import {  Web3Provider } from '@ethersproject/providers';
import { Connector } from "./connectors/base";
import { InjectedConnector } from "./connectors/injected";
import { CustomChainConfig } from "./types";

// const ADAPTER_STATUS = {
//     NOT_READY: "not_ready",
//     READY: "ready",
//     CONNECTING: "connecting",
//     CONNECTED: "connected",
//     DISCONNECTED: "disconnected",
//     ERRORED: "errored",
// } as const;

// type ADAPTER_STATUS_TYPE = typeof ADAPTER_STATUS[keyof typeof ADAPTER_STATUS];

type Provider = providers.BaseProvider & CustomChainConfig[]

const defaultChainConfig: CustomChainConfig = {
    chainNamespace: 'eip155',
    chainId: 1,
    displayName: 'ethereum',
    ticker: 'ETH',
    tickerName: 'Ethereum'

}

export type ClientConfig = {
    chainConfig: Partial<CustomChainConfig> & Pick<CustomChainConfig, "chainNamespace">
    connector: Connector;
    provider?: Web3Provider | undefined
}

interface IClient {
    chainConfig: Partial<CustomChainConfig> & Pick<CustomChainConfig, "chainNamespace">;
    // status: ADAPTER_STATUS_TYPE;
    connector: Connector;
    connect: (chainId: number) => void;
    disconnect(): void;
    resolveDid(address: string): Promise<string>;
    getAccount(): Promise<string>;
    signMessage(message: string): Promise<void>;
}

export default class Client implements IClient {
    chainConfig: Partial<CustomChainConfig> & Pick<CustomChainConfig, "chainNamespace">
    // status: ADAPTER_STATUS_TYPE = 'not_ready';
    connector: Connector;
    provider: Web3Provider | undefined;

    constructor({
        chainConfig,
        connector
        // provider
    }: ClientConfig) {
        this.chainConfig = chainConfig;
        this.connector = connector;
    }

    async getAccount(): Promise<string> {
        const accounts = await this.connector.getAccount()
        if (!accounts[0]) throw new Error('No Accounts Found!')
        return accounts[0]
    }

    async connect(chainId: number) {
        // this.provider = await this.connector.getProvider()
        this.connector.connect(chainId)
        // this.status = 'connected'
    }

    disconnect() {
        this.connector.disconnect()
        // this.status = 'disconnected'
    }

    async resolveDid(address: string) {
        const did = await this.connector.resolveDid(address)
        if (!did) throw new Error('No DID Found!')
        return did
    }

    async signMessage(message: string): Promise<void> {
        await this.connector.signMessage(message)
    }

    getChainId () {
        return this.chainConfig.chainId;
    }
}