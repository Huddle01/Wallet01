import { ChainName } from "./chains";

export type BlockExplorerName = "etherscan";
export type BlockExplorer = { name: string; url: string };

type EtherscanChains = Extract<ChainName, "mainnet" | "polygon">;
export const etherscanBlockExplorers: Record<EtherscanChains, BlockExplorer> = {
  mainnet: {
    name: "Etherscan",
    url: "https://etherscan.io",
  },
  polygon: {
    name: "PolygonScan",
    url: "https://polygonscan.com",
  },
} as const;
