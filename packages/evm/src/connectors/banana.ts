import { BaseConnector, setLastUsedConnector } from "@wallet01/core";
import {
  Banana4337Provider,
  Banana,
  Chains as BananaSupportedChains,
  Wallet,
} from "@rize-labs/banana-wallet-sdk/dist";

export class BananaConnector extends BaseConnector<Banana4337Provider> {
  provider!: Banana4337Provider;
  BananaInstance: Banana;
  wallet!: Wallet;
  address!: string;
  connected!: boolean;

  constructor(chain: string = "80001") {
    super(chain, "banana", "ethereum");
    if (isBananSupported(chain)) {
      const bananaChain = getBananaSupportedChain(chain);
      this.BananaInstance = new Banana(bananaChain);
    } else {
      throw new Error("Chainid passed not supported");
    }
  }

  async getProvider(): Promise<Banana4337Provider> {
    try {
      if (!this.provider) {
        if (this.wallet) {
          const provider = this.wallet.getProvider();
          this.provider = provider;
          return this.provider;
        }
        await this.connect();
        //@ts-ignore
        this.provider = this.wallet.getProvider();
        return this.provider;
      }

      return this.provider;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async connect(): Promise<void> {
    const walletName = this.BananaInstance.getWalletName();
    let provider;
    // let walletAddress = "";
    //@ts-ignore
    this?.emit("message", { type: "connecting" });
    if (walletName) {
      this.wallet = await this.BananaInstance.connectWallet(walletName);
      if (!this.wallet) {
        throw new Error("Wallet connection failed");
      }
    //   walletAddress = await this.wallet.getAddress();
      provider = this.wallet.getProvider();
    } else {
      // @ts-ignore-next-line
      this.wallet = await this.BananaInstance.createWallet();
      if (!this.wallet) {
        throw new Error("Wallet creation failed");
      }
    //   walletAddress = await this.wallet.getAddress();
      provider = this.wallet.getProvider();
    }
    setLastUsedConnector(this.name);

    provider.on("accountsChanged", this.onAccountsChanged.bind(this));
    provider.on("disconnect", this.onDisconnect.bind(this));
    provider.on("chainChanged", this.onChainChanged.bind(this));

    this.address = await this.wallet.getAddress();
    this.connected = true;
  }

  async resolveDid(address: string): Promise<string | null> {
    try {
        console.log("Not implemented yet");
        console.log(address)
        return "none";     
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      if (!this.provider) throw new Error("Wallet not Connected!");
      const signer = this.wallet.getSigner();

      const hash = (await signer.signBananaMessage(message)).signature;
      return hash;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Wallet Not Connected");
      const result = [this.address];
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async disconnect() {
    console.log("disconnect called");
    this.BananaInstance.resetWallet();
  }

  //! Current Banana wallet has 1:1 mapping with accounts
  protected onAccountsChanged(): void {
    throw new Error("Method not implemented.");
  }

  protected onChainChanged(chain: string | number): void {
    const id = normalizeChainId(chain);
    const isNewChainSupported = isBananSupported(id);

    // @ts-ignore-next-line
    this?.emit("change", { chain: { id, isNewChainSupported } });
  }

  protected onDisconnect(): void {
    console.log("disconnect called ");
    this.BananaInstance.resetWallet();
    // @ts-ignore-next-line
    this?.emit("disconnect");
  }
}


function isBananSupported(chainId: number | string): boolean {
    for (let chain in BananaSupportedChains) {
      let currentChainId = BananaSupportedChains[chain] || -1;
      if (currentChainId.toString() == chainId) return true;
    }
    return false;
  }

function getBananaSupportedChain(chainId: number | string): BananaSupportedChains {
    const normalizedChainId = normalizeChainId(chainId);
    let bananaSupportedChain: BananaSupportedChains;
    switch(normalizedChainId) {
        case 80001:
            bananaSupportedChain = BananaSupportedChains.mumbai
            break;
        case 420:
            bananaSupportedChain = BananaSupportedChains.optimismTestnet
            break;
        case 5:
            bananaSupportedChain = BananaSupportedChains.goerli;
            break;
        default:
            bananaSupportedChain = BananaSupportedChains.mumbai;
            break;
    };

    return bananaSupportedChain;
}


function normalizeChainId(chainId: string | number | bigint) {
    if (typeof chainId === "string")
      return Number.parseInt(
        chainId,
        chainId.trim().substring(0, 2) === "0x" ? 16 : 10
      );
    if (typeof chainId === "bigint") return Number(chainId);
    return chainId;
  }