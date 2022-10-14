import React, { useState } from 'react'

import { Wallet } from '@huddle01/wallets'
import { ClientConfig } from '@huddle01/wallets'

function useWallet<TProvider> ({ chainConfig, connector }: ClientConfig<TProvider>) {
    const wallet = new Wallet<TProvider>({chainConfig, connector});
    return {
        connect: wallet.connect(),
        disconnect: wallet.disconnect(),
        getDid: wallet.getDid(),
        signMessage: (message: string) => wallet.signMessage(message),
        getAccount: wallet.getAccount()
    }
}

export default useWallet;