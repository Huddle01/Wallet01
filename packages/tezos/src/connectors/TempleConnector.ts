import { BaseConnector, setLastUsedConnector } from "@wallet01/core";

import { TempleDAppNetwork, TempleWallet } from "@temple-wallet/dapp";
import { formatMessage } from "../utils/formatMessage";

export default class TempleConnector extends BaseConnector<TempleWallet> {
  provider?: TempleWallet | undefined;

  constructor(chain: string = "mainnet") {
    super(chain, "templewallet", "tezos");
  }

  async getProvider(): Promise<TempleWallet> {
    try {
      const provider = new TempleWallet("Wallet01");
      this.provider = provider;
      return this.provider;
    } catch (error) {
      console.error({ error }, "getProvider");
      throw error;
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Wallet Not Installed");
      const account = await this.provider.getPKH();
      if (!account) {
        throw new Error("Wallet Not Conencted");
      }
      return [account];
    } catch (error) {
      console.error({ error }, "getAccount");
      throw error;
    }
  }

  async getChainId(): Promise<string> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Wallet Not Installed");
      if (!this.chain) await this.connect({});
      return this.chain;
    } catch (error) {
      console.error({ error }, "getChainId");
      throw error;
    }
  }

  async switchChain(chainId: string): Promise<void> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Wallet Not Installed");
      await this.provider.reconnect(chainId as TempleDAppNetwork);
      this.chain = chainId;
    } catch (error) {
      console.error({ error }, "switchChain");
      throw error;
    }
  }

  async connect({ chainId }: { chainId?: string | undefined }): Promise<void> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Wallet Not Installed");

      await this.provider.connect((chainId as TempleDAppNetwork) || "mainnet");
      this.chain = chainId || "mainnet";
      setLastUsedConnector(this.name);
    } catch (error) {
      console.error({ error }, "connect");
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Wallet Not Installed");
      this.provider = undefined;
      this.chain = "";
    } catch (error) {
      console.error({ error }, "disconnect");
      throw error;
    }
  }

  async resolveDid(address: string): Promise<string | null> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Wallet Not Connected");
      const domain = await fetch(
        `https://api.tzkt.io/v1/domains?owner=${address}`
      ).then(res => res.json());
      if (!domain || domain.length == 0 || !domain[0]) return null;
      console.error(address, domain[0].name);
      return domain[0].name as string;
    } catch (error) {
      console.error({ error }, "resolveDid");
      throw error;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Wallet Not Connected");
      const signature = await this.provider.sign(formatMessage(message));
      return signature;
    } catch (error) {
      console.error({ error }, "signMessage");
      throw error;
    }
  }

  protected onAccountsChanged(): void {
    return;
  }

  protected onChainChanged(_chain: string | number): void {
    return;
  }

  protected onDisconnect(): void {
    return;
  }
}
