import { BaseConnector } from '@huddle01-wallets/core'
import { useContext } from 'react'
import { WalletClient } from './context'

export const useWallet = () => {
    const client = useContext(WalletClient)

    return client
}