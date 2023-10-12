import {
  AddressNotFoundError,
  BaseConnector,
  ProviderNotFoundError,
  UnknownError,
  WalletNotConnectedError,
} from "@wallet01/core";
import { PhantomProvider } from "../providers/phantomProvider";
import {
  ConnectionResponse,
  MessageSignedResponse,
} from "@wallet01/core/dist/types/methodTypes";
import { SolanaErrorHandler } from "../utils/utils";

interface PhantomWindow extends Window {
  solana?: PhantomProvider;
}

declare const window: PhantomWindow;

export class PhantomConnector extends BaseConnector<PhantomProvider> {
  static #instance: BaseConnector<PhantomProvider>;
  provider!: PhantomProvider;

  private constructor() {
    super("phantom", "solana");
  }

  static init() {
    if (!PhantomConnector.#instance) {
      PhantomConnector.#instance =
        new PhantomConnector() as BaseConnector<PhantomProvider>;
    }
    return PhantomConnector.#instance;
  }

  async getProvider() {
    try {
      if (
        typeof window !== "undefined" &&
        window.solana &&
        window.solana.isPhantom
      ) {
        this.provider = window.solana;
        return this.provider;
      }
      throw new ProviderNotFoundError({ walletName: this.name });
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "getProvider",
      });
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) throw new Error("Provider Undefined");
    try {
      const account = this.provider.publicKey?.toString();
      if (!account) throw new AddressNotFoundError({ walletName: this.name });
      return [account];
    } catch (error) {
      console.error(error);
      throw SolanaErrorHandler(error, "getAccount", this.name);
    }
  }

  async connect(): Promise<ConnectionResponse> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Provider Undefined");
      const { publicKey } = await this.provider.connect();

      this.provider.on("accountChanged", this.onAccountsChanged);
      this.provider.on("disconnect", this.onDisconnect);

      this.emitter.emit(
        "connected",
        publicKey.toString(),
        "mainnet",
        this.name,
        this.ecosystem,
        PhantomConnector.#instance
      );

      return {
        address: publicKey.toString(),
        chainId: "mainnet",
        ecosystem: this.ecosystem,
        walletName: this.name,
        activeConnector: PhantomConnector.#instance,
      };
    } catch (error) {
      console.error(error);
      throw SolanaErrorHandler(error, "connect", this.name);
    }
  }

  async disconnect() {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });
      this.provider.disconnect();

      this.emitter.emit("disconnected", this.name, this.ecosystem);
      return {
        walletName: this.name,
        ecosystem: this.ecosystem,
      };
    } catch (error) {
      console.error(error);
      throw SolanaErrorHandler(error, "disconnect", this.name);
    }
  }

  async signMessage(message: string): Promise<MessageSignedResponse> {
    if (!this.provider)
      throw new WalletNotConnectedError({ walletName: this.name });
    try {
      const encodedMessage = new TextEncoder().encode(message);
      const { signature } = await this.provider.signMessage(
        encodedMessage,
        "utf8"
      );

      this.emitter.emit("messageSigned", signature, PhantomConnector.#instance);

      return {
        signature,
        activeConnector: PhantomConnector.#instance,
      };
    } catch (err) {
      console.error(err);
      throw SolanaErrorHandler(err, "signMessage", this.name);
    }
  }

  protected onAccountsChanged(accounts: string[]): void {
    this.emitter.emit("accountsChanged", accounts, PhantomConnector.#instance);
  }

  protected onDisconnect(error: any): void {
    console.error(error);
    this.emitter.emit("disconnected", this.name, this.ecosystem);
  }
}
