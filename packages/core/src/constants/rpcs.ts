import { ChainName } from "./chains";

export const defaultAlchemyApiKey = "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC";
export const defaultInfuraApiKey = "84842078b09946638c03157f83405213";

export type RpcProviderName = "alchemy" | "infura" | "public";

type AlchemyChains = Extract<ChainName, "mainnet" | "polygon">;
export const alchemyRpcUrls: Record<AlchemyChains, string> = {
  mainnet: "https://eth-mainnet.alchemyapi.io/v2",
  polygon: "https://polygon-mainnet.g.alchemy.com/v2",
} as const;

type InfuraChains = Extract<ChainName, "mainnet" | "polygon">;
export const infuraRpcUrls: Record<InfuraChains, string> = {
  mainnet: "https://mainnet.infura.io/v3",
  polygon: "https://polygon-mainnet.infura.io/v3",
} as const;

type PublicChains = Extract<ChainName, "mainnet" | "polygon">;
export const publicRpcUrls: Record<PublicChains, string> = {
  mainnet: `${alchemyRpcUrls.mainnet}/${defaultAlchemyApiKey}`,
  polygon: "https://polygon-rpc.com",
} as const;
