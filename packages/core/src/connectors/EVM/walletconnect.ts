import { ExternalProvider } from "@ethersproject/providers";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { hexValue } from "ethers/lib/utils";
import { Web3Provider } from "../../..";
import { BaseConnector, ConnectedData } from "../../types";
import emitter from "../../utils/emiter";


export class WalletconnectConnector extends BaseConnector<WalletConnectProvider> {

    provider?: WalletConnectProvider;
    chain: string;

    constructor(chain: string = '1') {
        super(chain);
        this.chain = chain;
        this.getProvider()
    }

    async getProvider(): Promise<WalletConnectProvider> {
        this.provider = new WalletConnectProvider({
            infuraId: '0a7d1e04fd0845d5994516cfb80e0813',
        });
        return this.provider
    }

    async getAccount(): Promise<string[]> {
        if (!this.provider) throw new Error("Provider Undefined")
        try {
            const accounts = await this.provider.accounts;
            console.log(accounts)
            return accounts
        } catch (error) {
            console.error(error)
            throw new Error("Error in getting accouts")
        }
    }

    async getChainId(): Promise<string> {
        if (!this.provider) throw new Error("Provider Undefined")
        try {
            const id = <string>(<unknown>this.provider.chainId)
            return id;
        } catch (error) {
            console.error(error)
            throw new Error("Error in getting ChainId")
        }
    }

    async switchChain(chainId: string): Promise<void> {
        const provider = await this.getProvider()

        const id = hexValue(chainId)
        try {
            await provider.request(
                {
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: id }]
                }
            )
        } catch (error) {
            console.error(error)
            throw new Error('Error in switching chain')
        }
    }

    async connect(chainId: string): Promise<void> {
        try {
            const provider = await this.getProvider()
            this.provider = provider;

            provider.on('accountsChanged', this.onAccountsChanged);
            provider.on('chainChanged', this.onChainChanged);
            provider.on('disconnect', this.onDisconnect);

            await provider.enable()
            const id = await this.getChainId()

            if (chainId && id !== chainId) {
                await this.switchChain(chainId)
            }

            const data: ConnectedData<WalletConnectProvider> = {
                account: (await this.getAccount())[0],
                chainId: this.chain,
                provider: this.provider
            }

            emitter.emit('connected', data)

        } catch (error) {
            console.error(error)
        }
    }

    async disconnect(): Promise<void> {
        if (!this.provider) throw new Error("No wallet connected")
        this.provider.disconnect()
        emitter.emit('disconnected')
    }

    async resolveDid(address: string): Promise<string | null> {
        if (!this.provider) throw new Error("No wallet connected")
        const _provider = new Web3Provider(<ExternalProvider>(<unknown>this.provider))
        const name = await _provider.lookupAddress(address)
        return name
    }

    async signMessage(message: string): Promise<void> {
        if (!this.provider) throw new Error('Connect a Wallet')
        const _provider = new Web3Provider(<ExternalProvider>(<unknown>this.provider));
        const signer = await _provider.getSigner()
        signer.signMessage(message)
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