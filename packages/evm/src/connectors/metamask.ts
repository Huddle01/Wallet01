import {
  BaseConnector,
  ProviderNotFoundError,
  UnknownError,
  UnrecognisedChainError,
  UserRejectedRequestError,
} from "@wallet01/core";
import { Web3Provider } from "@ethersproject/providers";
import {
  AddChainParameter,
  ChainSwitchResponse,
} from "@wallet01/core/dist/types/methodTypes";
import { hexValue, hexlify, toUtf8Bytes } from "ethers/lib/utils.js";
import { ProviderRpcError } from "@walletconnect/ethereum-provider/dist/types/types";

export class MetamaskConnector extends BaseConnector<Web3Provider> {
  static #instance: BaseConnector<Web3Provider>;
  provider!: Web3Provider;

  protected constructor() {
    super("metamask", "ethereum");
  }

  static init() {
    if (!MetamaskConnector.#instance) {
      MetamaskConnector.#instance =
        new MetamaskConnector() as BaseConnector<Web3Provider>;
    }
    return MetamaskConnector.#instance;
  }

  async getProvider() {
    try {
      if (this.provider) return this.provider;

      const windowProvider = this.getReady(window.ethereum);

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
        MetamaskConnector.#instance
      );

      return {
        fromChainId: oldChainId,
        toChainId: chainId,
        activeConnector: MetamaskConnector.#instance,
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
        MetamaskConnector.#instance
      );

      return {
        address: address[0]!,
        walletName: this.name,
        chainId: currentId,
        ecosystem: this.ecosystem,
        activeConnector: MetamaskConnector.#instance,
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
        MetamaskConnector.#instance
      );

      return {
        signature: response as string,
        activeConnector: MetamaskConnector.#instance,
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
    this.emitter.emit("accountsChanged", accounts, MetamaskConnector.#instance);
  };

  protected _onChainChanged = (hexChainId: string) => {
    const chainId = parseInt(hexChainId, 16).toString();
    this.emitter.emit("chainChanged", chainId, MetamaskConnector.#instance);
  };

  protected _onDisconnect = (error: any) => {
    console.error({
      error,
    });
    this.emitter.emit("disconnected", this.name, this.ecosystem);
  };

  private getReady(ethereum?: any) {
    const isMetaMask = !!ethereum?.isMetaMask;
    if (!isMetaMask) return;
    // Brave tries to make itself look like MetaMask
    // Could also try RPC `web3_clientVersion` if following is unreliable
    if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) return;
    if (ethereum.isApexWallet) return;
    if (ethereum.isAvalanche) return;
    if (ethereum.isBitKeep) return;
    if (ethereum.isBlockWallet) return;
    if (ethereum.isCoin98) return;
    if (ethereum.isFordefi) return;
    if (ethereum.isMathWallet) return;
    if (ethereum.isOkxWallet || ethereum.isOKExWallet) return;
    if (ethereum.isOneInchIOSWallet || ethereum.isOneInchAndroidWallet) return;
    if (ethereum.isOpera) return;
    if (ethereum.isPortal) return;
    if (ethereum.isRabby) return;
    if (ethereum.isDefiant) return;
    if (ethereum.isTokenPocket) return;
    if (ethereum.isTokenary) return;
    if (ethereum.isZeal) return;
    if (ethereum.isZerion) return;
    return ethereum;
  }
}
