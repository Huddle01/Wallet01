import { ethers, providers } from "ethers";
import { hexValue } from "ethers/lib/utils";

import { CustomChainConfig } from "../types";
import { ConnectorNotFoundError } from "../utils/errors";

import { Connector, ConnectorData } from "./base";
import {  ExternalProvider, Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from '@metamask/detect-provider'


export type InjectedConnectorOptions = {
  name?: string | ((detectedName: string | string[]) => string);
};

export class InjectedConnector extends Connector<
  Web3Provider,
  providers.JsonRpcSigner
> {
  readonly id: string;
  readonly name: string;
  readonly ready = typeof window != "undefined" && !!window.ethereum;

  provider: Web3Provider | undefined;

  // protected shimDisconnectKey = "injected.shimDisconnect";

  constructor({
    chains,
  }: {
    chains?: CustomChainConfig[];
  } = {}) {
    super({ chains });

    let name = "Injected";

    this.id = "injected";
    this.name = name;
  }



  async getProvider() {
    // if (typeof window !== 'undefined' && !!window.ethereum) throw new Error("Window Not Found")
    const provider = await detectEthereumProvider()

    if (provider) {

      console.log('Ethereum successfully detected!')
      const _provider = new ethers.providers.Web3Provider(provider)
      this.provider = _provider
      return this.provider

    } else {
      throw new Error('Please install a Browser Wallet')
    }
  }

  async getAccount(): Promise<string[]> {
    if (!this.provider) throw new Error("Provider Undefined!")
    try {
      const result = await this.provider.send("eth_requestAccounts", [])
      console.log({result}) 
      return result
    } catch (err) {
      console.error(err)
      throw new Error('Error in getting Accounts')
    }
  }

  async getChainId(): Promise<string> {
    if (this.provider) {
      const { result } = await this.provider?.send("eth_chainId", [])
      return result
    }
    return ''
  }

  async getSigner(): Promise<providers.JsonRpcSigner> {
    // console.log(this.provider)
    // if (!this.provider) throw new Error("Provider Undefined!")
    const provider = await this.getProvider()
    const signer = await provider.getSigner()
    return signer
  }

  async switchChain(chainId: number): Promise<void> {

    const provider = await this.getProvider()

    const id = hexValue(chainId)
    try {
      await provider?.send(
        'wallet_switchEthereumChain',
        [{ chainId: id }]
      )
    }
    catch (error) {
      console.log("error in switching chain", error)
    }

  }

  async connect(chainId: number) {
    try {
      const provider = await this.getProvider();
      this.provider = provider
      // const signer = await this.getSigner()
      // console.log(signer)
      if (!provider) throw new ConnectorNotFoundError();

      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      this.emit("message", { type: "connecting" });

      // Switch to chain if provided
      // const account = await this.getAccount();
      // console.log(account)
      let id = Number(await this.getChainId())
      // let unsupported = this.isChainUnsupported(id);
      if (chainId && id !== chainId) {
        await this.switchChain?.(chainId);
      }

      const data: ConnectorData = {
        account: (await this.getAccount())[0],
        chain: {
          id: id,
        },
        provider: this.provider
      }
      console.log(data, 'connect method data')
      // Add shim to storage signalling wallet is connected

      return data;
    } catch (error) {
      console.error(error)
    }
  }

  async disconnect(): Promise<void> {
    const provider = this.getProvider();
    if (!provider) return;
    // TODO: remove any local storage or states
  }

  async resolveDid(address: string): Promise<string | null> {
    // if (!this.provider) throw new Error("Provider Undefined!")
    const provider = await this.getProvider()
    const name = await provider.lookupAddress(address);
    console.log(name)
    return name;
  }

  async signMessage(message: string): Promise<void> {
    const signer = await this.getSigner()
    console.log(signer)
    await signer.signMessage(message)
  }


  protected onAccountsChanged(accounts: string[]): void {
    console.log('Account Changed')
  }

  protected onChainChanged(chain: string | number): void {
    console.log('Chain Changed')
  }

  protected onDisconnect(error: Error): void {
    console.log('Wallet disconnected')
  }
}
