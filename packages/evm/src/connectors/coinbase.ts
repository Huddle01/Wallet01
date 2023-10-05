import {
  BaseConnector,
  ProviderNotFoundError,
  UnknownError,
  UserRejectedRequestError,
} from "@wallet01/core";
import { CoinbaseWalletProvider } from "@coinbase/wallet-sdk";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { hexValue, hexlify, toUtf8Bytes } from "ethers/lib/utils.js";
import { CoinbaseWalletSDKOptions } from "@coinbase/wallet-sdk/dist/CoinbaseWalletSDK";
import { UnrecognisedChainError } from "../utils/errors";
import { AddChainParameter } from "@wallet01/core/dist/types/methodTypes";
export class CoinbaseConnector extends BaseConnector<CoinbaseWalletProvider> {
  static #instance: BaseConnector<CoinbaseWalletProvider>;
  provider!: CoinbaseWalletProvider;
  static options: CoinbaseWalletSDKOptions;

  constructor(options: CoinbaseWalletSDKOptions) {
    super("coinbase", "ethereum");
    CoinbaseConnector.options = options;
  }

  init() {
    if (!CoinbaseConnector.#instance) {
      CoinbaseConnector.#instance = new CoinbaseConnector(
        CoinbaseConnector.options
      ) as BaseConnector<CoinbaseWalletProvider>;
    }
    return CoinbaseConnector.#instance;
  }

  static getInstance(options: CoinbaseWalletSDKOptions) {
    this.options = options;
    return CoinbaseConnector.#instance;
  }

  async getProvider(): Promise<CoinbaseWalletProvider> {
    try {
      if (this.provider) return this.provider;
      const provider = new CoinbaseWalletSDK(
        CoinbaseConnector.options
      ).makeWeb3Provider();
      this.provider = provider;
      return this.provider;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      const result = (await this.provider.request({
        method: "eth_requestAccounts",
      })) as string[];

      return result;
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "getAccount",
      });
    }
  }

  async getChainId() {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      const id = (await this.provider.request({
        method: "eth_chainId",
      })) as string;

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

  async switchChain(chainId: string, options?: AddChainParameter | undefined) {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      const oldChainId = await this.getChainId();
      const hexChainId = hexValue(Number(chainId));
      const params = [{ chainId: hexChainId }];

      const response = await this.provider.request({
        method: "wallet_switchEthereumChain",
        params,
      });

      if ((response as any).code === 4902) {
        if (!options) {
          throw new UnrecognisedChainError({ walletName: this.name, chainId });
        }

        await this.provider.request({
          method: "wallet_addEthereumChain",
          params: [options],
        });
      }

      this.emit("switchingChain", oldChainId, chainId, this);

      return {
        fromChainId: oldChainId,
        toChainId: chainId,
        activeConnector: CoinbaseConnector.#instance,
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

      const response = await this.provider.request({
        method: "eth_requestAccounts",
      });

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
        currentId,
        this.name,
        this.ecosystem,
        CoinbaseConnector.#instance
      );

      return {
        address: address[0]!,
        walletName: this.name,
        ecosystem: this.ecosystem,
        activeConnector: CoinbaseConnector.#instance,
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
      await this.provider.disconnect();
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

      const response = await this.provider.request({
        method: "personal_sign",
        params: [hexMessage, address[0]],
      });

      if ((response as any).code === 4001) {
        throw new UserRejectedRequestError();
      }

      this.emit(
        "messageSigned",
        response as string,
        CoinbaseConnector.#instance
      );

      return {
        signature: response as string,
        activeConnector: CoinbaseConnector.getInstance(
          CoinbaseConnector.options
        ),
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
    this.emit("accountsChanged", accounts, CoinbaseConnector.#instance);
  }

  protected onChainChanged(hexChainId: string): void {
    const chainId = parseInt(hexChainId, 16).toString();
    this.emit("chainChanged", chainId, CoinbaseConnector.#instance);
  }

  protected onDisconnect(error: any): void {
    console.error({
      error,
    });
    this.emit("disconnected", this.name, this.ecosystem);
  }
}
