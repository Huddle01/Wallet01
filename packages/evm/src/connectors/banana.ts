import {
  BaseConnector,
  ProviderNotFoundError,
  WalletConnectionError,
  WalletNotConnectedError,
} from "@wallet01/core";
import {
  Banana4337Provider,
  Banana,
  Wallet,
  Chains,
} from "@rize-labs/banana-wallet-sdk";
import { isBananSupported, getBananaSupportedChain } from "../utils/helpers";
import {
  MessageSignError,
  UnsupportedChainError,
  WalletCreationError,
} from "../utils/errors";

export class BananaConnector extends BaseConnector<Banana4337Provider> {
  static #instance: BaseConnector<Banana4337Provider>;

  provider!: Banana4337Provider;
  private BananaInstance!: Banana;
  private wallet!: Wallet;

  constructor() {
    super("banana", "ethereum");
  }

  init() {
    if (!BananaConnector.#instance) {
      BananaConnector.#instance =
        new BananaConnector() as BaseConnector<Banana4337Provider>;
    }
    return BananaConnector.#instance;
  }

  static getInstance() {
    return this.#instance;
  }

  async getProvider(): Promise<Banana4337Provider> {
    if (!this.provider) {
      throw new ProviderNotFoundError({ walletName: this.name });
    }

    return this.provider;
  }

  async connect() {
    this.BananaInstance = new Banana(Chains.mumbai);
    const walletName = this.BananaInstance.getWalletName();

    if (walletName) {
      this.wallet = await this.BananaInstance.connectWallet(walletName);
      if (!this.wallet) {
        throw new WalletConnectionError({ walletName: this.name });
      }
      this.provider = this.wallet.getProvider();
    } else {
      // @ts-ignore-next-line
      this.wallet = await this.BananaInstance.createWallet();
      if (!this.wallet) {
        throw new WalletCreationError({ walletName: this.name });
      }

      this.provider = this.wallet.getProvider();
    }

    this.provider.on("accountsChanged", this.onAccountsChanged.bind(this));
    this.provider.on("disconnect", this.onDisconnect.bind(this));
    this.provider.on("chainChanged", this.onChainChanged.bind(this));

    const address = await this.wallet.getAddress();
    const chainId = await this.getChainId();

    this.emit(
      "connected",
      address,
      chainId,
      this.name,
      this.ecosystem,
      BananaConnector.getInstance()
    );

    return {
      address,
      walletName: this.name,
      ecosystem: this.ecosystem,
      activeConnector: BananaConnector.getInstance(),
    };
  }

  async switchChain(chainId: string) {
    const oldChainId = await this.getChainId();
    const isNewChainSupported = isBananSupported(chainId);
    if (!isNewChainSupported)
      throw new UnsupportedChainError({ chainId: chainId });

    const bananaChain = getBananaSupportedChain(chainId);

    const BananaInstance = new Banana(bananaChain);
    this.BananaInstance = BananaInstance;

    // connect to same wallet with new configs
    const connection = await this.connect();

    this.emit("chainChanged", chainId, BananaConnector.getInstance());

    return {
      fromChainId: oldChainId,
      toChainId: chainId,
      activeConnector: connection.activeConnector,
    };
  }

  async signMessage(message: string) {
    try {
      if (!this.provider) throw new Error("Wallet not Connected!");
      const signer = this.wallet.getSigner();
      const hash = (await signer.signBananaMessage(message)).signature;

      return {
        signature: hash,
        activeConnector: BananaConnector.getInstance(),
      };
    } catch (error) {
      console.error(error);
      throw new MessageSignError({ walletName: this.name });
    }
  }

  //! Currently Banana wallet has 1:1 mapping with account
  async getAccount(): Promise<string[]> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider)
        throw new WalletNotConnectedError({ walletName: this.name });
      const result = [await this.wallet.getAddress()];
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async disconnect() {
    this.onDisconnect();
    return {
      walletName: this.name,
      ecosystem: this.ecosystem,
    };
  }

  async getChainId(): Promise<string> {
    if (this.provider) {
      const id = this.provider.chainId.toString();
      this.store.setChainId(id);
      return id;
    }
    return "";
  }

  //! Currently Banana wallet has 1:1 mapping with account
  protected onAccountsChanged(): void {
    throw new Error("Method not implemented.");
  }

  protected onChainChanged(chain: string | number): void {
    console.log("Chain changed to ", chain);
  }

  protected onDisconnect(): void {
    this.emit("disconnected", this.name, this.ecosystem);
  }
}
