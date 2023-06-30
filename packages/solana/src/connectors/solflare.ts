import { Connection, PublicKey } from "@solana/web3.js";
import { performReverseLookup, getAllDomains } from "@bonfida/spl-name-service";
import { BaseConnector, setLastUsedConnector } from "@wallet01/core";

import { SolflareProvider } from "../providers/solflareProvider";
import emitter from "../utils/emiter";

declare const window: {
  solflare: SolflareProvider;
};

interface SolflareConnectorOptions {
  rpcUrl: string;
}

export class SolflareConnector extends BaseConnector<SolflareProvider> {
  provider!: SolflareProvider;
  private rpcUrl: string;

  constructor({ rpcUrl }: SolflareConnectorOptions) {
    super("", "solflare", "solana");

    this.rpcUrl = rpcUrl;
  }

  async getProvider(): Promise<SolflareProvider> {
    if (
      typeof window !== "undefined" &&
      window.solflare &&
      window.solflare.isSolflare
    ) {
      this.provider = window.solflare;
      return this.provider;
    } else {
      throw new Error("Wallet Not Installed");
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) throw new Error("Provider Undefined");
    try {
      await this.provider.connect();
      const accounts = this.provider.publicKey;
      return [String(accounts)];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async connect({}): Promise<void> {
    try {
      const provider = await this.getProvider();
      if (!provider) throw new Error("Solflare is not installed");

      if (provider.on) {
        provider.on("accountChanged", this.onAccountsChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      await this.provider.connect();
      setLastUsedConnector(this.name);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.provider) throw new Error("No wallet Conencted");
    this.provider.disconnect();
    emitter.emit("disconnected");
  }

  async resolveDid(address: string): Promise<string | null> {
    if (!this.provider) throw new Error("No wallet Connected");
    const connection = new Connection(this.rpcUrl);

    try {
      const ownerWallet = new PublicKey(address);
      const allDomainKeys = await getAllDomains(connection, ownerWallet);
      const allDomainNames = await Promise.all(
        allDomainKeys.map(key => {
          return performReverseLookup(connection, key);
        })
      );
      if (!allDomainNames[0]) return null;
      return allDomainNames[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) throw new Error("No wallet Connected");
    try {
      const _message = new TextEncoder().encode(message);
      const hash = await this.provider.signMessage(_message, "utf8");
      return new TextDecoder("utf-8").decode(hash);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  protected onAccountsChanged(): void {
    console.log("Account Changed");
  }

  protected onChainChanged(_chain: string | number): void {
    console.log("Chain Changed");
  }

  protected onDisconnect(): void {
    console.log("Wallet disconnected");
  }
}
