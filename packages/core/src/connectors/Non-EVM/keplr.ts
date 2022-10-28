import { Window as KeplrWindow } from "@keplr-wallet/types";
import { KeplrProvider } from '../../providers'
import { BaseConnector, ConnectedData } from "../../types";
import emitter from "../../utils/emiter";


declare const window: KeplrWindow

export class KeplrConnector extends BaseConnector<KeplrProvider> {

    provider!: KeplrProvider
    chain: string;

    constructor(chain: string) {
        super(chain)
        this.chain = chain;
        this.getProvider();
    }

    async getProvider(): Promise<KeplrProvider> {
        if (
            typeof window !== "undefined" && window.keplr
        ) {
            this.provider = window.keplr
        }
        return this.provider;
    }

    async getAccount(): Promise<string[]> {
        if (!this.provider) throw new Error("Provider undefined")
        try {
            await this.provider.enable(this.chain)
            const { bech32Address } = await this.provider.getKey(this.chain)
            return [bech32Address];
        } catch (error) {
            console.error(error)
            throw new Error("Error in getting accounts")
        }
    }

    async getChainId(): Promise<string> {
        return this.chain;
    }

    async switchChain(chainId: string): Promise<void> {
        if (!this.provider) throw new Error("Provider undefined")
        try {
            await this.provider.enable(chainId);
            console.log(this.chain)
            this.chain = chainId;
            console.log(this.chain)
        }
        catch (err) {
            console.error(err)
            throw new Error("Error in switching chain")
        }
    }

    async connect(chainId: string): Promise<void> {
        try {
            const provider = await this.getProvider();
            if (!provider) throw new Error('Keplr not installed')

            const data: ConnectedData<KeplrProvider> = {
                account: (await this.getAccount())[0],
                chainId: this.chain,
                provider: this.provider
            }

            emitter.emit('connected', data)
        } catch (error) {
            console.error(error)
            throw new Error('Error in Connecting')
        }
    }

    async disconnect(): Promise<void> {
        emitter.emit('disconnected')
    }

    async resolveDid(address: string): Promise<string | null> {
        throw new Error("Cosmos Ecosustem doesn't support DIDs as of now")
    }

    async signMessage(message: string): Promise<void> {
        if (!this.provider) throw new Error("Provider Undefined")
        try {
            console.log(this.chain, (await this.getAccount())[0])
            await this.provider.signArbitrary(this.chain, (await this.getAccount())[0], message)
        } catch (error) {
            console.warn(error)
        }
    }

    protected onAccountsChanged(): void {
        console.log('Account Changed')
    }

    protected onChainChanged(chain: string | number): void {
        console.log('Chain Changed')
    }

    protected onDisconnect(): void {
        console.log('Wallet disconnected')
    }
}