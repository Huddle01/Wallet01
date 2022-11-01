import { TProvider } from '@huddle01-wallets/core/src'
import { BaseConnector } from '@huddle01-wallets/cosmos/src/types'
import { InjectedConnector, WalletconnectConnector, CoinbaseConnector } from '@huddle01-wallets/evm'
import { KeplrConnector } from '@huddle01-wallets/cosmos/src'
import { SolflareConnector, PhantomConnector } from '@huddle01-wallets/solana'

export type TConnector = InjectedConnector
    | WalletconnectConnector
    | CoinbaseConnector
    | KeplrConnector
    | SolflareConnector
    | PhantomConnector

export type connectorName = "injected" | "walletConnect" | "coinbase" | "keplr" | "solflare" | "phantom"

export type ConnectorObj = {
    [key in connectorName]: () => TConnector
}

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

export type ConnectorMethods = keyof BaseConnector<TProvider>

export type ConnectorInput = connectorName

export const connectorObj: ConnectorObj = {
    "injected": () => {
        const connector = new InjectedConnector()
        return connector;
    },
    "walletConnect": () => {
        const connector = new WalletconnectConnector()
        return connector
    },
    "coinbase": () => {
        const connector = new CoinbaseConnector()
        return connector;
    },
    "keplr": () => {
        const connector = new KeplrConnector()
        return connector
    },
    "solflare": () => {
        const connector = new SolflareConnector()
        return connector
    },
    "phantom": () => {
        const connector = new PhantomConnector()
        return connector
    }
}