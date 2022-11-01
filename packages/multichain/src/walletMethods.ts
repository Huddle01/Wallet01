import { TProvider } from "@huddle01-wallets/core/src";
import { ConnectorInput, connectorObj } from "./types/"

export interface baseMethods {
    connect(chainId: string): Promise<void>;
    disconnect(): Promise<void>;
    getAccount(): Promise<string[]>;
    getChainId(): Promise<string>;
    getProvider(): Promise<TProvider>;
    resolveDid(address: string): Promise<string | null>;
    signMessage(message: string): Promise<void>;
    switchChain?(chainId: string): Promise<void>;
}

export const connect = async (connector: ConnectorInput, chain: string = '1'): Promise<void> => {
    await connectorObj[connector]().connect(chain)
}

export const disconnect = async (connector: ConnectorInput): Promise<void> => {
    await connectorObj[connector]().disconnect()
}

export const getAccount = async (connector: ConnectorInput): Promise<string[]> => {
    const accounts = await connectorObj[connector]().getAccount()
    return accounts
}

export const getChainId = async (connector : ConnectorInput): Promise<string> => {
    const chainId = await connectorObj[connector]().getChainId()
    return chainId
}

// export const getProvider = async (connector : ConnectorInput): Promise<TProvider> => {
//     const provider = await connectorObj[connector]().getProvider()
//     return provider
// }

export const resolveDid = async (connector: ConnectorInput ,address : string): Promise<string | null> => {
    const did = await connectorObj[connector]().resolveDid(address)
    return did
}

export const signMessage = async (connector : ConnectorInput, message: string): Promise<void> => {
    await connectorObj[connector]().signMessage(message)
}

export const switchChain = async (connector : ConnectorInput, chainId: string): Promise<void> => {
    await connectorObj[connector]().switchChain(chainId)
}