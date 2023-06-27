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
  "3141": {
    chainId: "0x7ab7",
    chainName: "Wallaby filecoin",
    nativeCurrency: {
      name: "Test FIlecoin",
      symbol: "tFIL",
      decimals: 18,
    },
    rpcUrls: [`https://wallaby.node.glif.io/rpc/v0`],
    blockExplorerUrls: [
      "https://wallaby.filscan.io",
      "https://explorer.glif.io/actor/?network=wallaby",
    ],
  },
  "137": {
    chainId: "0x89",
    chainName: "Matic Mainnet",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [`https://polygon.llamarpc.com`],
    blockExplorerUrls: [`https://polygonscan.com`],
  },
  "80001": {
    chainId: "0x13881",
    chainName: "Mumbai",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [`https://rpc-mumbai.maticvigil.com`],
    blockExplorerUrls: [`https://mumbai.polygonscan.com`],
  },
};
