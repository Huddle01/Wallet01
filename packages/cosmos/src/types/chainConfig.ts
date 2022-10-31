export type CustomChainConfig = {
  chainNamespace: 'eip155' | 'solana' | 'other';
  chainId: string;
  rpcTarget?: string;
  displayName: string;
  blockExplorer?: string;
  ticker: string;
  tickerName: string;
};
