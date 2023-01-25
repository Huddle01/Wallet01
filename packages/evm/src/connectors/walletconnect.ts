import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { BaseConnector, setLastUsedConnector } from "@wallet01/core";
import EthereumProvider from "@walletconnect/ethereum-provider";
import { hexValue } from "ethers/lib/utils.js";
import { chainData } from "../utils/chains";

export class WalletconnectConnector extends BaseConnector<EthereumProvider> {
  provider?: EthereumProvider;

  constructor(chain: string = "1") {
    super(chain, "walletconnect", "ethereum");
  }

  async getProvider(): Promise<EthereumProvider> {
    try {
      const _provider = new EthereumProvider({
        infuraId: "0a7d1e04fd0845d5994516cfb80e0813",
      });

      this.provider = _provider;
      return this.provider;
    } catch (error) {
      console.error(error);
      throw error;
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
      throw error;
    }
  }

  async getChainId(): Promise<string> {
    if (this.provider) {
      const chainId = this.provider.chainId.toString();
      this.chain = chainId;
      return chainId;
    }
    return "";
  }

  async switchChain(chainId: string): Promise<void> {
    if (!this.provider) await this.getProvider();
    const _id = hexValue(Number(chainId));

    try {
      this.provider?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: _id }],
      });
      this.chain = chainId;
    } catch (error) {
      console.error(error);
      if (chainData[chainId]) {
        this.provider?.request({
          method: "wallet_addEthereumChain",
          params: [{ data: chainData[chainId] }],
        });
        this.switchChain(chainId);
      }
      throw error;
    }
  }

  async connect({ chainId }: { chainId?: string | undefined }): Promise<void> {
    if (!this.provider) await this.getProvider();
    try {
      await this.provider?.enable();

      let currentId = await this.getChainId();
      if (chainId && currentId !== chainId) {
        await this.switchChain(chainId);
      }

      setLastUsedConnector(this.name);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.provider) throw new Error("Wallet already disconnected");
    await this.provider.disconnect();
    this.provider = undefined;
  }

  async resolveDid(address: string): Promise<string | null> {
    try {
      if (!this.provider) throw new Error("Wallet not connected");
      if ((await this.getChainId()) !== "1") return null;

      const _provider = new Web3Provider(this.provider as ExternalProvider);
      const name = await _provider.lookupAddress(address);
      return name;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      if (!this.provider) throw new Error("Wallet not Connected!");
      const _address = await this.getAccount();

      const signer = new Web3Provider(
        this.provider as ExternalProvider
      ).getSigner(_address[0]);

      const hash = await signer.signMessage(message);
      return hash;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  protected onAccountsChanged(): void {
    console.log("Account Changed");
  }

  protected onChainChanged(_chain: string): void {
    console.log("Chain Changed");
  }

  protected onDisconnect(): void {
    console.log("Wallet disconnected");
  }
}
