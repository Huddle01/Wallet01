import { InjectedConnector, WalletconnectConnector, CoinbaseConnector } from '@huddle01-wallets/evm'
import { KeplrConnector } from '@huddle01-wallets/cosmos/src'
import { SolflareConnector, PhantomConnector } from '@huddle01-wallets/solana'

export type TConnector = InjectedConnector| WalletconnectConnector | CoinbaseConnector | KeplrConnector | SolflareConnector | PhantomConnector

export type connectorName = "injected" | "walletConnect" | "coinbase" | "keplr" | "solflare" | "phantom"

export type ConnectorObj = {
    [key in connectorName]: (_chainId?: string) => TConnector
}

export type ConnectorInput = connectorName

export const connectorObj: ConnectorObj = {
    "injected": (_chainId?: string) => new InjectedConnector(_chainId),
    "walletConnect": (_chainId?: string) => new WalletconnectConnector(_chainId),
    "coinbase": (_chainId?: string) => new CoinbaseConnector(_chainId),
    "keplr": (_chainId?: string) => new KeplrConnector(_chainId),
    "solflare": (_chainId?: string) => new SolflareConnector(_chainId),
    "phantom": (_chainId?: string) => new PhantomConnector(_chainId) 
}