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
import { ProviderRpcError } from "@walletconnect/ethereum-provider/dist/types/types";

export class InjectedConnector extends BaseConnector<Web3Provider> {
  static #instance: BaseConnector<Web3Provider>;
  provider!: Web3Provider;

  private constructor() {
    super("injected", "ethereum");
  }

  static init() {
    if (!InjectedConnector.#instance) {
      InjectedConnector.#instance =
        new InjectedConnector() as BaseConnector<Web3Provider>;
    }
    return InjectedConnector.#instance;
  }

  async getProvider() {
    try {
      if (this.provider) return this.provider;

      const windowProvider = window.ethereum;

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

      try {
        await this.provider.send("wallet_switchEthereumChain", params);
      } catch (error) {
        if (
          (error as ProviderRpcError).code &&
          (error as ProviderRpcError).code === 4902
        ) {
          if (!options) {
            throw new UnrecognisedChainError({
              walletName: this.name,
              chainId,
            });
          }

          await this.provider.send("wallet_addEthereumChain", [options]);
        }
      }

      this.emitter.emit(
        "switchingChain",
        oldChainId,
        chainId,
        InjectedConnector.#instance
      );

      return {
        fromChainId: oldChainId,
        toChainId: chainId,
        activeConnector: InjectedConnector.#instance,
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

      window.ethereum.on("accountsChanged", this._onAccountsChanged);
      window.ethereum.on("disconnect", this._onDisconnect);
      window.ethereum.on("chainChanged", this._onChainChanged);

      const currentId = await this.getChainId();
      if (options?.chainId && currentId !== options.chainId) {
        await this.switchChain(options.chainId);
      }

      const address = await this.getAccount();

      this.emitter.emit(
        "connected",
        address[0]!,
        currentId,
        this.name,
        this.ecosystem,
        InjectedConnector.#instance
      );

      return {
        address: address[0]!,
        walletName: this.name,
        chainId: currentId,
        ecosystem: this.ecosystem,
        activeConnector: InjectedConnector.#instance,
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

      window.ethereum.removeListener(
        "accountsChanged",
        this._onAccountsChanged
      );
      window.ethereum.removeListener("chainChanged", this._onChainChanged);
      window.ethereum.removeListener("disconnect", this._onDisconnect);

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
        InjectedConnector.#instance
      );

      return {
        signature: response as string,
        activeConnector: InjectedConnector.#instance,
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
    this.emitter.emit("accountsChanged", accounts, InjectedConnector.#instance);
  };

  protected _onChainChanged = (hexChainId: string) => {
    const chainId = parseInt(hexChainId, 16).toString();
    this.emitter.emit("chainChanged", chainId, InjectedConnector.#instance);
  };

  protected _onDisconnect = (error: any) => {
    console.error({
      error,
    });
    this.emitter.emit("disconnected", this.name, this.ecosystem);
  };
}
