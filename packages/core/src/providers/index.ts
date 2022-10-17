import { PhantomProvider } from "./phantomProvider";
import SolflareProvider from "./solflareProvider";
import { SolanaProvider } from "./solanaProvider";

interface SolanaWindow extends Window {
    solana?: SolanaProvider;
    solflare?: SolflareProvider;
}

export type {
    PhantomProvider,
    SolanaProvider,
    SolflareProvider,
    SolanaWindow
}