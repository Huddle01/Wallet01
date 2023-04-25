import { Chains as BananaSupportedChains } from "@rize-labs/banana-wallet-sdk";

export function isBananSupported(chainId: number | string): boolean {
  chainId = normalizeChainId(chainId);
  for (let chain in BananaSupportedChains) {
    let currentChainId = BananaSupportedChains[chain] || -1;
    if (currentChainId == chainId) return true;
  }
  return false;
}

export function getBananaSupportedChain(
  chainId: number | string
): BananaSupportedChains {
  const normalizedChainId = normalizeChainId(chainId);
  let bananaSupportedChain: BananaSupportedChains;
  switch (normalizedChainId) {
    case 80001:
      bananaSupportedChain = BananaSupportedChains.mumbai;
      break;
    case 420:
      bananaSupportedChain = BananaSupportedChains.optimismTestnet;
      break;
    case 5:
      bananaSupportedChain = BananaSupportedChains.goerli;
      break;
    default:
      bananaSupportedChain = BananaSupportedChains.mumbai;
      break;
  }

  return bananaSupportedChain;
}

export function normalizeChainId(chainId: string | number | bigint) {
  if (typeof chainId === "string")
    return Number.parseInt(
      chainId,
      chainId.trim().substring(0, 2) === "0x" ? 16 : 10
    );
  if (typeof chainId === "bigint") return Number(chainId);
  return chainId;
}
