import { Wallet } from "./src/wallet";
import { InjectedConnector, CoinbaseConnector, PhantomConnector } from "./src/connectors";
import {
    type CustomChainConfig,
    type ClientConfig,
    type ConnectedData,
    PhantomProvider,
    BaseConnector
} from './src/types'
import { Web3Provider } from '@ethersproject/providers'
import { WalletLinkProvider } from 'walletlink'
import WalletConnectProvider from "@walletconnect/ethereum-provider";


export {
    Wallet,
    InjectedConnector,
    type CustomChainConfig,
    type ClientConfig,
    type ConnectedData,
    BaseConnector,
    CoinbaseConnector,
    WalletLinkProvider,
    PhantomConnector,
    Web3Provider,
    type PhantomProvider,
    WalletConnectProvider
}