import { BaseConnector, setLastUsedConnector } from "@wallet01/core";
import { DAppClient, PermissionScope, SigningType } from "@airgap/beacon-sdk";
import { isNetwork } from "../utils/isNetwork";
import { formatMessage } from "../utils/formatMessage";

export default class TempleConnector extends BaseConnector<DAppClient> {
  provider?: DAppClient | undefined;

  constructor(chain: string = "") {
    super(chain, "Temple");
  }

  async getProvider(): Promise<DAppClient> {
    try {
      const provider = new DAppClient({ name: "Wallet01" });
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
      const account = await this.provider.getActiveAccount();
      if (!account) {
        throw new Error("Wallet Not Conencted");
      }
      return [account.publicKey];
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
      await this.connect({ chainId });
      this.chain = chainId;
    } catch (error) {
      console.error({ error }, "switchChain");
      throw error;
    }
  }

  async connect({ chainId }: { chainId?: string | undefined }): Promise<void> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Provider Undefined");

      const result = await this.provider.requestPermissions(
        isNetwork(chainId)
          ? { network: { type: chainId }, scopes: [PermissionScope.SIGN] }
          : { scopes: [PermissionScope.SIGN] }
      );

      this.chain = result.network.type;

      setLastUsedConnector(this.name);
    } catch (error) {
      console.error({ error }, "connect");
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Wallet Not Connected");
      await this.provider.clearActiveAccount();
    } catch (error) {
      console.error({ error });
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

      return domain[0].name as string;
    } catch (error) {
      console.error({ error }, "resolveDid");
      return null;
    }
  }

  async signMessage(message: string): Promise<string> {
    try {
      if (!this.provider) throw new Error("Wallet Not Connected");
      const { signature } = await this.provider.requestSignPayload({
        signingType: SigningType.MICHELINE,
        payload: formatMessage(message),
      });
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
