import {
  AddressNotFoundError,
  BaseConnector,
  ProviderNotFoundError,
  WalletNotConnectedError,
} from "@wallet01/core";

import SolflareProvider from "@solflare-wallet/sdk";
import { SolanaErrorHandler } from "../utils/utils";
import {
  ConnectionResponse,
  DisconnectionResponse,
  MessageSignedResponse,
} from "@wallet01/core/dist/types/methodTypes";
import { WalletNotInstalledError } from "@wallet01/core";

export class SolflareConnector extends BaseConnector<SolflareProvider> {
  static #instance: BaseConnector<SolflareProvider>;
  provider!: SolflareProvider;

  private constructor() {
    super("solflare", "solana");
  }

  static init() {
    if (!SolflareConnector.#instance) {
      SolflareConnector.#instance =
        new SolflareConnector() as BaseConnector<SolflareProvider>;
    }
    return SolflareConnector.#instance;
  }

  async getProvider(): Promise<SolflareProvider> {
    try {
      const provider = new SolflareProvider();
      const isWalletInstalled = await provider.detectWallet();
      if (!isWalletInstalled)
        throw new WalletNotInstalledError({ walletName: this.name });
      this.provider = provider;
      return this.provider;
    } catch (error) {
      console.error(error);
      throw SolanaErrorHandler(error, "getProvider", this.name);
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider)
      throw new WalletNotConnectedError({ walletName: this.name });
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
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      await this.provider.connect();

      this.provider.on("accountChanged", this.onAccountsChanged);
      this.provider.on("disconnect", this.onDisconnect);

      const address = this.provider.publicKey?.toString()!;
      const chainId = "mainnet";

      this.emitter.emit(
        "connected",
        address,
        chainId,
        this.name,
        this.ecosystem,
        SolflareConnector.#instance
      );

      return {
        address,
        chainId,
        ecosystem: this.ecosystem,
        walletName: this.name,
        activeConnector: SolflareConnector.#instance,
      };
    } catch (error) {
      console.error(error);
      throw SolanaErrorHandler(error, "connect", this.name);
    }
  }

  async disconnect(): Promise<DisconnectionResponse> {
    if (!this.provider)
      throw new WalletNotConnectedError({ walletName: this.name });
    try {
      this.provider.disconnect();

      this.provider.removeListener("accountChanged", this.onAccountsChanged);
      this.provider.removeListener("disconnect", this.onDisconnect);

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
      const signature = await this.provider.signMessage(encodedMessage, "utf8");

      this.emitter.emit(
        "messageSigned",
        signature,
        SolflareConnector.#instance
      );

      return {
        signature,
        activeConnector: SolflareConnector.#instance,
      };
    } catch (err) {
      console.error(err);
      throw SolanaErrorHandler(err, "signMessage", this.name);
    }
  }

  protected onAccountsChanged(address: string): void {
    this.emitter.emit(
      "accountsChanged",
      [address],
      SolflareConnector.#instance
    );
  }

  protected onDisconnect(): void {
    this.emitter.emit("disconnected", this.name, this.ecosystem);
  }
}
