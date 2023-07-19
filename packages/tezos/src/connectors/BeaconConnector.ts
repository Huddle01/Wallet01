import { BaseConnector, setLastUsedConnector } from "@wallet01/core";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { formatMessage } from "../utils/formatMessage";
import { isNetwork } from "../utils/isNetwork";
import { TezosToolkit } from "@taquito/taquito";
import { PermissionScope, SigningType } from "../types";
interface BeaconConnectorOptions {
  chain?: string;
  projectName: string;
  rpcUrl?: string;
}

export class BeaconConnector extends BaseConnector<BeaconWallet> {
  provider?: BeaconWallet | undefined;
  private projectName: string;
  private rpcUrl: string;
  private toolkit: TezosToolkit;

  constructor({
    chain = "mainnet",
    projectName,
    rpcUrl,
  }: BeaconConnectorOptions) {
    super(chain, "beacon", "tezos");
    this.projectName = projectName;

    if (rpcUrl) {
      this.rpcUrl = rpcUrl;
    } else {
      this.rpcUrl = "https://mainnet.api.tez.ie/";
    }

    this.toolkit = new TezosToolkit(this.rpcUrl);
  }
  
  async getProvider(): Promise<BeaconWallet> {
    try {
      if (!this.provider) {
        const provider = new BeaconWallet({ name: this.projectName });
        this.provider = provider;
        this.toolkit.setProvider({ wallet: provider });
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
      const account = await this.provider.client.getActiveAccount();
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
      let activeAccount = await this.provider.client.getActiveAccount();
      if (!activeAccount) {
        await this.provider.requestPermissions(
          isNetwork(chainId)
            ? {
                network: {
                  type: chainId,
                },
                scopes: [PermissionScope.SIGN],
              }
            : {
                scopes: [PermissionScope.SIGN],
              }
        );
        activeAccount = await this.provider.client.getActiveAccount();
      }
      if (!activeAccount?.address) {
        throw new Error("Wallet Not Conencted");
      }
      this.chain = activeAccount.network.type;
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
      await this.provider.disconnect();
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
      const address = await this.provider.getPKH();
      if (!address) {
        throw new Error("Wallet Not Conencted");
      }
      const { signature } = await this.provider.client.requestSignPayload({
        signingType: SigningType.MICHELINE,
        payload: formatMessage(message),
        sourceAddress: address,
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
