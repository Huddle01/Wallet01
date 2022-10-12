import { Web3Provider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers, providers } from "ethers";
import { hexValue } from "ethers/lib/utils";
import { BaseConnector, ConnectedData } from "../types";
import emitter from "../utils/emiter";

export class InjectedConnector extends BaseConnector {
    
    provider?: Web3Provider
    chain: string;

    constructor(chain: string = '1') {
        super(chain)
        this.chain = chain;
        this.getProvider()
    }

    async getProvider() {
      const provider = await detectEthereumProvider()
  
      if (provider) {
  
        console.log('Ethereum successfully detected!')
        const _provider = new ethers.providers.Web3Provider(provider)
        return _provider
  
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
  
    async switchChain(chainId: string): Promise<void> {
  
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
  
    async connect(chainId: string) {
      try {
        const provider = await this.getProvider();
        this.provider = provider
  
        if (provider.on) {
          provider.on("accountsChanged", this.onAccountsChanged);
          provider.on("chainChanged", this.onChainChanged);
          provider.on("disconnect", this.onDisconnect);
        }
    
        let id = await this.getChainId()
        // let unsupported = this.isChainUnsupported(id);
        if (chainId && id !== chainId) {
          await this.switchChain?.(chainId);
        }
  
        const data: ConnectedData = {
          account: (await this.getAccount())[0],
          chainId: id,
          provider: this.provider
        }
        
        emitter.emit('connected', data)
      } catch (error) {
        console.error(error)
      }
    }
  
    async disconnect(): Promise<void> {
      this.provider = undefined;
      emitter.emit('disconnected')
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