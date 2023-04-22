import { Web3Provider } from "@ethersproject/providers";
import { BaseConnector, setLastUsedConnector } from "@wallet01/core";
import { hexValue } from "ethers/lib/utils.js";
import { chainData } from "../utils/chains";
import emitter from "../utils/emiter";
import Web3 from "web3";

interface OkxWalletWindow extends Window {
  okxwallet?: any;
}

declare const window: OkxWalletWindow;

export class OkxWalletConnector extends BaseConnector<Web3Provider> {
  provider?: any;

  constructor(chain: string = "1") {
    super(chain, "okxwallet", "ethereum");
  }

  async getProvider(): Promise<any> {
    if (typeof window !== "undefined" && window.okxwallet) {
      this.provider = window.okxwallet;
      return this.provider;
    } else {
      throw new Error("Wallet Not Installed");
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Wallet Not Installed");
      const result = await this.provider.send("eth_requestAccounts", []);
      return result.result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getChainId(): Promise<string> {
    if (this.provider) {
      const chainId = (
        await new Web3(this.provider).eth.getChainId()
      ).toString();
      this.chain = chainId;
      return chainId;
    }
    return "";
  }

  async switchChain(chainId: string): Promise<void> {
    const provider = await this.getProvider();
    const id = hexValue(Number(chainId));
    try {
      await provider?.send("wallet_switchEthereumChain", [{ chainId: id }]);
      this.chain = chainId;
    } catch (error) {
      console.log("error in switching chain", error);
      if (chainData[chainId]) {
        this.provider?.send("wallet_addEthereumChain", [chainData[chainId]]);
        return;
      }
      throw error;
    }
  }

  async connect({ chainId }: { chainId: string }) {
    try {
      const provider = await this.getProvider();
      this.provider = provider;

      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      let id = await this.getChainId();

      if (chainId && id !== chainId) {
        await this.switchChain(chainId);
      }

      setLastUsedConnector(this.name);

      emitter.emit("connected");
    } catch (error) {
      console.error(error, "in connect");
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.provider = undefined;
    emitter.emit("disconnected");
  }

  async resolveDid(address: string): Promise<string | null> {
    try {
      if ((await this.getChainId()) !== "1") return null;
      const provider = await this.getProvider();
      const name = await new Web3(provider).eth.ens.getAddress(address);
      return name;
    } catch (error) {
      console.error({ error }, "resolveDid");
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      if (!this.provider) throw new Error("Connect a wallet!");
      const address = (await this.getAccount()).toString();
      const signer = await new Web3(this.provider).eth.personal.sign(
        message,
        address,
        ""
      );
      return signer;
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
