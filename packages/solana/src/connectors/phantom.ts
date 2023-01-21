import { Connection, PublicKey } from "@solana/web3.js";
import { performReverseLookup, getAllDomains } from "@bonfida/spl-name-service";

import { BaseConnector, setLastUsedConnector } from "@wallet01/core";
import { PhantomProvider } from "../providers/phantomProvider";
import emitter from "../utils/emiter";

interface PhantomWindow extends Window {
  solana?: PhantomProvider;
}

declare const window: PhantomWindow;

export class PhantomConnector extends BaseConnector<PhantomProvider> {
  provider!: PhantomProvider;

  constructor(chain: string = "") {
    super(chain, "phantom");
  }

  async getProvider(): Promise<PhantomProvider> {
    if (
      typeof window !== "undefined" &&
      window.solana &&
      window.solana.isPhantom
    ) {
      this.provider = window.solana;
      return this.provider;
    } else {
      throw new Error("Wallet Not Installed");
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) throw new Error("Provider Undefined");
    try {
      await this.connect("");
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
      if (!provider) throw new Error("Phantom is not installed");
      await this.provider.connect();
      setLastUsedConnector(this.name);

      if (provider.on) {
        provider.on("accountChanged", this.onAccountsChanged);
        provider.on("disconnect", this.onDisconnect);
      }
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
    const connection = new Connection(
      "https://solana-api.syndica.io/access-token/590ibuUowWyZiI1R3d6f8ubDBXGMtGul6vjXAsZDLnGPMDdB4GojJuw7y23KDkP0/rpc"
    );

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
      return null;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) throw new Error("No wallet Connected");
    try {
      const _message = new TextEncoder().encode(message);
      const { signature } = await this.provider.signMessage(_message);
      return new TextDecoder("utf-8").decode(signature);
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
