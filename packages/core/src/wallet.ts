import EventEmitter from "eventemitter3";

import { Web3Provider } from '@ethersproject/providers';


import { ClientConfig, ConnectedData, CustomChainConfig } from "./types";
import { BaseConnector } from "./types/ConnectorTypes";
import emitter from "./utils/emiter";

export abstract class Wallet{

    readonly chainConfig: CustomChainConfig;
    abstract provider: Web3Provider | null;
    abstract account: string;
    abstract did: string | null;
    readonly connector: BaseConnector;
    chainId: string;

    constructor({ chainConfig, connector }: ClientConfig) {
        this.chainConfig = chainConfig;
        this.connector = connector
        this.chainId = chainConfig.chainId;
        
        if ( emitter ) {
            emitter.on('connected', (data) => {
                this.provider = data.provider
                this.account = data.account
            })
        }
    }

    async getProvider() {
        const provider = await this.connector.getProvider()
        this.provider = provider
        return provider;
    }

    async getAccount() {
        const accounts = await this.connector.getAccount()
        this.account = accounts[0]
        return this.account
    }

    async connect() {
        await this.connector.connect(this.chainId);
    }

    async disconnect() {
        this.account = '';
        this.did = ''
        this.provider = null;
    }

    async getDid() {
        const did = await this.connector.resolveDid(this.account);
        this.did = did;
        return did;
    }

    async signMessage(message: string) {
        await this.signMessage(message);
    }
}