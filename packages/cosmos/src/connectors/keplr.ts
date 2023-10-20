import { Window as KeplrWindow } from "@keplr-wallet/types";
import { KeplrProvider } from "../providers/keplrProvider";
import {
  BaseConnector,
  ProviderNotFoundError,
  UnknownError,
} from "@wallet01/core";
import { AddressNotFoundError } from "../utils/errors";
import {
  ChainSwitchResponse,
  ConnectionResponse,
  MessageSignedResponse,
} from "@wallet01/core/dist/types/methodTypes";

declare const window: KeplrWindow;

export class KeplrConnector extends BaseConnector<KeplrProvider> {
  static #instance: BaseConnector<KeplrProvider>;
  provider!: KeplrProvider;
  private chain = "secret-4";

  private constructor(chainId?: string) {
    super("keplr", "cosmos");
    if (chainId) this.chain = chainId;
  }

  static init(chainId?: string) {
    if (!KeplrConnector.#instance) {
      KeplrConnector.#instance = new KeplrConnector(
        chainId
      ) as BaseConnector<KeplrProvider>;
    }
    return KeplrConnector.#instance;
  }

  async getProvider() {
    try {
      if (typeof window !== "undefined" && window.keplr) {
        this.provider = window.keplr;
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

  async getAccount() {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      await this.provider.enable(this.chain);
      const { bech32Address } = await this.provider.getKey(this.chain);
      return [bech32Address];
    } catch (error) {
      console.error({ error });
      throw new UnknownError({
        walletName: this.name,
        atFunction: "getAccount",
      });
    }
  }

  async getChainId(): Promise<string> {
    return this.chain;
  }

  async switchChain(chainId: string): Promise<ChainSwitchResponse> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      const fromChainId = await this.getChainId();

      const toChainId = chainId;

      await this.provider.disable();

      await this.provider.enable(toChainId);
      this.chain = toChainId;

      this.emitter.emit(
        "switchingChain",
        fromChainId,
        toChainId,
        KeplrConnector.#instance
      );

      return {
        fromChainId,
        toChainId,
        activeConnector: KeplrConnector.#instance,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async connect(
    options?: { chainId: string } | undefined
  ): Promise<ConnectionResponse> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      if (options?.chainId) {
        await this.switchChain(options.chainId);
        this.chain = options.chainId;
      } else {
        await this.provider.enable(this.chain);
      }

      const { bech32Address } = await this.provider.getKey(this.chain);

      this.emitter.emit(
        "connected",
        bech32Address,
        this.chain,
        this.name,
        this.ecosystem,
        KeplrConnector.#instance
      );

      return {
        activeConnector: KeplrConnector.#instance,
        address: bech32Address,
        chainId: this.chain,
        ecosystem: this.ecosystem,
        walletName: this.name,
      };
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "connect",
      });
    }
  }

  async disconnect() {
    if (!this.provider) await this.getProvider();
    try {
      await this.provider.disable();
      this.emitter.emit("disconnected", this.name, this.ecosystem);
      return {
        walletName: this.name,
        ecosystem: this.ecosystem,
      };
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "disconnect",
      });
    }
  }

  async signMessage(message: string): Promise<MessageSignedResponse> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });
      const address = (await this.getAccount())[0];

      if (!address) throw new AddressNotFoundError({ walletName: this.name });

      const { signature } = await this.provider.signArbitrary(
        this.chain,
        address,
        message
      );

      this.emitter.emit("messageSigned", signature, KeplrConnector.#instance);

      return {
        signature,
        activeConnector: KeplrConnector.#instance,
      };
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "signMessage",
      });
    }
  }
}
