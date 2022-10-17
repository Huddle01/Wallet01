import { InjectedConnector } from "./EVM/injected";
import { CoinbaseConnector } from './EVM/coinbase'
import { WalletconnectConnector } from "./EVM/walletconnect";
import { PhantomConnector } from "./Non-EVM/phantom";
import { SolflareConnector } from './Non-EVM/solflare'

export {
    InjectedConnector,
    CoinbaseConnector,
    PhantomConnector,
    SolflareConnector,
    WalletconnectConnector
}