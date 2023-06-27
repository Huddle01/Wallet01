import { hexValue } from "ethers/lib/utils.js";
import { Web3Provider, ExternalProvider } from "@ethersproject/providers";

import { BaseConnector, setLastUsedConnector } from "@wallet01/core";

import emitter from "../utils/emiter";
import { chainData } from "../utils/chains";

interface OkxWalletWindow extends Window {
  okxwallet?: Web3Provider;
}

declare const window: OkxWalletWindow;

export class OkxWalletConnector extends BaseConnector<Web3Provider> {
  provider?: Web3Provider;

  constructor(chain: string = "1") {
    super(chain, "okxwallet", "ethereum");
  }

  async getProvider() {
    if (typeof window !== "undefined" && window.okxwallet) {
      const provider = window.okxwallet;
      const _provider = new Web3Provider(<ExternalProvider>(<unknown>provider));
      this.provider = _provider;
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
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getChainId(): Promise<string> {
    if (this.provider) {
      const chainId = (await this.provider.getNetwork()).chainId.toString();
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
      const name = await provider.lookupAddress(address);
      return name;
    } catch (error) {
      console.error({ error }, "resolveDid");
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      if (!this.provider) throw new Error("Connect a wallet!");
      const signer = await this.provider.getSigner();
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
