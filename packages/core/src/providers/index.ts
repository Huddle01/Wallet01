import { PhantomProvider } from "./phantomProvider";
import SolflareProvider from "./solflareProvider";
import { SolanaProvider } from "./solanaProvider";
import { Keplr as KeplrProvider } from './keplrProvider'

interface SolanaWindow extends Window {
    phantom?: PhantomProvider;
    solflare?: SolflareProvider;
}

export type {
    PhantomProvider,
    SolanaProvider,
    SolflareProvider,
    KeplrProvider,
    SolanaWindow
}