import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { BaseConnector, setLastUsedConnector } from "@wallet01/core";
import EthereumProvider, {
  OPTIONAL_METHODS,
  REQUIRED_METHODS,
} from "@walletconnect/ethereum-provider";
import { EthereumProviderOptions } from "@walletconnect/ethereum-provider/dist/types/EthereumProvider";
// import { hexValue } from "ethers/lib/utils.js";
import { chainData } from "../utils/chains";
import { hexlify } from "ethers/lib/utils";

type WalletconnectConnectorOptions = {
  chain?: string;
} & EthereumProviderOptions;

const NAMESPACE = "eip155";
const ADD_ETH_CHAIN_METHOD = "wallet_addEthereumChain";

export class WalletconnectConnector extends BaseConnector<EthereumProvider> {
  provider?: EthereumProvider;
  private options: EthereumProviderOptions;

  constructor({
    chain = "1",
    chains,
    projectId,
    ...options
  }: WalletconnectConnectorOptions) {
    super(chain, "walletconnect", "ethereum");
    this.options = {
      chains,
      projectId,
      optionalChains: options.optionalChains ?? [],
      methods: options.methods ?? REQUIRED_METHODS,
      optionalMethods: options.optionalMethods ?? OPTIONAL_METHODS,
      ...options,
    };

    this.getProvider();
  }

  async getProvider(): Promise<EthereumProvider> {
    try {
      const _provider = await EthereumProvider.init(this.options);

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
    const _id = hexlify(Number(chainId));

    try {
      if (!this.provider) throw new Error("Provider not found");
      const namespaceChains = this.getNamespaceChainsIds();
      const namespaceMethods = this.getNamespaceMethods();
      const isChainApproved = namespaceChains.includes(chainId);

      if (!isChainApproved && namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
        await this.provider.request({
          method: ADD_ETH_CHAIN_METHOD,
          params: [
            {
              ...chainData[chainId],
            },
          ],
        });
      }

      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: _id }],
      });

      this.chain = chainId;
    } catch (error) {
      console.error({ error });

      throw error;
    }
  }

  async connect({ chainId }: { chainId?: string | undefined }): Promise<void> {
    try {
      const provider = await this.getProvider();
      const isStaleChain = this.isChainsStale();

      if (provider.session && isStaleChain) await provider.disconnect();

      if (!provider.session || isStaleChain) {
        const _chainId = Number(chainId || this.chain);
        await provider.connect({
          chains: [_chainId],
          optionalChains: this.options.optionalChains,
        });

        this.chain = _chainId.toString();
      }

      await provider.enable();
      this.chain = await this.getChainId();
      const currentId = this.chain;
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

      const hash = await this.provider.request<string>({
        method: "personal_sign",
        params: [_address[0], message],
      });

      return hash;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private getNamespaceChainsIds() {
    if (!this.provider) return [];
    const chainIds = this.provider.session?.namespaces[NAMESPACE]?.chains?.map(
      chain => chain.split(":")[1] || ""
    );
    return chainIds ?? [];
  }

  private getNamespaceMethods() {
    if (!this.provider) return [];
    const methods = this.provider.session?.namespaces[NAMESPACE]?.methods;
    return methods ?? [];
  }

  private isChainsStale() {
    const namespaceMethods = this.getNamespaceMethods();
    if (namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) return false;

    const connectorChains = this.chain;
    const namespaceChains = this.getNamespaceChainsIds();

    if (
      namespaceChains.length &&
      !namespaceChains.some(id => id === this.chain)
    )
      return false;

    return !connectorChains.includes(this.chain);
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
