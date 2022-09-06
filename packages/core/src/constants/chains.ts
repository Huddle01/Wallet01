import { Chain } from "../types";

export const chainId = {
  mainnet: 1,
  polygon: 137,
} as const;

export type ChainName = keyof typeof chainId;

export const mainnet: Chain = {
  id: chainId.mainnet,
  name: "Ethereum",
  network: "homestead",
  // nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  // rpcUrls: {
  //   alchemy: alchemyRpcUrls.mainnet,
  //   default: publicRpcUrls.mainnet,
  //   infura: infuraRpcUrls.mainnet,
  //   public: publicRpcUrls.mainnet,
  // },
  // blockExplorers: {
  //   etherscan: etherscanBlockExplorers.mainnet,
  //   default: etherscanBlockExplorers.mainnet,
  // },
  ens: {
    address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
  },
};

export const polygon: Chain = {
  id: chainId.polygon,
  name: "Polygon",
  network: "matic",
  // nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  // rpcUrls: {
  //   alchemy: alchemyRpcUrls.polygon,
  //   default: publicRpcUrls.polygon,
  //   infura: infuraRpcUrls.polygon,
  //   public: publicRpcUrls.polygon,
  // },
  // blockExplorers: {
  //   etherscan: etherscanBlockExplorers.polygon,
  //   default: etherscanBlockExplorers.polygon,
  // },
  // multicall: {
  //   address: "0xca11bde05977b3631167028862be2a173976ca11",
  //   blockCreated: 25770160,
  // },
};

/**
 * Common chains for convenience
 * Should not contain all possible chains
 */
export const chain = {
  mainnet,
  polygon,
} as const;

export const allChains = [mainnet, polygon];

export const defaultChains: Chain[] = [mainnet, polygon];
