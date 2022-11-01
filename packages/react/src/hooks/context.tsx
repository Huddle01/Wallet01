import React, { createContext } from "react";
import { BaseConnector, Wallet, CustomChainConfig } from "@huddle01-wallets/core/src";

export const WalletClient = createContext({})

interface WalletConfig {
    children: React.ReactNode;
    provider?: {};
    connector: BaseConnector<any>;
    chainConfig: CustomChainConfig
}


export const WalletConfig: React.FC<WalletConfig> = ({
    children,
    provider,
    connector,
    chainConfig
}) => (
    <WalletClient.Provider value={
        new Wallet<typeof provider>({
            chainConfig: chainConfig,
            connector: connector
        })
    }
    >
        {children}
    </WalletClient.Provider>
)