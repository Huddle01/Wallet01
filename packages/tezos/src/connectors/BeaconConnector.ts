import { BaseConnector, setLastUsedConnector } from "@wallet01/core";
import {
  getDAppClientInstance,
  DAppClient,
  PermissionScope,
  SigningType,
} from "@airgap/beacon-dapp";
import { formatMessage } from "../utils/formatMessage";
import { isNetwork } from "../utils/isNetwork";

export default class BeaconConnector extends BaseConnector<DAppClient> {
  provider?: DAppClient | undefined;
  private projectName: string;

  constructor(chain: string = "mainnet", projectName: string) {
    super(chain, "beacon", "tezos");
    this.projectName = projectName;

    const provider = getDAppClientInstance({ name: this.projectName });
    this.provider = provider;
  }

  async getProvider(): Promise<DAppClient> {
    try {
      if (!this.provider) {
        const provider = getDAppClientInstance({ name: this.projectName });
        this.provider = provider;
      }
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
      return [account.address];
    } catch (error) {
      console.error({ error }, "getAccount");
      throw error;
    }
  }

  async getChainId(): Promise<string> {
    if (!this.provider) await this.getProvider();
    try {
      if (!this.provider) throw new Error("Wallet Not Installed");
      const account = await this.provider.getActiveAccount();
      if (!account) {
        await this.connect({});
        return this.chain;
      }
      const {
        network: { type },
      } = account;
      return type;
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
      if (!this.provider) throw new Error("Wallet Not Installed");
      console.log({ chainId });
      const result = await this.provider.requestPermissions(
        isNetwork(chainId)
          ? {
              network: { type: chainId },
              scopes: [PermissionScope.SIGN],
            }
          : { scopes: [PermissionScope.SIGN] }
      );
      if (!result.address) {
        throw new Error("Wallet Not Conencted");
      }
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
      if (!this.provider) throw new Error("Wallet Not Installed");
      await this.provider.clearActiveAccount();
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
      const account = await this.provider.getActiveAccount();
      if (!account) {
        throw new Error("Wallet Not Conencted");
      }
      const { signature } = await this.provider.requestSignPayload({
        signingType: SigningType.MICHELINE,
        payload: formatMessage(message),
        sourceAddress: account.address,
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

  protected onChainChanged(): void {
    return;
  }

  protected onDisconnect(): void {
    return;
  }
}
