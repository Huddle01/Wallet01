import { Wallet } from "./src/wallet";
import { InjectedConnector, CoinbaseConnector } from "./src/connectors";
import {
    type CustomChainConfig,
    type ClientConfig,
    type ConnectedData,
    BaseConnector
} from './src/types'
import { Web3Provider } from '@ethersproject/providers'
import { WalletLinkProvider } from 'walletlink'


export {
    Wallet,
    InjectedConnector,
    type CustomChainConfig,
    type ClientConfig,
    type ConnectedData,
    BaseConnector,
    CoinbaseConnector,
    WalletLinkProvider,
    Web3Provider,
}