import { providers } from "ethers";
// import { getAddress, hexValue } from "ethers/lib/utils";
import { CustomChainConfig, Ethereum } from "../types";
import { ConnectorNotFoundError } from "../utils/errors";

import { Connector, ConnectorData } from "./base";

export type InjectedConnectorOptions = {
  /** Name of connector */
  name?: string | ((detectedName: string | string[]) => string);
  /**
   * MetaMask 10.9.3 emits disconnect event when chain is changed.
   * This flag prevents the `"disconnect"` event from being emitted upon switching chains.
   * @see https://github.com/MetaMask/metamask-extension/issues/13375#issuecomment-1027663334
   */
  shimChainChangedDisconnect?: boolean;
  /**
   * MetaMask and other injected providers do not support programmatic disconnect.
   * This flag simulates the disconnect behavior by keeping track of connection status in storage.
   * @see https://github.com/MetaMask/metamask-extension/issues/10353
   * @default true
   */
  shimDisconnect?: boolean;
};

export class InjectedConnector extends Connector<
  Window["ethereum"],
  providers.JsonRpcSigner
> {
  readonly id: string;
  readonly name: string;
  readonly ready = typeof window != "undefined" && !!window.ethereum;

  #provider?: Window["ethereum"];
  #switchingChains?: boolean;

  protected shimDisconnectKey = "injected.shimDisconnect";

  constructor({
    chains,
    options = { shimDisconnect: true },
  }: {
    chains?: CustomChainConfig[];
    options?: InjectedConnectorOptions;
  } = {}) {
    super({ chains });

    let name = "Injected";
    const overrideName = options.name;
    if (typeof overrideName === "string") name = overrideName;
    else if (typeof window !== "undefined") {
      // const detectedName = getInjectedName(window.ethereum);
      const detectedName = "metamask";

      if (overrideName) name = overrideName(detectedName);
      else
        name =
          typeof detectedName === "string"
            ? detectedName
            : <string>detectedName[0];
    }

    this.id = "injected";
    this.name = name;
  }

  async getAccount(): Promise<string[]> {
    if (this.#provider) {
      return await this.#provider?.request({ method: "eth_requestAccounts" },)
    }
    return ['']
  }

  async getChainId(): Promise<string> {
    if (this.#provider) {
      return await this.#provider?.request({method: "eth_chainId"})
    }
    return ''
  }



  async isAuthorized(): Promise<boolean> {

  }

  getSigner(config?: { chainId?: number | undefined; } | undefined): Promise<providers.JsonRpcSigner> {

  }

  switchChain(chainId: number): Promise<CustomChainConfig> {
    return {
      chainNamespace: "eip155",
      chainId: chainId,
      displayName: '',
      ticker: '',
      tickerName: ''
    }
  }

  async connect(chainId: number) {
    try {
      const provider = await this.getProvider();
      if (!provider) throw new ConnectorNotFoundError();

      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      this.emit("message", { type: "connecting" });

      const account = await this.getAccount();
      // Switch to chain if provided
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);
      if (chainId && id !== chainId) {
        const chain = await this.switchChain?.(chainId);
        id = chain?.chainId;
        unsupported = this.isChainUnsupported(id);
      }

      const data: Required<ConnectorData> = {
        account: account,
        chain: {
          id: id,
          unsupported: unsupported
        },
        provider: {
          provider
        }
      }

      // Add shim to storage signalling wallet is connected

      return data;
    } catch (error) {

    }
  }

  async disconnect(): Promise<void> {

  }

  async resolveDid(): Promise<string> {
    return 'Hello!'
  }

  async signTxn(message: string): Promise<void> {

  }


  protected onAccountsChanged(accounts: string[]): void {

  }

  protected onChainChanged(chain: string | number): void {

  }

  protected onDisconnect(error: Error): void {

  }
}
