import { hexValue, toUtf8Bytes, hexlify } from "ethers/lib/utils.js";
import { Web3Provider } from "@ethersproject/providers";

import {
  BaseConnector,
  ProviderNotFoundError,
  UnknownError,
  UnrecognisedChainError,
  UserRejectedRequestError,
} from "@wallet01/core";

import {
  AddChainParameter,
  ChainSwitchResponse,
} from "@wallet01/core/dist/types/methodTypes";

interface OkxWalletWindow extends Window {
  okxwallet?: any;
}

declare const window: OkxWalletWindow;

export class OkxWalletConnector extends BaseConnector<Web3Provider> {
  static #instance: BaseConnector<Web3Provider>;
  provider!: Web3Provider;

  private constructor() {
    super("okxwallet", "ethereum");
  }

  static init() {
    if (!OkxWalletConnector.#instance) {
      OkxWalletConnector.#instance =
        new OkxWalletConnector() as BaseConnector<Web3Provider>;
    }
    return OkxWalletConnector.#instance;
  }

  async getProvider() {
    try {
      const windowProvider = window.okxwallet;

      if (!windowProvider)
        throw new ProviderNotFoundError({ walletName: this.name });

      const provider = new Web3Provider(windowProvider);
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
      const hexChainId = hexValue(Number(chainId));
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

      this.emitter.emit(
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

      this.provider.on("accountsChanged", this._onAccountsChanged);
      this.provider.on("disconnect", this._onDisconnect);
      this.provider.on("chainChanged", this._onChainChanged);

      const currentId = await this.getChainId();
      if (options?.chainId && currentId !== options.chainId) {
        await this.switchChain(options.chainId);
      }

      const address = await this.getAccount();

      this.emitter.emit(
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
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      this.provider.removeListener("accountsChanged", this._onAccountsChanged);
      this.provider.removeListener("chainChanged", this._onChainChanged);
      this.provider.removeListener("disconnect", this._onDisconnect);

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

      this.emitter.emit(
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

  protected _onAccountsChanged = (accounts: string[]) => {
    this.emitter.emit(
      "accountsChanged",
      accounts,
      OkxWalletConnector.#instance
    );
  };

  protected _onChainChanged = (hexChainId: string) => {
    const chainId = parseInt(hexChainId, 16).toString();
    this.emitter.emit("chainChanged", chainId, OkxWalletConnector.#instance);
  };

  protected _onDisconnect = (error: any) => {
    console.error({
      error,
    });
    this.emitter.emit("disconnected", this.name, this.ecosystem);
  };
}
