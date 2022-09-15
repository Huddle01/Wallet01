import { providers } from "ethers";
import { getAddress, hexValue } from "ethers/lib/utils";
import { Chain } from "../types";
import { ConnectorNotFoundError } from "../utils/errors";

import { Connector } from "./base";

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
  InjectedConnectorOptions | undefined,
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
    chains?: Chain[];
    options?: InjectedConnectorOptions;
  } = {}) {
    super({ chains, options });

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

  async connect({ chainId }: { chainId?: number } = {}) {
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
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }

      // Add shim to storage signalling wallet is connected
      if (this.options?.shimDisconnect)
        getClient().storage?.setItem(this.shimDisconnectKey, true);

      return { account, chain: { id, unsupported }, provider };
    } catch (error) {
      if (this.isUserRejectedRequestError(error))
        throw new UserRejectedRequestError(error);
      if ((<RpcError>error).code === -32002)
        throw new ResourceUnavailableError(error);
      throw error;
    }
  }
}
