import { ethers, providers } from "ethers";
import { hexValue } from "ethers/lib/utils";


import { Connector, ConnectorData } from "./base";
import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from '@metamask/detect-provider'


export type InjectedConnectorOptions = {
  name?: string | ((detectedName: string | string[]) => string);
};

export class InjectedConnector extends Connector<
  Web3Provider,
  providers.JsonRpcSigner
> {
    
  provider: Web3Provider | undefined;

  async getProvider() {
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

      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }

      this.emit("message", { type: "connecting" });

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
    const provider = await this.getProvider()
    const name = await provider.lookupAddress(address);
    return name;
  }

  async signMessage(message: string): Promise<void> {
    const signer = await this.getSigner()
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
