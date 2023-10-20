import {
  AddressNotFoundError,
  BaseConnector,
  ProviderNotFoundError,
  UnknownError,
  WalletNotConnectedError,
} from "@wallet01/core";
import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";

import { formatMessage } from "../utils/formatMessage";
import { isNetwork } from "../utils/isNetwork";
import { PermissionScope, SigningType, DAppClientOptions } from "../types";
import {
  ConnectionResponse,
  DisconnectionResponse,
  MessageSignedResponse,
} from "@wallet01/core/dist/types/methodTypes";

type BeaconConnectorOptions = {
  name: string;
  rpcUrl?: string;
} & DAppClientOptions;

export class BeaconConnector extends BaseConnector<BeaconWallet> {
  static #instance: BaseConnector<BeaconWallet>;
  provider!: BeaconWallet;
  private rpcUrl: string;
  private toolkit!: TezosToolkit;
  private isConnected = false;
  private options: DAppClientOptions;

  private constructor({ rpcUrl, ...options }: BeaconConnectorOptions) {
    super("beacon", "tezos");
    this.options = options;

    if (rpcUrl) {
      this.rpcUrl = rpcUrl;
    } else {
      this.rpcUrl = "https://mainnet.api.tez.ie/";
    }
  }

  static init(options: BeaconConnectorOptions) {
    if (!BeaconConnector.#instance) {
      BeaconConnector.#instance = new BeaconConnector(
        options
      ) as BaseConnector<BeaconWallet>;
    }
    return BeaconConnector.#instance;
  }

  async getProvider(): Promise<BeaconWallet> {
    try {
      if (!this.toolkit) this.toolkit = new TezosToolkit(this.rpcUrl);
      if (!this.isConnected) {
        const provider = new BeaconWallet(this.options);
        this.provider = provider;
        this.toolkit.setProvider({ wallet: provider });
      }
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
    if (!this.provider)
      throw new WalletNotConnectedError({ walletName: this.name });
    try {
      const account = await this.provider.getPKH();
      return [account];
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "getAccount",
      });
    }
  }

  async getChainId(): Promise<string> {
    if (!this.provider)
      throw new WalletNotConnectedError({ walletName: this.name });
    try {
      if (!this.provider) throw new Error("Wallet Not Installed");
      const account = await this.provider.client.getActiveAccount();
      if (!account) {
        throw new WalletNotConnectedError({ walletName: this.name });
      }
      const {
        network: { type: chainId },
      } = account;
      return chainId;
    } catch (error) {
      console.error(error);
      throw new UnknownError({
        walletName: this.name,
        atFunction: "getChainId",
      });
    }
  }

  // async switchChain(chainId: string): Promise<ChainSwitchResponse> {
  //   if (!this.provider)
  //     throw new WalletNotConnectedError({ walletName: this.name });
  //   try {
  //     const fromChainId = await this.getChainId();
  //     const toChainId = chainId;
  //     await this.provider.clearActiveAccount();

  //     if (isNetwork(toChainId)) {
  //       await this.connect({ chainId: toChainId });
  //     }

  //     return {
  //       fromChainId,
  //       toChainId,
  //       activeConnector: BeaconConnector.#instance,
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     throw new UnknownError({
  //       walletName: this.name,
  //       atFunction: "switchChain",
  //     });
  //   }
  // }

  async connect(options?: { chainId: string }): Promise<ConnectionResponse> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new ProviderNotFoundError({ walletName: this.name });

      let activeAccount = await this.provider.client.getActiveAccount();
      if (!activeAccount) {
        await this.provider.requestPermissions(
          options?.chainId && isNetwork(options.chainId)
            ? {
                network: {
                  type: options.chainId,
                },
                scopes: [PermissionScope.SIGN],
              }
            : {
                scopes: [PermissionScope.SIGN],
              }
        );
        activeAccount = await this.provider.client.getActiveAccount();
      }
      if (!activeAccount?.address) {
        throw new WalletNotConnectedError({ walletName: this.name });
      }

      const address = activeAccount.address;
      const chainId = activeAccount.network.type;

      this.isConnected = true;
      this.emitter.emit(
        "connected",
        address,
        chainId,
        this.name,
        this.ecosystem,
        BeaconConnector.#instance
      );

      return {
        address,
        chainId,
        ecosystem: this.ecosystem,
        walletName: this.name,
        activeConnector: BeaconConnector.#instance,
      };
    } catch (error) {
      console.error({ error }, "connect");
      throw error;
    }
  }

  async disconnect(): Promise<DisconnectionResponse> {
    if (!this.provider)
      throw new WalletNotConnectedError({ walletName: this.name });
    try {
      await this.provider.clearActiveAccount();
      await this.provider.disconnect();
      this.isConnected = false;

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
    if (!this.provider)
      throw new WalletNotConnectedError({ walletName: this.name });
    try {
      const address = (await this.getAccount())[0];
      if (!address) {
        throw new AddressNotFoundError({ walletName: this.name });
      }
      const { signature } = await this.provider.client.requestSignPayload({
        signingType: SigningType.MICHELINE,
        payload: formatMessage(message),
        sourceAddress: address,
      });

      this.emitter.emit("messageSigned", signature, BeaconConnector.#instance);

      return {
        signature,
        activeConnector: BeaconConnector.#instance,
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
