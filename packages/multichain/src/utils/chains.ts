interface ChainData {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  }
  
  interface ChainObj {
    [name: string]: ChainData;
  }
  
  export const chainData: ChainObj = {
    '3141': {
      chainId: '0x7ab7',
      chainName: 'Wallaby filecoin',
      nativeCurrency: {
        name: 'Test FIlecoin',
        symbol: 'tFIL',
        decimals: 18,
      },
      rpcUrls: [`https://wallaby.node.glif.io/rpc/v0`],
      blockExplorerUrls: [
        'https://wallaby.filscan.io',
        'https://explorer.glif.io/actor/?network=wallaby',
      ],
    },
  };
  