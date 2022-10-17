import { BaseConnector, ConnectedData } from "../../types";
import WalletLink, { WalletLinkProvider } from 'walletlink';
import { hexValue } from "ethers/lib/utils";
import { Web3Provider } from "../../..";
import { ExternalProvider } from "@ethersproject/providers";
import emitter from "../../utils/emiter";


export class CoinbaseConnector extends BaseConnector<WalletLinkProvider> {

    provider?: WalletLinkProvider;
    chain: string;

    constructor(chain: string = '1') {
        super(chain)
        this.chain = chain;
        this.getProvider()
    }

    async getProvider(): Promise<WalletLinkProvider> {
        const client = new WalletLink({
            appName: 'huddle01',
        });
        this.provider = client.makeWeb3Provider(
            'https://mainnet.infura.io/v3/0a7d1e04fd0845d5994516cfb80e0813',
            Number(this.chain)
        );
        return this.provider
    }

    async getAccount(): Promise<string[]> {
        if (!this.provider) throw new Error("Provider Undefined!")
        try {
            const result = await this.provider.send("eth_requestAccounts", [])
            console.log({ result })
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


            provider.on('accountsChanged', this.onAccountsChanged);
            provider.on('chainChanged', this.onChainChanged);
            provider.on('disconnect', this.onDisconnect);

            const id = await this.getChainId()

            if (chainId && id !== chainId) {
                await this.switchChain(chainId);
            }

            const data: ConnectedData<WalletLinkProvider> = {
                account: (await this.getAccount())[0],
                chainId: this.chain,
                provider: this.provider
            }

            emitter.emit('connected', data)

        } catch (err) {
            console.error(err)
        }
    }

    async disconnect(): Promise<void> {
        this.provider = undefined;
        emitter.emit('disconnected')
    }

    async resolveDid(address: string): Promise<string | null> {
        const provider = await this.getProvider()
        const _provider = new Web3Provider(<ExternalProvider>(<unknown>provider));
        const name = await _provider.lookupAddress(address);
        return name;
    }

    async signMessage(message: string): Promise<void> {
        if (!this.provider) throw new Error('Connect a Wallet')
        const _provider = new Web3Provider(<ExternalProvider>(<unknown>this.provider));
        const signer = await _provider.getSigner()
        signer.signMessage(message)
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