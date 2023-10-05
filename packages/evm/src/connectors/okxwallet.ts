import { toQuantity, BrowserProvider, hexlify, toUtf8Bytes } from "ethers";

import {
  BaseConnector,
  ProviderNotFoundError,
  UnknownError,
  UserRejectedRequestError,
} from "@wallet01/core";

import {
  AddChainParameter,
  ChainSwitchResponse,
} from "@wallet01/core/dist/types/methodTypes";
import { UnrecognisedChainError } from "../utils/errors";

interface OkxWalletWindow extends Window {
  okxwallet?: any;
}

declare const window: OkxWalletWindow;

export class OkxWalletConnector extends BaseConnector<BrowserProvider> {
  static #instance: BaseConnector<BrowserProvider>;
  provider!: BrowserProvider;

  constructor() {
    super("okxwallet", "ethereum");
  }

  static getInstance() {
    return this.#instance;
  }

  init() {
    if (!OkxWalletConnector.#instance) {
      OkxWalletConnector.#instance =
        new OkxWalletConnector() as BaseConnector<BrowserProvider>;
    }
    return OkxWalletConnector.#instance;
  }

  async getProvider() {
    try {
      const windowProvider = window.okxwallet;

      if (!windowProvider)
        throw new ProviderNotFoundError({ walletName: this.name });

      const provider = new BrowserProvider(windowProvider);
      this.provider = provider;
      return this.provider;
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "getProvider",
      });
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      const accounts = (await this.provider.send(
        "eth_requestAccounts",
        []
      )) as string[];

      return accounts;
    } catch (err) {
      console.error(err);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "getAccount",
      });
    }
  }

  async getChainId(): Promise<string> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      const id = (await this.provider.send("eth_chainId", [])) as string;

      const chainId = parseInt(id, 16).toString();
      return chainId;
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "getChainId",
      });
    }
  }

  async switchChain(
    chainId: string,
    options?: AddChainParameter | undefined
  ): Promise<ChainSwitchResponse> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      const oldChainId = await this.getChainId();
      const hexChainId = toQuantity(Number(chainId));
      const params = [{ chainId: hexChainId }];

      const response = await this.provider.send(
        "wallet_switchEthereumChain",
        params
      );

      if ((response as any).code === 4902) {
        if (!options) {
          throw new UnrecognisedChainError({ walletName: this.name, chainId });
        }

        await this.provider.send("wallet_addEthereumChain", [options]);
      }

      this.emit(
        "switchingChain",
        oldChainId,
        chainId,
        OkxWalletConnector.#instance
      );

      return {
        fromChainId: oldChainId,
        toChainId: chainId,
        activeConnector: OkxWalletConnector.#instance,
      };
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "switchChain",
      });
    }
  }

  async connect(options?: { chainId: string }) {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      const response = await this.provider.send("eth_requestAccounts", []);

      if ((response as any).code === 4001) {
        throw new UserRejectedRequestError();
      }

      this.provider.on("accountsChanged", this.onAccountsChanged);
      this.provider.on("disconnect", this.onDisconnect);
      this.provider.on("chainChanged", this.onChainChanged);

      const currentId = await this.getChainId();
      if (options?.chainId && currentId !== options.chainId) {
        await this.switchChain(options.chainId);
      }

      const address = await this.getAccount();

      this.emit(
        "connected",
        address[0]!,
        await this.getChainId(),
        this.name,
        this.ecosystem,
        OkxWalletConnector.#instance
      );

      return {
        address: address[0]!,
        walletName: this.name,
        chainId: await this.getChainId(),
        ecosystem: this.ecosystem,
        activeConnector: OkxWalletConnector.#instance,
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
      await this.provider.destroy();
      this.emit("disconnected", this.name, this.ecosystem);
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

  async signMessage(message: string) {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });
      const address = await this.getAccount();

      const hexMessage = hexlify(toUtf8Bytes(message));

      const response = await this.provider.send("personal_sign", [
        hexMessage,
        address[0],
      ]);

      if ((response as any).code === 4001) {
        throw new UserRejectedRequestError();
      }

      this.emit(
        "messageSigned",
        response as string,
        OkxWalletConnector.#instance
      );

      return {
        signature: response as string,
        activeConnector: OkxWalletConnector.#instance,
      };
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "signMessage",
      });
    }
  }

  protected onAccountsChanged(accounts: string[]): void {
    this.emit("accountsChanged", accounts, OkxWalletConnector.#instance);
  }

  protected onChainChanged(hexChainId: string): void {
    const chainId = parseInt(hexChainId, 16).toString();
    this.emit("chainChanged", chainId, OkxWalletConnector.#instance);
  }

  protected onDisconnect(error: any): void {
    console.error({
      error,
    });
    this.emit("disconnected", this.name, this.ecosystem);
  }
}
