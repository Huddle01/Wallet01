import { PublicKey } from "@solana/web3.js";

type DisplayEncoding = "utf8" | "hex";
interface ConnectOpts {
  onlyIfTrusted: boolean;
}

type PhantomEvent = "connect" | "disconnect" | "accountChanged";

type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signAndSendTransaction"
  | "signAndSendTransactionV0"
  | "signAndSendTransactionV0WithLookupTable"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

export interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  isPhantom?: boolean;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<{
    signature: Uint8Array;
    publicKey: PublicKey;
  }>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}
