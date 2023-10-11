import { hexlify, toQuantity, toUtf8Bytes } from "ethers";

import {
  BaseConnector,
  ProviderNotFoundError,
  UnknownError,
  UserRejectedRequestError,
} from "@wallet01/core";

import EthereumProvider, {
  OPTIONAL_METHODS,
  REQUIRED_METHODS,
} from "@walletconnect/ethereum-provider";
import { EthereumProviderOptions } from "@walletconnect/ethereum-provider/dist/types/EthereumProvider";

import {
  AddChainParameter,
  ChainSwitchResponse,
  ConnectionResponse,
  DisconnectionResponse,
} from "@wallet01/core/dist/types/methodTypes";

type WalletconnectConnectorOptions = EthereumProviderOptions;

const NAMESPACE = "eip155";
const ADD_ETH_CHAIN_METHOD = "wallet_addEthereumChain";

export class WalletconnectConnector extends BaseConnector<EthereumProvider> {
  static #instance: BaseConnector<EthereumProvider>;
  provider!: EthereumProvider;
  static options: EthereumProviderOptions;

  constructor({ chains, projectId, ...params }: WalletconnectConnectorOptions) {
    super("walletconnect", "ethereum");
    console.log(this.emitter);
    WalletconnectConnector.options = {
      chains,
      projectId,
      optionalChains: params.optionalChains ?? [],
      methods: params.methods ?? REQUIRED_METHODS,
      optionalMethods: params.optionalMethods ?? OPTIONAL_METHODS,
      ...params,
    };
  }

  static init(options: WalletconnectConnectorOptions) {
    if (!WalletconnectConnector.#instance) {
      WalletconnectConnector.#instance = new WalletconnectConnector(
        options
      ) as BaseConnector<EthereumProvider>;
    }
    return WalletconnectConnector.#instance;
  }

  async getProvider(): Promise<EthereumProvider> {
    try {
      const provider = await EthereumProvider.init(
        WalletconnectConnector.options
      );

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
      if (!this.provider) throw new Error("Wallet Not Installed");
      const result = await this.provider.accounts;
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

      const result = await this.provider.chainId.toString();
      return result;
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
      const namespaceChains = this.getNamespaceChainsIds();
      const namespaceMethods = this.getNamespaceMethods();
      const isChainApproved = namespaceChains.includes(chainId);

      if (!isChainApproved && namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
        if (!namespaceMethods.includes(ADD_ETH_CHAIN_METHOD))
          throw new Error(
            `${ADD_ETH_CHAIN_METHOD} method was not passed in the options object`
          );
        if (!options)
          throw new Error(
            `Given chainId ${chainId} is not approved and no options object was passed to add the chain`
          );
        await this.provider.request({
          method: ADD_ETH_CHAIN_METHOD,
          params: [options],
        });
      }

      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });

      this.emitter.emit(
        "switchingChain",
        oldChainId,
        chainId,
        WalletconnectConnector.#instance
      );

      return {
        fromChainId: oldChainId,
        toChainId: chainId,
        activeConnector: WalletconnectConnector.#instance,
      };
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "switchChain",
      });
    }
  }

  async connect(options?: { chainId: string }): Promise<ConnectionResponse> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });
      const isStaleChain = await this.isChainsStale();

      if (this.provider.session && isStaleChain)
        await this.provider.disconnect();

      if (!this.provider.session || isStaleChain) {
        const chainIdToConnect = Number(options?.chainId || 1);
        await this.provider.connect({
          chains: [chainIdToConnect],
          optionalChains: WalletconnectConnector.options.optionalChains,
        });
      } else {
        await this.provider.enable();
        if (options?.chainId && (await this.getChainId()) !== options.chainId) {
          await this.switchChain(options.chainId);
        }
      }

      const accounts = this.provider.accounts;
      const currentChainId = await this.getChainId();

      this.provider.on("disconnect", this.onDisconnect);
      this.provider.on("accountsChanged", this.onAccountsChanged);
      this.provider.on("chainChanged", hexChainId => {
        const chainId = parseInt(hexChainId, 16).toString();

        this.emitter.emit(
          "chainChanged",
          chainId,
          WalletconnectConnector.#instance
        );
      });

      this.emitter.emit(
        "connected",
        accounts[0]!,
        currentChainId,
        this.name,
        "ethereum",
        WalletconnectConnector.#instance
      );
      return {
        address: accounts[0]!,
        chainId: currentChainId,
        walletName: this.name,
        ecosystem: "ethereum",
        activeConnector: WalletconnectConnector.#instance,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async disconnect(): Promise<DisconnectionResponse> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });
      await this.provider.disconnect();

      this.emitter.emit("disconnected", this.name, "ethereum");
      return {
        walletName: this.name,
        ecosystem: "ethereum",
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

      this.emitter.emit(
        "messageSigned",
        response as string,
        WalletconnectConnector.#instance
      );

      return {
        signature: response as string,
        activeConnector: WalletconnectConnector.#instance,
      };
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "signMessage",
      });
    }
  }

  private getNamespaceChainsIds() {
    if (!this.provider) return [];
    const chainIds = this.provider.session?.namespaces[NAMESPACE]?.chains?.map(
      chain => chain.split(":")[1] || ""
    );
    return chainIds ?? [];
  }

  private getNamespaceMethods() {
    if (!this.provider) return [];
    const methods = this.provider.session?.namespaces[NAMESPACE]?.methods;
    return methods ?? [];
  }

  private async isChainsStale() {
    const namespaceMethods = this.getNamespaceMethods();
    if (namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) return false;

    const connectorChains = await this.getChainId();
    const namespaceChains = this.getNamespaceChainsIds();

    if (
      namespaceChains.length &&
      !namespaceChains.some(async id => id === (await this.getChainId()))
    )
      return false;

    return !connectorChains.includes(await this.getChainId());
  }

  protected onAccountsChanged(accounts: string[]): void {
    this.emitter.emit(
      "accountsChanged",
      accounts,
      WalletconnectConnector.#instance
    );
  }

  protected onChainChanged(hexChainId: string): void {
    const chainId = parseInt(hexChainId, 16).toString();
    this.emitter.emit(
      "chainChanged",
      chainId,
      WalletconnectConnector.#instance
    );
  }

  protected onDisconnect(error: any): void {
    console.error({
      error,
    });
    this.emitter.emit("disconnected", this.name, this.ecosystem);
  }
}
